import { useState, useEffect } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "./firebase/FirebaseConfig"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "./Dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Dashboard() {
  const navigate = useNavigate(); // Hook for navigation
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const TOTAL_ROOMS = { Double: 33, Triple: 8, Four: 4 };
  const [availability, setAvailability] = useState({ ...TOTAL_ROOMS });
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("date", "==", today));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let bookedRooms = { Double: 0, Triple: 0, Four: 0 };
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        count++;
        bookedRooms.Double += Number(data.double) || 0;
        bookedRooms.Triple += Number(data.triple) || 0;
        bookedRooms.Four += Number(data.four) || 0;
      });

      setTotalBookings(count);
      setAvailability({
        Double: Math.max(TOTAL_ROOMS.Double - bookedRooms.Double, 0),
        Triple: Math.max(TOTAL_ROOMS.Triple - bookedRooms.Triple, 0),
        Four: Math.max(TOTAL_ROOMS.Four - bookedRooms.Four, 0),
      });
    });

    return () => unsubscribe();
  }, []);

  const totalRoomsAvailable = Object.values(TOTAL_ROOMS).reduce((a, b) => a + b, 0);
  const totalRoomsBooked = totalRoomsAvailable - Object.values(availability).reduce((a, b) => a + b, 0);
  const occupancyRate = ((totalRoomsBooked / totalRoomsAvailable) * 100).toFixed(1);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <button className="sidebar-button" onClick={() => navigate("/")}>
          <i className="fas fa-home"></i> Home
        </button>
        <button className="sidebar-button" onClick={() => navigate("/booking-entry")}>
          <i className="fas fa-bed"></i> Booking Entry
        </button>
        <button className="sidebar-button" onClick={() => navigate("/booking-details")}>
          <i className="fas fa-list"></i> Booking Details
        </button>
        <button className="sidebar-button" onClick={() => navigate("/modify-booking")}>
          <i className="fas fa-edit"></i> Modify Booking
        </button>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Header */}
        <motion.div 
          className="header" 
          animate={{ opacity: [0, 1] }} 
          transition={{ duration: 1 }}
        >
          <span><i className="fas fa-hotel"></i> Right Choice Hotels</span>
          <span><i className="far fa-clock"></i> {currentTime}</span>
        </motion.div>

        {/* Summary Cards */}
        <div className="summary-container">
          <motion.div className="card gradient-card" whileHover={{ scale: 1.05 }}>
            <h2>Current Date</h2>
            <p className="date-text"><i className="fas fa-calendar-alt"></i> {moment().format("YYYY-MM-DD")}</p>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.05 }}>
            <h2>Total Bookings Today</h2>
            <p className="booking-count"><i className="fas fa-book"></i> {totalBookings}</p>
          </motion.div>

          <motion.div className="card gradient-card" whileHover={{ scale: 1.05 }}>
            <h2>Occupancy Rate</h2>
            <p className="occupancy-text"><i className="fas fa-chart-line"></i> {occupancyRate}%</p>
          </motion.div>
        </div>

        {/* Availability Table */}
        <div className="table-container">
          <h2><i className="fas fa-bed"></i> Availability Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Total Rooms</th>
                <th>Booked</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TOTAL_ROOMS).map(([type, total]) => (
                <tr key={type}>
                  <td>{type} Bed</td>
                  <td>{total}</td>
                  <td>{total - availability[type]}</td>
                  <td>{availability[type]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
