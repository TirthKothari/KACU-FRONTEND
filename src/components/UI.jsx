import React from "react";
import { motion } from "framer-motion";

// PALETTE REFERENCE:
// Highlight/Accent: #F0E491 (Pale Cream/Yellow)
// Cards/Container:  #BBC863 (Olive/Muted Lime)
// Interaction:      #658C58 (Sage Green)
// Primary/Text:     #31694E (Deep Forest Green)

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
    "px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border";

  const variants = {
    // Primary: Sage Green background, dark text on hover (or darker green)
    primary:
      "bg-[#658C58] text-white border-transparent hover:bg-[#31694E] shadow-lg shadow-[#658C58]/30 hover:shadow-[#31694E]/30",

    // Outline: Sage Green border and text, highlight tint on hover
    outline:
      "bg-transparent border-[#658C58] text-[#658C58] hover:bg-[#F0E491] hover:text-[#31694E] hover:border-[#F0E491]",

    // White: Clean white look with Deep Green text
    white:
      "bg-white text-[#31694E] border-transparent hover:bg-[#F0E491] hover:text-[#31694E] shadow-md hover:shadow-lg",

    // Ghost: Minimal, text changes from Deep Green to Sage
    ghost:
      "bg-transparent border-transparent text-[#31694E] hover:bg-[#F0E491]/20 hover:text-[#658C58]",

    // Accent: Uses the Pale Yellow for special emphasis
    accent:
      "bg-[#F0E491] text-[#31694E] border-[#F0E491] hover:bg-white hover:border-[#F0E491] shadow-md shadow-[#F0E491]/40",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={18} strokeWidth={2.5} />}
    </button>
  );
};

export const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      bg-white 
      p-8 
      rounded-[2rem] 
      border border-[#BBC863]/20 
      shadow-[0_10px_30px_-10px_rgba(49,105,78,0.05)] 
      hover:shadow-[0_20px_40px_-10px_rgba(101,140,88,0.15)] 
      hover:border-[#658C58]/40 
      transition-all duration-500 
      ${className}
    `}
  >
    {children}
  </div>
);
