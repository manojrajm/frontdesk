import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../src/components/Dashboard";
import BookingEntry from "../src/components/BookingEntry";
import BookingDetails from "../src/components/BookingDetails";
import ModifyBooking from "../src/components/ModifyBooking";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/booking-entry" element={<BookingEntry />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/modify-booking" element={<ModifyBooking />} />
      </Routes>
    </Router>
  );
}
