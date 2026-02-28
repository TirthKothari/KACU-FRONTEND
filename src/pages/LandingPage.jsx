import React from "react";
import { Navbar } from "../components/Navbar";
import { BusinessForm } from "../components/BusinessForm.jsx";
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
  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-[#00ABE4] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <FundingOptions />
        {/* <BusinessForm /> */}
        <PreQualificationForm />
        <CreditScoreSelector />
        <CustomerStories />
        <DarkFeatureSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
