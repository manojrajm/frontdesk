import { useState } from "react";
import styled from "styled-components";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { db } from "./firebase/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const BookingContainer = styled.div`
  max-width: 600px;
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* Stack inputs on small screens */
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 100%; /* Ensure inputs take full width */
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  grid-column: span 2;
  padding: 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: 600px) {
    grid-column: span 1; /* Make it full-width on mobile */
  }
`;

export default function BookingEntry() {
  const [formData, setFormData] = useState({
    name: "",
    bookingType: "",
    mobile: "",
    checkInDate: "",
    checkOutDate: "",
    advanceAmount: "",
    balanceAmount: "",
    totalAmount: "",
    rooms: { double: 0, triple: 0, four: 0 },
    screenshot: null, // Base64 Image
  });

  const [dateError, setDateError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevState) => {
      let newFormData = { ...prevState };

      if (type === "file") {
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, screenshot: reader.result }));
          };
          reader.readAsDataURL(file);
        }
      } else if (name in prevState.rooms) {
        newFormData.rooms = { ...prevState.rooms, [name]: value };
      } else {
        newFormData[name] = value;
      }

      if (name === "totalAmount" || name === "advanceAmount") {
        const total = parseFloat(newFormData.totalAmount) || 0;
        const advance = parseFloat(newFormData.advanceAmount) || 0;
        newFormData.balanceAmount = total - advance;
      }

      if (name === "checkOutDate" && newFormData.checkInDate) {
        if (new Date(value) <= new Date(newFormData.checkInDate)) {
          setDateError("Check-Out Date must be greater than Check-In Date.");
        } else {
          setDateError("");
        }
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const newBooking = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "hotels"), newBooking);

      alert("Booking submitted successfully!");
      setFormData({
        name: "",
        bookingType: "",
        mobile: "",
        checkInDate: "",
        checkOutDate: "",
        advanceAmount: "",
        balanceAmount: "",
        totalAmount: "",
        rooms: { double: 0, triple: 0, four: 0 },
        screenshot: null,
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Try again.");
    }
  };

  return (
    <BookingContainer>
      <h2>
        <i className="fas fa-calendar-check"></i> Booking Entry
      </h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Booking Type</Label>
          <Input type="text" name="bookingType" value={formData.bookingType} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Mobile Number</Label>
          <Input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Check-In Date</Label>
          <Input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Check-Out Date</Label>
          <Input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />
          {dateError && <ErrorText>{dateError}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Advance Amount</Label>
          <Input type="number" name="advanceAmount" value={formData.advanceAmount} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Label>Balance Payment</Label>
          <Input type="number" name="balanceAmount" value={formData.balanceAmount} readOnly />
        </FormGroup>

        <FormGroup>
          <Label>Total Amount</Label>
          <Input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>Double Bed Rooms</Label>
          <Input
            type="number"
            name="double"
            value={formData.rooms.double}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>Triple Bed Rooms</Label>
          <Input
            type="number"
            name="triple"
            value={formData.rooms.triple}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>Four Bed Rooms</Label>
          <Input
            type="number"
            name="four"
            value={formData.rooms.four}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>



        <FormGroup>
          <Label>Upload Screenshot</Label>
          <Input type="file" name="screenshot" onChange={handleChange} accept="image/*" />
          {formData.screenshot && <img src={formData.screenshot} alt="Uploaded Preview" style={{ width: "200px", marginTop: "10px" }} />}
        </FormGroup>

        <SubmitButton type="submit">Submit Booking</SubmitButton>
      </Form>
    </BookingContainer>
  );
}
