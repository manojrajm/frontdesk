import { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  color: #007bff;
  font-size: 22px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  transition: 0.3s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.disabled ? "#b3d7ff" : "#007bff")};
  color: white;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: 0.3s ease;
  &:hover {
    background: ${(props) => (props.disabled ? "#b3d7ff" : "#0056b3")};
  }
`;

const Message = styled.p`
  font-size: 16px;
  margin-top: 10px;
  color: ${(props) => (props.success ? "green" : "red")};
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 1s linear infinite;
  margin: 10px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function ModifyBooking() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setMessage("");
    setBooking(null);
    setLoading(true);

    try {
      const q = query(
        collection(db, "hotels"),
        where("name", "==", name),
        where("checkInDate", "==", date)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setMessage("No booking found.");
        setLoading(false);
        return;
      }

      const docData = querySnapshot.docs[0];
      setBooking({ id: docData.id, ...docData.data() });
    } catch (error) {
      setMessage("Error fetching booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!booking) return;

    setUpdating(true);
    try {
      const bookingRef = doc(db, "hotels", booking.id);
      await updateDoc(bookingRef, booking);
      setMessage("Booking updated successfully!");
    } catch (error) {
      setMessage("Error updating booking.");
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setBooking((prevState) => {
      let updatedBooking = { ...prevState };
  
      if (name.startsWith("rooms.")) {
        // Handle nested rooms object (e.g., "rooms.double")
        const roomType = name.split(".")[1];
        updatedBooking.rooms = { ...prevState.rooms, [roomType]: parseInt(value) || 0 };
      } else {
        updatedBooking[name] = value;
      }
  
      // Auto-calculate balanceAmount
      if (name === "advanceAmount" || name === "totalAmount") {
        const total = parseFloat(updatedBooking.totalAmount) || 0;
        const advance = parseFloat(updatedBooking.advanceAmount) || 0;
        updatedBooking.balanceAmount = total - advance;
      }
  
      return updatedBooking;
    });
  };
  
  return (
    <Container>
      <Title>Modify Booking</Title>

      <FormGroup>
        <Label>Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter guest name"
        />
      </FormGroup>
      <FormGroup>
        <Label>Check-in Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormGroup>
      <Button onClick={handleSearch} disabled={loading}>
        {loading ? <Loader /> : "Search Booking"}
      </Button>

      {message && <Message success={message.includes("successfully")}>{message}</Message>}

      {booking && (
        <>
          <hr style={{ margin: "20px 0" }} />
          <h3 style={{ color: "#007bff" }}>Modify Booking Details</h3>

          {[
            { label: "Mobile", name: "mobile" },
            { label: "Booking Type", name: "bookingType" },
            { label: "Check-in Date", name: "checkInDate", type: "date" },
            { label: "Check-out Date", name: "checkOutDate", type: "date" },
            { label: "Advance Amount", name: "advanceAmount", type: "number" },
            { label: "Total Amount", name: "totalAmount", type: "number" },
            { label: "Balance Amount", name: "balanceAmount", type: "number", readOnly: true },
            { label: "Double Bed Rooms", name: "rooms.double", type: "number" },
            { label: "Triple Bed Rooms", name: "rooms.triple", type: "number" },
            { label: "Four Bed Rooms", name: "rooms.four", type: "number" },
          ].map(({ label, name, type = "text", readOnly }) => (
            <FormGroup key={name}>
              <Label>{label}</Label>
              <Input
                type={type}
                name={name}
                value={name.includes("rooms.") ? booking.rooms?.[name.split(".")[1]] || 0 : booking[name]}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </FormGroup>
          ))}

          <Button onClick={handleUpdate} disabled={updating}>
            {updating ? <Loader /> : "Update Booking"}
          </Button>
        </>
      )}
    </Container>
  );
}
