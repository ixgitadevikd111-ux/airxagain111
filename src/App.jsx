// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfileSetup from "./pages/ProfileSetup";
import DoctorPanel from "./doctor/DoctorPanel";
import PharmacyPanel from "./pharmacy/PharmacyPanel";
import LabDashboard from "./lab/LabDashboard";
import AdminPanel from "./admin/AdminPanel";
import PatientPanel from "./patient/PatientPanel";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import PrescriptionPrint from "./doctor/PrescriptionPrint"; // ✅ IMPORT ADDED

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<DoctorPanel />} />
          <Route path="/pharmacy" element={<PharmacyPanel />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/patient" element={<PatientPanel />} />
          <Route path="/test-subscription" element={<SubscriptionSuccess />} />

          {/* ✅ NEW ROUTE FOR PRINTING */}
          <Route
            path="/print/:patientId/:prescriptionId"
            element={<PrescriptionPrint />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
