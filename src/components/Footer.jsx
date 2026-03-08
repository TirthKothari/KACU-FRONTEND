import React from "react";
import { ArrowRight } from "lucide-react";

export const Footer = () => (
  <footer className="bg-[#31694E] text-white pt-24 pb-12 border-t border-[#658C58]/30 relative overflow-hidden">
    {/* Subtle Decorative Background Blob */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#658C58] rounded-full blur-[150px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2 mb-6 group cursor-default">
            <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform duration-300 group-hover:rotate-6">
              <span className="text-[#31694E] font-extrabold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Kacu
            </span>
          </div>
          <p className="text-slate-200 leading-relaxed opacity-80 font-light">
            Empowering businesses across the USA and Canada with organic, fast,
            and reliable funding solutions since 2025.
          </p>
        </div>

        {/* Services Column */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-[#F0E491]">Services</h4>
          <ul className="space-y-4 text-slate-200">
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                Term Loans
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                Lines of Credit
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                Equipment Financing
              </a>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-[#F0E491]">Company</h4>
          <ul className="space-y-4 text-slate-200">
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#F0E491] transition-colors flex items-center gap-1 group"
              >
                <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 h-[2px] bg-[#BBC863] rounded-full"></span>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-[#F0E491]">
            Stay Updated
          </h4>
          <p className="text-sm text-slate-300 mb-4 font-light">
            Join our network for the latest financial tips.
          </p>
          <div className="flex gap-2 bg-[#2A5240] p-1.5 rounded-full border border-[#658C58]/50 focus-within:border-[#F0E491] focus-within:ring-2 focus-within:ring-[#F0E491]/20 transition-all duration-300">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-none px-4 py-2 w-full text-white focus:outline-none placeholder:text-[#BBC863]/70 font-medium"
            />
            <button className="bg-[#658C58] p-3 rounded-full text-white hover:bg-[#F0E491] hover:text-[#31694E] transition-all duration-300 shadow-md">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#658C58]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-300 text-sm">
        <span className="opacity-80">
          &copy; 2025 Kacu Financial. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a
            href="#"
            className="hover:text-[#F0E491] transition-colors font-medium"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-[#F0E491] transition-colors font-medium"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
);
