import React from "react";
import { motion } from "framer-motion";

// --- THEME CONSTANTS ---
// Primary: #00ABE4 (Bright Blue)
// Dark Contrast: #0F172A (Slate 900)
// Light BG: #E9F1FA (Light Blue)

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  icon: Icon,
  type = "button",
  disabled = false,
}) => {
  const baseStyle =
    "px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#00ABE4] text-white hover:bg-[#0095c8] shadow-lg shadow-[#00ABE4]/30 hover:shadow-[#00ABE4]/40",
    outline: "border-2 border-[#00ABE4] text-[#00ABE4] hover:bg-[#E9F1FA]",
    white: "bg-white text-[#0F172A] hover:bg-slate-100 shadow-lg",
    ghost: "text-slate-600 hover:text-[#00ABE4] bg-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </button>
  );
};

export const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}
  >
    {children}
  </div>
);
