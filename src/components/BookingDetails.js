import { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig"; // Ensure the correct path
import styled from "styled-components";

const Container = styled.div`
  max-width: 1100px;
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #007bff;
  margin-bottom: 15px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 250px;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background: #007bff;
  color: white;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const ScreenshotImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const NoData = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: darkred;
  }
`;

// Modal styling for full-size image display
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
`;

const FullSizeImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;  // Ensures the image fits without distortion
  border-radius: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  &:hover {
    background: lightgray;
  }
`;

export default function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [modalImage, setModalImage] = useState(null); // Modal state

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (name, checkInDate) => {
    try {
      const q = query(collection(db, "hotels"), where("name", "==", name), where("checkInDate", "==", checkInDate));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No matching bookings found!");
        return;
      }

      const deletePromises = querySnapshot.docs.map(docRef => deleteDoc(doc(db, "hotels", docRef.id)));

      await Promise.all(deletePromises);
      alert("Booking deleted successfully!");

      setBookings(prevBookings => prevBookings.filter(booking => !(booking.name === name && booking.checkInDate === checkInDate)));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesName = searchName
      ? booking.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? booking.checkInDate === searchDate || booking.checkOutDate === searchDate
      : true;

    return matchesName && matchesDate;
  });

  return (
    <Container>
      <Title>Booking Details</Title>

      <SearchContainer>
        <Input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          placeholder="Filter by Date"
        />
      </SearchContainer>

      {filteredBookings.length > 0 ? (
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Name</Th>
                <Th>Booking Type</Th>
                <Th>Mobile</Th>
                <Th>Rooms Booked</Th>
                <Th>Check-in Date</Th>
                <Th>Check-out Date</Th>
                <Th>Total Amount</Th>
                <Th>Advance</Th>
                <Th>Balance</Th>
                <Th>Screenshot</Th>
                <Th>Action</Th>
              </tr>
            </Thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index}>
                  <Td>{booking.name}</Td>
                  <Td>{booking.bookingType}</Td>
                  <Td>{booking.mobile}</Td>
                  <Td>
                    {Object.entries(booking.rooms || {}).map(([roomType, count]) => (
                      <div key={roomType}>
                        {roomType}: {count}
                      </div>
                    ))}
                  </Td>
                  <Td>{booking.checkInDate}</Td>
                  <Td>{booking.checkOutDate}</Td>
                  <Td>{booking.totalAmount}</Td>
                  <Td>{booking.advanceAmount}</Td>
                  <Td>{booking.balanceAmount}</Td>
                  <Td>
                    {booking.screenshot ? (
                      <ScreenshotImage
                        src={booking.screenshot}
                        alt="Screenshot"
                        onClick={() => setModalImage(booking.screenshot)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </Td>
                  <Td>
                    <DeleteButton onClick={() => handleDelete(booking.name, booking.checkInDate)}>
                      Delete
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      ) : (
        <NoData>No bookings found.</NoData>
      )}

{modalImage && (
  <ModalOverlay onClick={() => setModalImage(null)}>
    <ModalContent>
      <FullSizeImage src={modalImage} alt="Full Size" />
      <CloseButton onClick={() => setModalImage(null)}>X</CloseButton>
    </ModalContent>
  </ModalOverlay>
)}

    
    </Container>
  );
}
