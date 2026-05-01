import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ApplicationWizard from "./pages/ApplicationWizard";
import ClientDashboard from "./pages/ClientDashboard";
import LoginPage from "./pages/LoginPage";
import AgentDashboard from "./pages/AgnetDashboard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clientdashboard" element={<ClientDashboard />} />
          <Route path="/agentdashboard" element={<AgentDashboard />} />
          <Route path="/wizard" element={<ApplicationWizard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
