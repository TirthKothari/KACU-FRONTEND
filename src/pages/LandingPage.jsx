import React, { useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PreQualificationForm } from "../components/prequalificationForm.jsx";
import {
  Hero,
  TrustStrip,
  FundingOptions,
  CreditScoreSelector,
  DarkFeatureSection,
  CustomerStories,
} from "../components/LandingSections";

const LandingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef(null);

  const handleShowForm = () => {
    setIsFormVisible(true);
    // Timeout ensures the element is rendered in the DOM before scrolling
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-[#00ABE4] selection:text-white">
      {/* Pass the toggle function to the Navbar */}
      <Navbar onStartClick={handleShowForm} />

      <main>
        <Hero />
        <TrustStrip />
        <FundingOptions />

        {/* Form is hidden until isFormVisible is true */}
        {isFormVisible && (
          <div
            ref={formRef}
            className="scroll-mt-24 transition-all duration-700 animate-in fade-in slide-in-from-bottom-10"
          >
            <PreQualificationForm />
          </div>
        )}

        <CreditScoreSelector />
        <CustomerStories />
        <DarkFeatureSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
