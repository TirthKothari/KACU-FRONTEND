import React, { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

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
      className="relative group h-full flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 ${
          isHovered
            ? "bg-[#658C58]/10 text-[#31694E]"
            : "text-[#31694E]/80 hover:text-[#31694E]"
        } font-semibold text-sm tracking-wide`}
      >
        {item.title}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 text-[#BBC863] ${isHovered ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-full left-0 pt-4 z-50"
            style={{ width: item.columns === 2 ? "550px" : "260px" }}
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(49,105,78,0.2)] border border-[#BBC863]/20 overflow-hidden p-2">
              <div
                className={`grid ${item.columns === 2 ? "grid-cols-2 gap-2" : "grid-cols-1 gap-1"}`}
              >
                {item.items.map((subItem, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#F0E491]/10 transition-colors group/item relative overflow-hidden"
                  >
                    <div className="mt-1 w-10 h-10 rounded-xl bg-[#658C58]/10 flex items-center justify-center text-[#658C58] group-hover/item:bg-[#31694E] group-hover/item:text-[#F0E491] transition-all duration-300">
                      <subItem.icon size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#31694E]">
                        {subItem.name}
                      </div>
                      {subItem.desc && (
                        <div className="text-[11px] text-[#658C58] mt-0.5 font-medium">
                          {subItem.desc}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
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
    <div className="border-b border-[#BBC863]/10 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-lg font-bold text-[#31694E]"
      >
        {item.title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 space-y-2">
              {item.items.map((subItem, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center gap-3 p-2 text-sm font-medium text-[#31694E]/80"
                >
                  <subItem.icon size={18} /> {subItem.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = ({ onStartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) =>
    setIsScrolled(latest > 20),
  );

  const handleStart = () => {
    setMobileMenuOpen(false);
    if (onStartClick) onStartClick(); // Triggers the reveal and scroll in LandingPage
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 ${isScrolled ? "pt-4" : "pt-6"}`}
      >
        <div
          className={`container mx-auto max-w-7xl transition-all duration-300 relative rounded-full border ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg border-white/50 py-3 px-6" : "bg-transparent border-transparent py-4 px-0"}`}
        >
          <div className="flex justify-between items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative w-10 h-10 bg-[#31694E] rounded-xl flex items-center justify-center text-[#F0E491] font-bold text-xl">
                K
              </div>
              <span className="text-2xl font-extrabold text-[#31694E]">
                Kacu
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
              {MENU_ITEMS.map((item, idx) => (
                <NavItem key={idx} item={item} />
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a href="#" className="text-sm font-bold text-[#31694E]">
                Log In
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="relative px-6 py-2.5 bg-[#31694E] text-white rounded-full font-bold text-sm shadow-lg overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-[#31694E] transition-colors duration-300">
                  Get Started{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F0E491] to-[#BBC863] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
            </div>

            <button
              className="lg:hidden p-2 text-[#31694E]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/60 backdrop-blur-xl lg:hidden pt-28"
          >
            <div className="container mx-auto px-6 h-full overflow-y-auto">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-[#BBC863]/20 p-6">
                {MENU_ITEMS.map((item, idx) => (
                  <MobileNavItem key={idx} item={item} />
                ))}
                <div className="mt-8 pt-6 border-t border-[#BBC863]/20 space-y-4">
                  <button
                    onClick={handleStart}
                    className="w-full py-4 bg-[#31694E] text-[#F0E491] rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    Get Started Now <Sparkles size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
