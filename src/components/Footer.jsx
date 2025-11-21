import React from "react";
import { ArrowRight } from "lucide-react";

export const Footer = () => (
  <footer className="bg-[#0F172A] text-white pt-24 pb-12 border-t border-slate-800">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#00ABE4] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-2xl font-bold">Kacu</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Empowering businesses across the USA and Canada with fast, reliable
            funding solutions since 2025.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Services</h4>
          <ul className="space-y-4 text-slate-400">
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                Term Loans
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                Lines of Credit
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                Equipment Financing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-slate-400">
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                Partners
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#00ABE4] transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
          <div className="flex gap-2 bg-slate-800 p-1 rounded-full border border-slate-700">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-none px-4 py-2 w-full text-white focus:outline-none placeholder:text-slate-500"
            />
            <button className="bg-[#00ABE4] p-3 rounded-full hover:bg-[#0095c8] transition-colors shadow-lg shadow-[#00ABE4]/20">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <span>&copy; 2025 Kacu Financial. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
);
