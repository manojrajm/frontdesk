
<div align="center">
  <a href="https://github.com/pmanojrajm/frontend">
    <img src="../frontend/public/Logo.png" alt="Logo" width="120" height="120"> 
  </a>
  <h1>FrontDesk</h1>
</div>


## Overview
This project is a **Hotel Booking Management System** built with **React** for the frontend and **Firebase (Firestore & Storage)** for backend services. It allows hotel staff to manage room bookings, track availability, upload & view booking images, and generate booking reports in Excel format.

## Features
- **Booking Management**: Add, modify, and delete hotel bookings.
- **Real-time Availability**: Displays real-time room availability based on bookings.
- **Image Upload**: Upload and store booking screenshots.
- **Search & Filter**: Search bookings by name and date.
- **Booking Reports**: Download bookings as an Excel file.
- **Responsive UI**: Designed for mobile and desktop compatibility.

## Tech Stack
- **Frontend**: React, Styled Components
- **Backend**: Firebase Firestore, Firebase Storage
- **Other Dependencies**:
  - `react-csv` for CSV/Excel download
  - `firebase` for database interactions
  - `styled-components` for UI styling

## Installation & Setup
### Prerequisites
Ensure you have **Node.js** installed. You also need a Firebase project set up.

### Clone the Repository
```sh
git clone https://github.com/your-repository/hotel-booking-system.git
cd hotel-booking-system
```

### Install Dependencies
```sh
npm install
```

### Configure Firebase
1. Create a **Firebase Project** at [Firebase Console](https://console.firebase.google.com/)
2. Add a **Firestore Database** and **Storage**
3. Generate Firebase config and add it in `src/firebase/FirebaseConfig.js`

Example `FirebaseConfig.js`:
```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Run the Application
```sh
npm start
```

## Usage
1. **Booking Entry**: Add a new booking with guest details.
2. **Booking Details**: View, search, and filter bookings.
3. **Delete Booking**: Remove a booking from the system.
4. **Download Report**: Click the **Download Excel** button to save booking details.

## Project Structure
```
/src
  ├── components/   # Reusable UI Components
  ├── firebase/     # Firebase configuration
  ├── pages/        # Main app pages
  ├── styles/       # Global styles
  ├── App.js        # Entry point
  ├── index.js      # Renders the app
```

## Deployment
You can deploy the project using **Vercel**, **Netlify**, or **Firebase Hosting**.

Example (Firebase Hosting):
```sh
npm run build
firebase deploy
```

## Future Improvements
- Authentication (Admin login)
- Payment Gateway Integration
- Advanced Reporting & Analytics


---


