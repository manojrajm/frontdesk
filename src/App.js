import { useEffect } from "react";
import "./App.css";
import BookingDetails from "./components/BookingDetails";
import BookingEntry from "./components/BookingEntry";
import Dashboard from "./components/Dashboard";
import { db } from "./components/firebase/FirebaseConfig"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import ModifyBooking from "./components/ModifyBooking";

function App() {
  useEffect(() => {
    const getHotelDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hotels")); // Fetch data
        const hotels = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Hotel Details:", hotels); // Print in console
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    getHotelDetails(); // Call function
  }, []);

  return (
    <div className="App">
      <Dashboard />
      <BookingEntry />
      <BookingDetails />
      <ModifyBooking/>
    </div>
  );
}

export default App;
