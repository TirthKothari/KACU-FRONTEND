import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  BarChart,
  TrendingUp,
  CreditCard,
  Zap,
  Store,
  Layers,
  Users,
  Star,
  FileText,
  HelpCircle,
  UserPlus,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// PALETTE REFERENCE:
// Highlight/Accent: #F0E491 (Pale Cream/Yellow)
// Cards/Container:  #BBC863 (Olive/Muted Lime)
// Interaction:      #658C58 (Sage Green)
// Primary/Text:     #31694E (Deep Forest Green)

const MENU_ITEMS = [
  {
    title: "Our Services",
    columns: 2,
    items: [
      {
        name: "Term Business Loan",
        icon: BarChart,
        desc: "Fixed terms & rates",
      },
      { name: "Working Capital", icon: TrendingUp, desc: "Daily ops funding" },
      { name: "Line of Credit", icon: CreditCard, desc: "Flexible access" },
      { name: "Equipment Financing", icon: Zap, desc: "Machinery & tools" },
      {
        name: "Merchant Cash Advance",
        icon: Store,
        desc: "Future sales revenue",
      },
      { name: "Debt Consolidation", icon: Layers, desc: "Simplify payments" },
    ],
  },
  {
    title: "Company",
    items: [
      { name: "About Us", icon: Users },
      { name: "Reviews", icon: Star },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Blog", icon: FileText },
      { name: "FAQ", icon: HelpCircle },
    ],
  },
  {
    title: "Partners",
    items: [
      { name: "Become a Partner", icon: UserPlus },
      { name: "Partner Login", icon: LogIn },
    ],
  },
];

const NavItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-1 text-[#31694E] hover:text-[#658C58] font-semibold transition-colors py-4">
        {item.title}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 text-[#BBC863] ${isHovered ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(49,105,78,0.15)] border border-[#BBC863]/20 p-4 z-50
              ${item.columns === 2 ? "w-[500px]" : "w-[240px]"}
            `}
          >
            <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
            <div
              className={`grid ${item.columns === 2 ? "grid-cols-2 gap-4" : "grid-cols-1 gap-2"}`}
            >
              {item.items.map((subItem, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F0E491]/20 transition-colors group/item"
                >
                  <div className="mt-1 text-[#BBC863] group-hover/item:text-[#658C58] transition-colors">
                    <subItem.icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#31694E] group-hover/item:text-[#658C58] transition-colors">
                      {subItem.name}
                    </div>
                    {subItem.desc && (
                      <div className="text-xs text-[#BBC863] mt-0.5 leading-tight font-medium opacity-80">
                        {subItem.desc}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNavItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#BBC863]/20 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-lg font-bold text-[#31694E]"
      >
        {item.title}
        <ChevronDown
          size={16}
          className={`text-[#BBC863] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 space-y-3">
              {item.items.map((subItem, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center gap-3 text-[#658C58] hover:text-[#31694E] transition-colors"
                >
                  <subItem.icon size={16} />
                  <span className="text-sm font-medium">{subItem.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => {
    setMobileMenuOpen(false);
    navigate("/wizard");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-[#BBC863]/20 py-2" : "bg-transparent border-transparent py-5"}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-[#31694E] rounded-xl flex items-center justify-center shadow-lg shadow-[#31694E]/20 transition-transform group-hover:scale-105 duration-300">
            <span className="text-[#F0E491] font-bold text-xl">K</span>
          </div>
          <span className="text-2xl font-extrabold text-[#31694E] tracking-tight group-hover:text-[#658C58] transition-colors">
            Kacu
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {MENU_ITEMS.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-[#658C58] text-white rounded-full font-bold text-sm shadow-lg shadow-[#658C58]/30 hover:bg-[#31694E] transition-all flex items-center gap-2 group border border-transparent hover:border-[#F0E491]/30"
          >
            Get Started
            <ArrowRight
              size={16}
              className="text-[#F0E491] group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#31694E] p-2 hover:bg-[#F0E491]/20 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#BBC863]/20 lg:hidden h-[90vh] overflow-y-auto"
          >
            <div className="p-6 flex flex-col">
              {MENU_ITEMS.map((item, idx) => (
                <MobileNavItem key={idx} item={item} />
              ))}
              <div className="mt-8 pt-6 border-t border-[#BBC863]/20">
                <button
                  onClick={handleStart}
                  className="w-full py-4 bg-[#658C58] text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#31694E] transition-colors"
                >
                  Get Started{" "}
                  <ArrowRight size={20} className="text-[#F0E491]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
