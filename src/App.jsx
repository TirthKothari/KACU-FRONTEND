import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ApplicationWizard from "./pages/ApplicationWizard";
import ClientDashboard from "./pages/ClientDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/wizard" element={<ApplicationWizard />} />
      </Routes>
    </Router>
  );
};

export default App;
