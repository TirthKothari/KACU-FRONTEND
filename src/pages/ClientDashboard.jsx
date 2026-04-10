// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Home,
//   FileText,
//   ChevronLeft,
//   Folder,
//   MessageCircle,
//   User,
//   LogOut,
//   Briefcase,
//   DollarSign,
//   Upload,
//   Download,
//   CheckCircle,
//   Bell,
//   Settings,
//   ChevronRight,
//   Paperclip,
//   Send,
//   Leaf,
//   Menu,
//   X,
//   Sparkles,
//   ArrowRight,
//   Clock,
// } from "lucide-react";

// // --- THEME PALETTE ---
// const THEME = {
//   primary: "#31694E",
//   secondary: "#658C58",
//   tertiary: "#BBC863",
//   accent: "#F0E491",
//   bg: "#FDFDF8",
// };

// // --- MOCK DATA ---
// const USER = {
//   name: "John Doe",
//   role: "EcoVentures Owner",
//   company: "GreenLeaf Solutions",
//   avatar: "JD",
//   email: "john@greenleaf.com",
// };

// // --- SHARED COMPONENTS ---
// const Card = ({ children, className = "" }) => (
//   <div
//     className={`bg-white rounded-xl border border-[#BBC863]/30 shadow-sm ${className}`}
//   >
//     {children}
//   </div>
// );

// const ApplicationWizard = ({ isOpen, onClose, onComplete, userName }) => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     business_legal_name: "",
//     business_dba_name: "",
//     business_email: "",
//     business_phone_number: "",
//     business_website: "",
//     business_state: "",
//     business_address: "",
//     business_city: "",
//     business_zip_code: "",
//     business_industry_type: "",
//     business_legal_entity_type: "llc",
//     business_length_of_ownership: "",
//     business_average_gross_monthly_sales: "",
//     loan_amount_requested: "",
//     loan_purpose: "",
//     loan_term_requested: "",
//     owner_first_name: "",
//     owner_last_name: "",
//     owner_ssn: "",
//     owner_percentage_of_ownership: "",
//     signature_name: "",
//     terms_accepted: false,
//   });

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   if (!isOpen) return null;

//   const totalSteps = 4;
//   const progress = (step / totalSteps) * 100;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#31694E]/60 backdrop-blur-sm">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-[#BBC863]/30"
//       >
//         {/* Wizard Header */}
//         <div className="p-6 md:p-8 border-b border-[#BBC863]/10 bg-[#FDFDF8] flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-[#F0E491] rounded-2xl flex items-center justify-center text-[#31694E]">
//               <Sparkles size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-[#31694E]">
//                 New Funding Request
//               </h2>
//               <div className="flex items-center gap-2 mt-1">
//                 <div className="w-32 h-1.5 bg-[#BBC863]/20 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-[#658C58] transition-all duration-500"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//                 <span className="text-[10px] font-bold text-[#658C58] uppercase tracking-wider">
//                   Step {step} of 4
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-3 hover:bg-red-50 text-red-400 rounded-full transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Wizard Body */}
//         <div className="flex-1 overflow-y-auto p-6 md:p-12">
//           {step === 1 && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
//               <div className="border-l-4 border-[#658C58] pl-4">
//                 <h3 className="text-lg font-bold text-[#31694E]">
//                   Business Basics
//                 </h3>
//                 <p className="text-sm text-[#658C58]">
//                   Tell us about your company legal structure
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-[#31694E] uppercase">
//                     Legal Business Name
//                   </label>
//                   <input
//                     name="business_legal_name"
//                     onChange={handleInput}
//                     className="w-full p-4 rounded-xl border border-[#BBC863]/30 focus:border-[#658C58] outline-none transition-all"
//                     placeholder="GreenLeaf Solutions LLC"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-[#31694E] uppercase">
//                     Business Email
//                   </label>
//                   <input
//                     name="business_email"
//                     onChange={handleInput}
//                     className="w-full p-4 rounded-xl border border-[#BBC863]/30 focus:border-[#658C58] outline-none transition-all"
//                     placeholder="hello@greenleaf.com"
//                   />
//                 </div>
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-xs font-bold text-[#31694E] uppercase">
//                     Physical Address
//                   </label>
//                   <textarea
//                     name="business_address"
//                     onChange={handleInput}
//                     className="w-full p-4 rounded-xl border border-[#BBC863]/30 focus:border-[#658C58] outline-none min-h-[100px]"
//                     placeholder="123 Eco St, Suite 100"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
//               <div className="border-l-4 border-[#658C58] pl-4">
//                 <h3 className="text-lg font-bold text-[#31694E]">
//                   Funding Details
//                 </h3>
//                 <p className="text-sm text-[#658C58]">
//                   How much capital do you need?
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-[#31694E] uppercase">
//                     Loan Amount Requested ($)
//                   </label>
//                   <div className="relative">
//                     <DollarSign
//                       size={16}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 text-[#658C58]"
//                     />
//                     <input
//                       name="loan_amount_requested"
//                       type="number"
//                       onChange={handleInput}
//                       className="w-full p-4 pl-10 rounded-xl border border-[#BBC863]/30 focus:border-[#658C58] outline-none"
//                       placeholder="50000"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-[#31694E] uppercase">
//                     Loan Purpose
//                   </label>
//                   <select
//                     name="loan_purpose"
//                     onChange={handleInput}
//                     className="w-full p-4 rounded-xl border border-[#BBC863]/30 bg-white focus:border-[#658C58] outline-none"
//                   >
//                     <option value="">Select Purpose</option>
//                     <option value="expansion">Expansion</option>
//                     <option value="equipment">Equipment</option>
//                     <option value="inventory">Inventory</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
//               <div className="border-l-4 border-[#658C58] pl-4">
//                 <h3 className="text-lg font-bold text-[#31694E]">Ownership</h3>
//                 <p className="text-sm text-[#658C58]">
//                   Primary stakeholder information
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <input
//                   name="owner_first_name"
//                   placeholder="First Name"
//                   onChange={handleInput}
//                   className="p-4 rounded-xl border border-[#BBC863]/30"
//                 />
//                 <input
//                   name="owner_last_name"
//                   placeholder="Last Name"
//                   onChange={handleInput}
//                   className="p-4 rounded-xl border border-[#BBC863]/30"
//                 />
//                 <input
//                   name="owner_ssn"
//                   placeholder="SSN (XXX-XX-XXXX)"
//                   onChange={handleInput}
//                   className="p-4 rounded-xl border border-[#BBC863]/30 md:col-span-2"
//                 />
//               </div>
//             </div>
//           )}

//           {step === 4 && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 text-center max-w-lg mx-auto">
//               <ShieldCheck size={48} className="text-[#658C58] mx-auto" />
//               <div>
//                 <h3 className="text-2xl font-bold text-[#31694E]">Agreement</h3>
//                 <p className="text-sm text-[#658C58] mt-2">
//                   By signing below, you agree to our processing terms.
//                 </p>
//               </div>
//               <div className="bg-[#FDFDF8] p-6 rounded-2xl border border-[#BBC863]/20 text-left space-y-4">
//                 <div className="flex items-start gap-3">
//                   <input
//                     type="checkbox"
//                     name="terms_accepted"
//                     onChange={handleInput}
//                     className="mt-1 w-5 h-5 rounded accent-[#658C58]"
//                   />
//                   <label className="text-xs text-[#31694E] leading-relaxed">
//                     I confirm that the information provided belongs to{" "}
//                     {formData.business_legal_name || "the company"} and is
//                     accurate to the best of my knowledge.
//                   </label>
//                 </div>
//                 <input
//                   name="signature_name"
//                   placeholder="Type Full Name to Sign"
//                   onChange={handleInput}
//                   className="w-full p-4 rounded-xl border border-[#BBC863]/30 bg-white font-serif italic text-lg"
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Wizard Footer */}
//         <div className="p-6 md:p-8 border-t border-[#BBC863]/10 flex justify-between items-center bg-[#FDFDF8]">
//           <button
//             onClick={() => setStep((s) => s - 1)}
//             disabled={step === 1}
//             className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[#658C58] disabled:opacity-20 transition-all hover:bg-[#658C58]/5"
//           >
//             <ChevronLeft size={18} /> Back
//           </button>

//           {step < totalSteps ? (
//             <button
//               onClick={() => setStep((s) => s + 1)}
//               className="bg-[#31694E] text-[#F0E491] px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
//             >
//               Continue <ChevronRight size={18} />
//             </button>
//           ) : (
//             <button
//               onClick={() => onComplete(formData)}
//               disabled={!formData.terms_accepted || !formData.signature_name}
//               className="bg-[#658C58] text-white px-12 py-3 rounded-xl font-bold shadow-lg shadow-[#658C58]/30 disabled:opacity-50 transition-all hover:bg-[#31694E]"
//             >
//               Submit Application
//             </button>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // --- DASHBOARD VIEW ---
// const DashboardView = ({ onChangeTab, user }) => {
//   const [isFirstTime, setIsFirstTime] = useState(true);
//   const [wizardOpen, setWizardOpen] = useState(false);

//   const handleApplicationSubmit = (data) => {
//     console.log("SENDING TO DJANGO API:", data);
//     setWizardOpen(false);
//     setIsFirstTime(false);
//     // In real app, trigger a refresh of the application list from backend
//   };

//   if (isFirstTime) {
//     return (
//       <div className="space-y-8 animate-in fade-in duration-1000">
//         {/* Welcome Text Section */}
//         <div className="max-w-2xl">
//           <h2 className="text-3xl md:text-5xl font-black text-[#31694E] leading-tight">
//             Welcome, {user?.name?.split(" ")[0] || "Partner"}!{" "}
//             <span className="inline-block animate-bounce">🌱</span>
//           </h2>
//           <p className="text-[#658C58] text-lg md:text-xl font-medium mt-4 leading-relaxed">
//             You are very close to getting funded. We've identified premium
//             matches based on your business profile.
//           </p>
//         </div>

//         {/* Swoop-style Status Tracker */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/50 p-6 rounded-[2rem] border border-[#BBC863]/30 backdrop-blur-sm">
//           {[
//             { label: "Account created", status: "completed" },
//             { label: "Eligible for funding", status: "completed" },
//             { label: "Submit application", status: "current" },
//             { label: "Get offers", status: "pending" },
//           ].map((step, idx, arr) => (
//             <React.Fragment key={idx}>
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500
//                   ${
//                     step.status === "completed"
//                       ? "bg-[#658C58] text-[#F0E491]"
//                       : step.status === "current"
//                         ? "bg-[#F0E491] text-[#31694E] shadow-[0_0_15px_rgba(240,228,145,0.8)]"
//                         : "bg-white border-2 border-[#BBC863]/30 text-[#BBC863]"
//                   }`}
//                 >
//                   {step.status === "completed" ? (
//                     <CheckCircle size={16} strokeWidth={3} />
//                   ) : (
//                     idx + 1
//                   )}
//                 </div>
//                 <span
//                   className={`text-sm font-bold uppercase tracking-widest ${step.status === "pending" ? "text-[#BBC863]" : "text-[#31694E]"}`}
//                 >
//                   {step.label}
//                 </span>
//               </div>
//               {idx < arr.length - 1 && (
//                 <div className="hidden lg:block h-px flex-1 bg-[#BBC863]/30 mx-4" />
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         {/* Funding Offer Card */}
//         <Card className="overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(49,105,78,0.15)] rounded-[2.5rem]">
//           <div className="h-2 bg-gradient-to-r from-[#658C58] via-[#BBC863] to-[#F0E491]" />
//           <div className="p-8 md:p-12">
//             <div className="inline-flex items-center gap-2 bg-[#F0E491]/30 text-[#31694E] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
//               <Sparkles size={14} /> Congratulations! matches found
//             </div>

//             <h3 className="text-2xl md:text-4xl font-black text-[#31694E] mb-4">
//               Start an application and view offers
//             </h3>
//             <p className="text-[#658C58] text-sm md:text-base max-w-2xl mb-12 leading-relaxed font-medium">
//               To get your personalised funding offers, start a funding
//               application and provide the required business details. Our agents
//               are standing by.
//             </p>

//             {/* Application Data Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#BBC863]/10 py-10 mb-12">
//               <div className="space-y-1">
//                 <p className="text-[10px] font-black text-[#BBC863] uppercase tracking-[0.2em]">
//                   Funding Required
//                 </p>
//                 <p className="text-xl md:text-2xl font-black text-[#31694E]">
//                   $50,000 - $100,000
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-[10px] font-black text-[#BBC863] uppercase tracking-[0.2em]">
//                   Funding Objective
//                 </p>
//                 <p className="text-xl md:text-2xl font-black text-[#31694E]">
//                   Term Business Loan
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-[10px] font-black text-[#BBC863] uppercase tracking-[0.2em]">
//                   Use of Funds
//                 </p>
//                 <p className="text-xl md:text-2xl font-black text-[#31694E]">
//                   Operations & Expansion
//                 </p>
//               </div>
//             </div>

//             {/* Footer Buttons */}
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
//               <button className="text-[#658C58] font-black text-xs uppercase tracking-widest hover:text-[#31694E] transition-colors">
//                 View other funding options
//               </button>
//               <button
//                 onClick={() => setWizardOpen(true)}
//                 className="w-full sm:w-auto bg-[#31694E] text-[#F0E491] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#25503b] transition-all shadow-[0_20px_40px_-10px_rgba(49,105,78,0.4)] group active:scale-95"
//               >
//                 Start application{" "}
//                 <ArrowRight
//                   size={20}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </Card>

//         {/* Wizard Modal Component */}
//         <ApplicationWizard
//           isOpen={wizardOpen}
//           onClose={() => setWizardOpen(false)}
//           onComplete={handleApplicationSubmit}
//           userName={user?.name}
//         />
//       </div>
//     );
//   }

//   // Returning user view (Original Stats Dashboard)
//   return (
//     <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//         <Card className="p-4 md:p-5">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#F0E491] text-[#31694E] flex items-center justify-center">
//               <DollarSign size={24} />
//             </div>
//             <div>
//               <p className="text-xs text-[#658C58] font-bold uppercase">
//                 Requested
//               </p>
//               <p className="text-2xl font-bold text-[#31694E]">$50,000</p>
//             </div>
//           </div>
//         </Card>
//         <Card className="p-4 md:p-5">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#BBC863]/30 text-[#31694E] flex items-center justify-center">
//               <Briefcase size={24} />
//             </div>
//             <div>
//               <p className="text-xs text-[#658C58] font-bold uppercase">
//                 Status
//               </p>
//               <p className="text-2xl font-bold text-[#31694E]">In Review</p>
//             </div>
//           </div>
//         </Card>
//         <Card className="p-4 md:p-5">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#658C58]/20 text-[#31694E] flex items-center justify-center">
//               <User size={24} />
//             </div>
//             <div>
//               <p className="text-xs text-[#658C58] font-bold uppercase">
//                 Agent
//               </p>
//               <p className="text-lg font-bold text-[#31694E]">Sarah Jenkins</p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <Card className="p-8">
//         <div className="flex justify-between items-center mb-8">
//           <h3 className="text-xl font-bold text-[#31694E]">Timeline</h3>
//           <span className="bg-[#F0E491] text-[#31694E] px-3 py-1 rounded-full text-xs font-bold">
//             Step 2 of 4
//           </span>
//         </div>
//         {/* ... (Your original Timeline code here) ... */}
//       </Card>
//     </div>
//   );
// };

// // -- - APPLICATION DETAILS VIEW ---
// const ApplicationView = () => {
//   // Static data mapping exactly to the Django Model: LoanApplication
//   const staticAppData = {
//     loan_application_uuid: "7b2e45a1-9c1d-4f8e-b5a2-3d8f9c1e2b4a",
//     loan_type: { name: "Eco-Growth Capital" },
//     status: "approved", // Options: draft, submitted, pending, approved, rejected
//     approved_funds: "75000.0000000000",
//     rejection_reason: null,
//     partner_commision: "1500.0000000000",
//     current_step: "completed",
//     submitted_at: "2025-11-10T14:30:00Z",
//     approved_at: "2025-11-12T09:15:00Z",
//     rejected_at: null,
//     created_at: "2025-11-09T10:00:00Z",
//     updated_at: "2025-11-12T09:15:00Z",
//   };

//   const {
//     loan_application_uuid,
//     loan_type,
//     status,
//     approved_funds,
//     rejection_reason,
//     partner_commision,
//     current_step,
//     submitted_at,
//     approved_at,
//     rejected_at,
//     created_at,
//     updated_at,
//   } = staticAppData;

//   // UI Helper for Status Colors
//   const getStatusStyle = (stat) => {
//     switch (stat?.toLowerCase()) {
//       case "approved":
//         return "bg-[#658C58] text-white";
//       case "rejected":
//         return "bg-red-500 text-white";
//       case "draft":
//         return "bg-gray-200 text-gray-700";
//       default:
//         return "bg-[#F0E491] text-[#31694E]";
//     }
//   };

//   // Currency Formatter
//   const formatCurrency = (val) => {
//     return val
//       ? new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "USD",
//         }).format(parseFloat(val))
//       : "—";
//   };

//   // Date Formatter
//   const formatDate = (date) => {
//     return date
//       ? new Date(date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Pending";
//   };

//   return (
//     <Card className="overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
//       {/* Header: UUID & Status */}
//       <div className="p-6 md:p-8 border-b border-[#BBC863]/20 bg-[#FDFDF8]">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <h2 className="text-xl md:text-2xl font-bold text-[#31694E]">
//                 Application Details
//               </h2>
//               <span
//                 className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusStyle(status)}`}
//               >
//                 {status}
//               </span>
//             </div>
//             {/* <p className="text-xs font-mono text-[#658C58] bg-[#658C58]/5 px-2 py-1 rounded border border-[#658C58]/10 w-fit">
//               UUID: {loan_application_uuid}
//             </p> */}
//           </div>
//           <div className="flex flex-col md:items-end">
//             <p className="text-[10px] font-bold text-[#BBC863] uppercase tracking-wider">
//               Last System Update
//             </p>
//             <p className="text-sm font-semibold text-[#31694E]">
//               {formatDate(updated_at)}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
//         {/* Column 1: Application Metadata */}
//         <div className="space-y-6">
//           <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest flex items-center gap-2 border-b border-[#BBC863]/10 pb-2">
//             <FileText size={14} /> Core Parameters
//           </h3>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">Selected Loan Type</span>
//               <span className="text-sm font-bold text-[#31694E]">
//                 {loan_type.name}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">Process Step</span>
//               <span className="text-sm font-bold text-[#31694E] capitalize">
//                 {current_step.replace(/_/g, " ")}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">
//                 Submission Timestamp
//               </span>
//               <span className="text-sm font-bold text-[#31694E]">
//                 {formatDate(submitted_at)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Column 2: Financials & Decisions */}
//         <div className="space-y-6">
//           <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest flex items-center gap-2 border-b border-[#BBC863]/10 pb-2">
//             <DollarSign size={14} /> Financial Audit
//           </h3>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">Approved Funding</span>
//               <span className="text-lg font-black text-[#658C58]">
//                 {formatCurrency(approved_funds)}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">Partner Commission</span>
//               <span className="text-sm font-bold text-[#31694E]">
//                 {formatCurrency(partner_commision)}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-[#658C58]">
//                 {status === "approved"
//                   ? "Approval Granted At"
//                   : status === "rejected"
//                     ? "Rejection Notified At"
//                     : "Decision Pending"}
//               </span>
//               <span className="text-sm font-bold text-[#31694E]">
//                 {status === "approved"
//                   ? formatDate(approved_at)
//                   : status === "rejected"
//                     ? formatDate(rejected_at)
//                     : "—"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dynamic Rejection Reason Box */}
//       {status === "rejected" && rejection_reason && (
//         <div className="mx-6 md:mx-8 mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4 items-start">
//           <div className="bg-red-500 p-1 rounded-full">
//             <X size={12} className="text-white" />
//           </div>
//           <div>
//             <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
//               Rejection Audit Log
//             </p>
//             <p className="text-sm text-red-700 leading-relaxed italic">
//               "{rejection_reason}"
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Footer Info Strip */}
//       <div className="bg-[#FDFDF8] px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-[#BBC863]/10">
//         <div className="flex items-center gap-2">
//           <Clock size={12} className="text-[#BBC863]" />
//           <span className="text-[10px] font-bold text-[#BBC863] uppercase tracking-tighter">
//             Record Created: {formatDate(created_at)}
//           </span>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1.5">
//             <div className="w-1.5 h-1.5 rounded-full bg-[#658C58] animate-pulse"></div>
//             <span className="text-[10px] font-black text-[#658C58] uppercase">
//               System Verified
//             </span>
//           </div>
//           <button className="text-[#BBC863] hover:text-[#31694E] transition-colors">
//             <Download size={14} />
//           </button>
//         </div>
//       </div>
//     </Card>
//   );
// };

// const DocumentsView = () => {
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = () => {
//     setUploading(true);
//     setTimeout(() => {
//       setUploading(false);
//       alert("Document Uploaded Successfully!");
//     }, 1500);
//   };

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <div className="bg-[#F0E491]/30 p-4 md:p-6 lg:p-8 rounded-xl border border-[#F0E491]">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <div>
//             <h3 className="font-bold text-[#31694E] text-base md:text-lg">
//               Required Action
//             </h3>
//             <p className="text-sm text-[#658C58] mt-1">
//               Please upload your last 3 months of bank statements to proceed
//               with the underwriting process.
//             </p>
//           </div>
//           <button
//             onClick={handleUpload}
//             className="bg-[#658C58] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#31694E] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full md:w-auto"
//             disabled={uploading}
//           >
//             {uploading ? (
//               <span>Uploading...</span>
//             ) : (
//               <>
//                 <Upload size={18} /> Upload Now
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       <Card>
//         <div className="p-4 md:p-6 border-b border-[#BBC863]/20 font-bold text-[#31694E] text-base md:text-lg">
//           Uploaded Documents
//         </div>
//         <div className="divide-y divide-[#BBC863]/10">
//           {[
//             {
//               name: "Driver License (Front/Back)",
//               date: "Nov 10, 2025",
//               size: "2.4 MB",
//               status: "Approved",
//             },
//             {
//               name: "Business License",
//               date: "Nov 10, 2025",
//               size: "1.1 MB",
//               status: "Approved",
//             },
//             {
//               name: "Bank Statement (Oct 2025)",
//               date: "-",
//               size: "-",
//               status: "Pending",
//             },
//           ].map((doc, i) => (
//             <div
//               key={i}
//               className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#F0E491]/10 transition-colors"
//             >
//               <div className="flex items-center gap-3 md:gap-4">
//                 <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F9FAFB] border border-[#BBC863]/20 rounded-lg flex items-center justify-center text-[#658C58] flex-shrink-0">
//                   <FileText size={20} />
//                 </div>
//                 <div>
//                   <p className="font-bold text-[#31694E] text-sm md:text-base">
//                     {doc.name}
//                   </p>
//                   <p className="text-xs text-[#BBC863] font-medium mt-1">
//                     {doc.date} • {doc.size}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 justify-end sm:justify-start">
//                 <span
//                   className={`text-xs font-bold px-3 py-1 rounded-full border
//                         ${
//                           doc.status === "Approved"
//                             ? "bg-[#658C58]/10 text-[#658C58] border-[#658C58]/20"
//                             : "bg-[#F0E491]/40 text-[#b58d3f] border-[#F0E491]"
//                         }`}
//                 >
//                   {doc.status}
//                 </span>
//                 <button className="text-[#BBC863] hover:text-[#31694E] p-2 rounded-full hover:bg-[#F0E491]/20">
//                   <Download size={18} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   );
// };

// // 4. MESSAGES (CHAT)
// const MessagesView = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: "agent",
//       text: "Hi John, I'm Sarah. I've reviewed your green energy proposal and it looks fantastic.",
//       time: "10:00 AM",
//     },
//     {
//       id: 2,
//       sender: "user",
//       text: "Hi Sarah, glad to hear that! When can I expect a decision?",
//       time: "10:15 AM",
//     },
//     {
//       id: 3,
//       sender: "agent",
//       text: "Once the bank statements are uploaded, usually within 4-6 hours.",
//       time: "10:20 AM",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (scrollRef.current)
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//   }, [messages]);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     const newMsg = {
//       id: Date.now(),
//       sender: "user",
//       text: input,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//     setMessages([...messages, newMsg]);
//     setInput("");
//   };

//   return (
//     <Card className="h-[500px] md:h-[600px] lg:h-[650px] flex flex-col overflow-hidden">
//       {/* Chat Header */}
//       <div className="p-4 md:p-5 border-b border-[#BBC863]/20 bg-[#F9FAFB] flex justify-between items-center">
//         <div className="flex items-center gap-3 md:gap-4">
//           <div className="relative">
//             <img
//               src="https://randomuser.me/api/portraits/women/65.jpg"
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F0E491] shadow-sm"
//               alt="Agent"
//             />
//             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#658C58] border-2 border-white rounded-full"></div>
//           </div>
//           <div>
//             <p className="font-bold text-[#31694E] text-sm md:text-base lg:text-lg">
//               Sarah Jenkins
//             </p>
//             <p className="text-xs text-[#658C58] font-semibold uppercase tracking-wide">
//               Loan Specialist
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div
//         className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-white space-y-4 md:space-y-6"
//         ref={scrollRef}
//       >
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] p-4 md:p-5 rounded-2xl shadow-sm text-sm leading-relaxed
//                   ${
//                     msg.sender === "user"
//                       ? "bg-[#658C58] text-white rounded-br-none"
//                       : "bg-[#F0E491]/20 text-[#31694E] border border-[#BBC863]/20 rounded-bl-none"
//                   }`}
//             >
//               <p className="font-medium">{msg.text}</p>
//               <p
//                 className={`text-[10px] mt-2 text-right opacity-70 ${msg.sender === "user" ? "text-white" : "text-[#658C58]"}`}
//               >
//                 {msg.time}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chat Input */}
//       <form
//         onSubmit={handleSend}
//         className="p-3 md:p-4 lg:p-5 bg-[#F9FAFB] border-t border-[#BBC863]/20 flex items-center gap-2 md:gap-3"
//       >
//         <button
//           type="button"
//           className="p-2 md:p-3 text-[#BBC863] hover:text-[#658C58] transition-colors rounded-full hover:bg-[#F0E491]/20 flex-shrink-0"
//         >
//           <Paperclip size={18} />
//         </button>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 bg-white border border-[#BBC863]/30 rounded-full px-4 md:px-6 py-3 md:py-4 text-sm text-[#31694E] placeholder-[#BBC863] focus:outline-none focus:ring-2 focus:ring-[#658C58] focus:border-transparent transition-all"
//         />
//         <button
//           type="submit"
//           className="p-3 md:p-4 bg-[#658C58] text-white rounded-full hover:bg-[#31694E] shadow-md transition-colors flex-shrink-0"
//         >
//           <Send size={16} />
//         </button>
//       </form>
//     </Card>
//   );
// };

// const ProfileView = () => {
//   const [user, setUser] = useState(null);
//   const API_BASE = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("TOKEN:", token);
//         console.log("HEADER:", `Token ${token}`);

//         const response = await fetch(`${API_BASE}/user-profile/me/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setUser(data);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="max-w-3xl">
//       <Card className="p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
//         <h2 className="text-lg md:text-xl font-bold text-[#31694E] mb-6 md:mb-8 border-b border-[#BBC863]/20 pb-4">
//           Personal Information
//         </h2>

//         <div className="flex flex-col sm:flex-row sm:items-start gap-6 md:gap-8 mb-6 md:mb-8">
//           <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-[#F0E491] rounded-full flex items-center justify-center text-[#31694E] text-2xl md:text-3xl font-bold border-4 border-white shadow-xl mx-auto sm:mx-0 flex-shrink-0">
//             {user.first_name?.[0]}
//             {user.last_name?.[0]}
//           </div>

//           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
//             {[
//               {
//                 label: "Full Name",
//                 val: `${user.first_name} ${user.last_name}`,
//               },
//               { label: "Email", val: user.email },
//               { label: "Phone", val: user.phone },
//               { label: "Role", val: user.role },
//             ].map((field, i) => (
//               <div key={i}>
//                 <label className="text-xs text-[#BBC863] font-bold uppercase tracking-wider block mb-2">
//                   {field.label}
//                 </label>
//                 <input
//                   type="text"
//                   defaultValue={field.val}
//                   className="w-full border-b border-[#BBC863]/30 py-2 text-[#31694E] font-semibold focus:outline-none focus:border-[#658C58] bg-transparent transition-colors text-sm md:text-base"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button className="bg-[#31694E] text-[#F0E491] px-6 md:px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#25503b] shadow-lg transition-colors w-full sm:w-auto">
//             Save Changes
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// // --- MAIN LAYOUT ---
// export default function ClientDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const pageTitles = {
//     dashboard: "",
//     application: "My Application",
//     documents: "Documents",
//     messages: "Message Center",
//     profile: "My Profile",
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#FDFDF8] font-sans selection:bg-[#F0E491] selection:text-[#31694E]">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-0 w-72 h-screen bg-[#31694E] text-white p-4 md:p-6 flex flex-col z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Mobile Close Button */}
//         <button
//           onClick={() => setSidebarOpen(false)}
//           className="lg:hidden absolute top-4 right-4 text-[#F0E491] hover:text-white"
//         >
//           <X size={24} />
//         </button>

//         {/* Branding */}
//         <div className="flex items-center gap-3 mb-8 md:mb-12 px-2">
//           <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E] font-bold shadow-lg">
//             <Leaf size={20} fill="#31694E" />
//           </div>
//           <span className="text-xl md:text-2xl font-bold tracking-tight text-[#F0E491]">
//             Kacu
//           </span>
//         </div>

//         {/* User Profile Snippet */}
//         <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 px-2 md:px-3 pb-6 md:pb-8 border-b border-[#F0E491]/20">
//           <div className="w-10 h-10 md:w-12 md:h-12 bg-[#658C58] rounded-full flex items-center justify-center text-base md:text-lg font-bold text-[#F0E491] border-2 border-[#31694E] flex-shrink-0">
//             {USER.avatar}
//           </div>
//           <div className="overflow-hidden flex-1">
//             <h3 className="text-sm font-bold truncate text-white">
//               {USER.name}
//             </h3>
//             <p className="text-xs text-[#F0E491]/80 truncate">{USER.company}</p>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="space-y-2 md:space-y-3 flex-1">
//           {[
//             { id: "dashboard", label: "Dashboard", icon: Home },
//             { id: "application", label: "My Application", icon: FileText },
//             { id: "documents", label: "Documents", icon: Folder },
//             {
//               id: "messages",
//               label: "Messages",
//               icon: MessageCircle,
//               badge: 2,
//             },
//             { id: "profile", label: "Profile", icon: User },
//           ].map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleTabChange(item.id)}
//               className={`w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-colors group relative
//                 ${
//                   activeTab === item.id
//                     ? "bg-[#658C58] text-white"
//                     : "text-[#F0E491]/70 hover:bg-[#658C58]/20 hover:text-[#F0E491]"
//                 }`}
//             >
//               <item.icon
//                 size={20}
//                 className={activeTab === item.id ? "text-[#F0E491]" : ""}
//               />
//               <span className="font-semibold text-sm">{item.label}</span>

//               {/* Badge */}
//               {item.badge && activeTab !== item.id && (
//                 <span className="absolute right-4 bg-[#F0E491] text-[#31694E] text-[10px] px-2 py-0.5 rounded-full font-bold">
//                   {item.badge}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>

//         {/* Logout Button */}
//         <button className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-[#F0E491]/60 hover:bg-[#658C58]/20 hover:text-[#F0E491] transition-colors">
//           <LogOut size={20} />
//           <span className="font-semibold text-sm">Sign Out</span>
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 xl:p-12">
//         {/* Mobile Header */}
//         <div className="lg:hidden flex items-center justify-between mb-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 text-[#31694E] hover:bg-[#F0E491]/30 rounded-lg transition-colors"
//           >
//             <Menu size={24} />
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-[#F0E491] rounded-lg flex items-center justify-center text-[#31694E] font-bold">
//               <Leaf size={16} fill="#31694E" />
//             </div>
//             <span className="text-lg font-bold text-[#31694E]">Kacu</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="p-2 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 relative">
//               <Bell size={18} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F0E491] rounded-full border border-white"></span>
//             </button>
//           </div>
//         </div>

//         {/* Page Header - Desktop */}
//         <div className="hidden lg:flex justify-between items-center mb-8 xl:mb-12">
//           <div>
//             <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#31694E] tracking-tight">
//               {pageTitles[activeTab]}
//             </h1>
//             <div className="text-xs md:text-sm text-[#658C58] mt-2 flex items-center gap-2 font-medium">
//               <span>Client Portal</span> <ChevronRight size={14} />{" "}
//               <span className="text-[#BBC863] font-bold">
//                 {pageTitles[activeTab]}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 md:gap-4">
//             <button className="p-2 md:p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all relative">
//               <Bell size={20} />
//               <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F0E491] rounded-full border border-white"></span>
//             </button>
//             <button className="p-2 md:p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all">
//               <Settings size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Page Title */}
//         <div className="lg:hidden mb-4">
//           <h1 className="text-xl md:text-2xl font-bold text-[#31694E]">
//             {pageTitles[activeTab]}
//           </h1>
//         </div>

//         {/* Dynamic Content Render */}
//         <div className="min-h-[400px]">
//           {activeTab === "dashboard" && (
//             <DashboardView onChangeTab={handleTabChange} />
//           )}
//           {activeTab === "application" && <ApplicationView />}
//           {activeTab === "documents" && <DocumentsView />}
//           {activeTab === "messages" && <MessagesView />}
//           {activeTab === "profile" && <ProfileView />}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileText,
  ChevronLeft,
  Folder,
  MessageCircle,
  User,
  LogOut,
  Briefcase,
  DollarSign,
  Upload,
  Download,
  CheckCircle,
  Bell,
  Settings,
  ChevronRight,
  Paperclip,
  Send,
  Leaf,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

// --- CONFIG ---
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// --- SHARED COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-[#BBC863]/30 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// --- 1. MULTI-STEP APPLICATION WIZARD ---
const ApplicationWizard = ({ isOpen, onClose, onComplete, loanUuid }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Info
    business_legal_name: "",
    business_dba_name: "",
    business_email: "",
    business_phone_number: "",
    business_website: "",
    business_country: "US",
    business_state: "",
    business_address: "",
    business_city: "",
    business_zip_code: "",
    business_industry_type: "",
    business_legal_entity_type: "llc",
    business_length_of_ownership: "",
    business_number: "",
    business_estimated_start_date: "",
    business_province_of_incorporation: "",
    business_average_gross_monthly_sales: "",
    // Funding Info
    loan_amount_requested: "",
    loan_purpose: "",
    loan_term_requested: "",
    // Owner Info
    owner_first_name: "",
    owner_last_name: "",
    owner_email: "",
    owner_phone_number: "",
    owner_date_of_birth: "",
    owner_ssn: "",
    owner_address: "",
    owner_city: "",
    owner_state: "",
    owner_zip_code: "",
    owner_country: "US",
    owner_percentage_of_ownership: "",
    owner_credit_score: "",
    // Terms
    signature_name: "",
    terms_accepted: false,
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#31694E]/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-[#BBC863]/10 bg-[#FDFDF8] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E] font-bold">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#31694E]">
              Funding Wizard{" "}
              <span className="text-xs text-[#658C58] ml-2">
                Step {step} of {totalSteps}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 text-red-400 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          {/* STEP 1: BUSINESS CORE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-bold text-[#31694E] border-l-4 border-[#658C58] pl-3">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="business_legal_name"
                  placeholder="Legal Name"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none focus:border-[#658C58]"
                />
                <input
                  name="business_email"
                  type="email"
                  placeholder="Business Email"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none focus:border-[#658C58]"
                />
                <input
                  name="business_phone_number"
                  placeholder="Phone Number"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none focus:border-[#658C58]"
                />
                <input
                  name="business_number"
                  placeholder="Tax/Registration Number"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none focus:border-[#658C58]"
                />
                <textarea
                  name="business_address"
                  placeholder="Physical Address"
                  onChange={handleInput}
                  className="md:col-span-2 p-3 rounded-xl border border-[#BBC863]/30 outline-none focus:border-[#658C58]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: ADDITIONAL BIZ DATA */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-bold text-[#31694E] border-l-4 border-[#658C58] pl-3">
                Operational Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="business_industry_type"
                  placeholder="Industry Type"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none"
                />
                <input
                  name="business_estimated_start_date"
                  type="date"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none"
                />
                <input
                  name="business_average_gross_monthly_sales"
                  type="number"
                  placeholder="Avg Monthly Sales ($)"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none"
                />
                <select
                  name="business_legal_entity_type"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 bg-white"
                >
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: FUNDING */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-bold text-[#31694E] border-l-4 border-[#658C58] pl-3">
                Funding Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="loan_amount_requested"
                  type="number"
                  placeholder="Amount Requested ($)"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none"
                />
                <input
                  name="loan_term_requested"
                  placeholder="Requested Term (e.g. 12 months)"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30 outline-none"
                />
                <textarea
                  name="loan_purpose"
                  placeholder="What will the funds be used for?"
                  onChange={handleInput}
                  className="md:col-span-2 p-3 rounded-xl border border-[#BBC863]/30 outline-none h-24"
                />
              </div>
            </div>
          )}

          {/* STEP 4: OWNERSHIP */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-bold text-[#31694E] border-l-4 border-[#658C58] pl-3">
                Owner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="owner_first_name"
                  placeholder="First Name"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
                <input
                  name="owner_last_name"
                  placeholder="Last Name"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
                <input
                  name="owner_email"
                  type="email"
                  placeholder="Owner Email"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
                <input
                  name="owner_ssn"
                  placeholder="SSN"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
                <input
                  name="owner_credit_score"
                  type="number"
                  placeholder="Credit Score"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
                <input
                  name="owner_percentage_of_ownership"
                  type="number"
                  placeholder="Ownership %"
                  onChange={handleInput}
                  className="p-3 rounded-xl border border-[#BBC863]/30"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SIGN */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 text-center">
              <ShieldCheck size={48} className="text-[#658C58] mx-auto" />
              <h3 className="text-xl font-bold text-[#31694E]">
                Review & Accept Terms
              </h3>
              <div className="bg-[#FDFDF8] p-6 rounded-2xl border border-[#BBC863]/20 text-left space-y-2 text-sm">
                <p>
                  <strong>Business:</strong> {formData.business_legal_name}
                </p>
                <p>
                  <strong>Funding:</strong> ${formData.loan_amount_requested}
                </p>
                <p>
                  <strong>Owner:</strong> {formData.owner_first_name}{" "}
                  {formData.owner_last_name}
                </p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  onChange={handleInput}
                  className="w-5 h-5 rounded accent-[#658C58]"
                />
                <label className="text-xs text-[#31694E] font-bold uppercase tracking-widest">
                  I accept the terms and conditions
                </label>
              </div>
              <input
                name="signature_name"
                placeholder="Type Full Name to Sign"
                onChange={handleInput}
                className="w-full p-4 rounded-xl border border-[#BBC863]/30 bg-white font-serif italic text-lg text-center"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#BBC863]/10 flex justify-between items-center bg-[#FDFDF8]">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 font-bold text-[#658C58] disabled:opacity-20"
          >
            <ChevronLeft size={18} /> Back
          </button>
          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="bg-[#31694E] text-[#F0E491] px-10 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => onComplete(formData)}
              disabled={!formData.terms_accepted || !formData.signature_name}
              className="bg-[#658C58] text-white px-12 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50"
            >
              Submit Final Application
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. DASHBOARD VIEW ---
const DashboardView = ({ onChangeTab, user, appData, onRefresh }) => {
  const [wizardOpen, setWizardOpen] = useState(false);

  // A first-time user has either no application OR an application in "DRAFT"
  const isFirstTime = !appData || appData.status === "draft";

  // const handleWizardComplete = async (data) => {
  //   // Note: In production, you would make 4 sequential API calls here (Biz, Funding, Owner, Terms)
  //   // using the API logic provided in previous prompts.
  //   console.log("Submitting Data to Backend...", data);
  //   setWizardOpen(false);
  //   onRefresh(); // Refresh parent dashboard
  // };

  const handleWizardComplete = async (data) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };

    try {
      // 1. Create the Main Loan Application core
      const appResponse = await fetch(`${API_BASE}/application/create/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          // Ensure data.loan_type contains the ID from your wizard selection
          loan_type: data.loan_type || "TYPE_4",
        }),
      });

      const appDataResult = await appResponse.json();
      if (!appResponse.ok)
        throw new Error(
          appDataResult.detail || "Failed to create application core.",
        );

      const uuid = appDataResult.loan_application_uuid;

      // 2. Create Business Information
      const bizResponse = await fetch(
        `${API_BASE}/loan-application/business-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            business_legal_name: data.business_legal_name,
            business_dba_name:
              data.business_dba_name || data.business_legal_name,
            business_email: data.business_email,
            business_phone_number: data.business_phone_number,
            business_website: data.business_website,
            business_country: data.business_country,
            business_state: data.business_state,
            business_address: data.business_address,
            business_city: data.business_city,
            business_zip_code: data.business_zip_code,
            business_industry_type: data.business_industry_type,
            business_legal_entity_type: data.business_legal_entity_type,
            business_length_of_ownership: data.business_length_of_ownership,
            business_number: data.business_number,
            business_estimated_start_date: data.business_estimated_start_date,
            business_province_of_incorporation: data.business_state, // default to state
            business_average_gross_monthly_sales:
              data.business_average_gross_monthly_sales,
          }),
        },
      );
      if (!bizResponse.ok) throw new Error("Failed to save business details.");

      // 3. Create Funding Information
      const fundingResponse = await fetch(
        `${API_BASE}/loan-application/funding-information/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            loan_amount_requested: data.loan_amount_requested,
            loan_purpose: data.loan_purpose,
            loan_term_requested: data.loan_term_requested,
            overdraft_protection: false,
            business_existing_loan: false,
          }),
        },
      );
      if (!fundingResponse.ok)
        throw new Error("Failed to save funding requirements.");

      // 4. Create Business Owner Information
      const ownerResponse = await fetch(
        `${API_BASE}/loan-application/owner-information/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            owner_first_name: data.owner_first_name,
            owner_last_name: data.owner_last_name,
            owner_email: data.owner_email || data.business_email,
            owner_phone_number:
              data.owner_phone_number || data.business_phone_number,
            owner_date_of_birth: data.owner_date_of_birth,
            owner_ssn: data.owner_ssn,
            owner_address: data.owner_address || data.business_address,
            owner_city: data.owner_city || data.business_city,
            owner_state: data.owner_state || data.business_state,
            owner_zip_code: data.owner_zip_code || data.business_zip_code,
            owner_country: data.owner_country || "US",
            owner_percentage_of_ownership: data.owner_percentage_of_ownership,
            owner_credit_score: data.owner_credit_score || 700,
          }),
        },
      );
      if (!ownerResponse.ok)
        throw new Error("Failed to save owner information.");

      // 5. Submit Terms and Conditions (This moves status to 'SUBMITTED')
      const termsResponse = await fetch(
        `${API_BASE}/loan-application/terms-and-conditions/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            loan_application_uuid: uuid,
            signature_name: data.signature_name,
            terms_accepted: data.terms_accepted,
            // If your backend requires an actual image file for signature_image,
            // you would use FormData here instead of JSON.
          }),
        },
      );

      if (!termsResponse.ok)
        throw new Error("Failed to finalize application terms.");

      // SUCCESS
      setWizardOpen(false);
      alert("Application Submitted Successfully!");
      onRefresh(); // Trigger data re-fetch to update the Dashboard UI
    } catch (error) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (isFirstTime) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-black text-[#31694E]">
            Welcome, {user?.first_name || "Partner"}! 👋
          </h2>
          <p className="text-[#658C58] text-lg font-medium mt-2">
            You are very close to getting funded. Let's start your application.
          </p>
        </div>

        <Card className="overflow-hidden border-none shadow-xl rounded-[2.5rem]">
          <div className="h-2 bg-gradient-to-r from-[#658C58] to-[#F0E491]" />
          <div className="p-10">
            <div className="inline-flex items-center gap-2 bg-[#F0E491]/30 text-[#31694E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6">
              <Sparkles size={14} /> Congratulations! matches found
            </div>
            <h3 className="text-3xl font-black text-[#31694E] mb-4">
              Start an application and view offers
            </h3>
            <p className="text-[#658C58] mb-10 leading-relaxed">
              Personalize your funding journey by providing a few business
              details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#BBC863]/10 py-10 mb-10 text-sm">
              <div>
                <p className="text-[#BBC863] font-bold uppercase tracking-widest text-[10px] mb-2">
                  Funding Required
                </p>
                <p className="font-bold text-[#31694E]">$50k - $250k</p>
              </div>
              <div>
                <p className="text-[#BBC863] font-bold uppercase tracking-widest text-[10px] mb-2">
                  Objective
                </p>
                <p className="font-bold text-[#31694E]">Expansion Capital</p>
              </div>
              <div>
                <p className="text-[#BBC863] font-bold uppercase tracking-widest text-[10px] mb-2">
                  Status
                </p>
                <p className="font-bold text-[#31694E]">Ready to Start</p>
              </div>
            </div>

            <div className="flex justify-end gap-6 items-center">
              <button className="text-xs font-black uppercase text-[#658C58]">
                Skip for now
              </button>
              <button
                onClick={() => setWizardOpen(true)}
                className="bg-[#31694E] text-[#F0E491] px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-lg hover:bg-[#25503b] transition-all"
              >
                Start Application <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Card>

        <ApplicationWizard
          isOpen={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onComplete={handleWizardComplete}
        />
      </div>
    );
  }

  // Returning user view
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F0E491] flex items-center justify-center text-[#31694E]">
            <DollarSign />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#658C58] uppercase">
              Approved
            </p>
            <p className="text-xl font-bold text-[#31694E]">
              ${appData?.approved_funds || "0.00"}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#BBC863]/30 flex items-center justify-center text-[#31694E]">
            <Clock />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#658C58] uppercase">
              Current Step
            </p>
            <p className="text-xl font-bold text-[#31694E] capitalize">
              {appData?.current_step?.replace(/_/g, " ")}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#658C58]/20 flex items-center justify-center text-[#31694E]">
            <ShieldCheck />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#658C58] uppercase">
              Status
            </p>
            <p className="text-xl font-bold text-[#31694E] capitalize">
              {appData?.status}
            </p>
          </div>
        </Card>
      </div>

      {/* Original Timeline Card */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-[#31694E]">
            Application Timeline
          </h3>
          <span className="bg-[#F0E491] text-[#31694E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Active
          </span>
        </div>
        <div className="flex justify-between px-4 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-[#BBC863]/20 -z-10" />
          {["Submitted", "Review", "Approved", "Funded"].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-white ${i === 0 ? "border-[#658C58] text-[#658C58]" : "border-[#BBC863]/20 text-[#BBC863]"}`}
              >
                {i === 0 ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span className="text-xs font-bold text-[#31694E]">{s}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// --- 3. APPLICATION VIEW (DYNAMIC DATA) ---
const ApplicationView = ({ appData }) => {
  if (!appData)
    return (
      <div className="p-20 text-center text-[#658C58] font-bold italic">
        No active application found.
      </div>
    );

  return (
    <Card className="overflow-hidden">
      <div className="p-6 bg-[#FDFDF8] border-b border-[#BBC863]/20 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#31694E]">
            Application Detail
          </h2>
          <p className="text-xs text-[#BBC863] font-mono">
            ID: {appData.loan_application_uuid}
          </p>
        </div>
        <span className="bg-[#658C58] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">
          {appData.status}
        </span>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-[#BBC863] tracking-widest">
            Core Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span>Current Step</span>{" "}
              <span className="font-bold capitalize">
                {appData.current_step.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Commission</span>{" "}
              <span className="font-bold">
                ${appData.partner_commision || "0.00"}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-[#BBC863] tracking-widest">
            Timestamps
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span>Created</span>{" "}
              <span className="font-bold">
                {new Date(appData.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Last Update</span>{" "}
              <span className="font-bold">
                {new Date(appData.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- MAIN PORTAL WRAPPER ---
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const fetchData = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       window.location.href = "/login";
  //       return;
  //     }

  //     // Fetch Profile
  //     const profRes = await fetch(`${API_BASE}/user-profile/me/`, {
  //       headers: { Authorization: `Token ${token}` },
  //     });
  //     const userData = await profRes.json();
  //     setUser(userData);

  //     // Fetch Applications
  //     const appRes = await fetch(`${API_BASE}/loan-applications/`, {
  //       headers: { Authorization: `Token ${token}` },
  //     });
  //     const applications = await appRes.json();
  //     if (applications.length > 0) setAppData(applications[0]);
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("🔐 TOKEN FROM STORAGE:", token);

      if (!token) {
        console.warn("❌ No token found → redirecting to login");
        window.location.href = "/login";
        return;
      }

      console.log("🌐 API BASE:", API_BASE);

      // ---------- PROFILE API ----------
      const profileUrl = `${API_BASE}/user-profile/me/`;
      console.log("📡 PROFILE URL:", profileUrl);

      const profRes = await fetch(profileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      console.log("📥 PROFILE STATUS:", profRes.status);

      if (!profRes.ok) {
        const errorText = await profRes.text();
        console.error("❌ PROFILE ERROR RESPONSE:", errorText);
      }

      const userData = await profRes.json();
      console.log("✅ PROFILE DATA:", userData);

      setUser(userData);

      // ---------- APPLICATION API ----------
      const appUrl = `${API_BASE}/application/`;
      console.log("📡 APPLICATION URL:", appUrl);

      const appRes = await fetch(appUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log("📥 APPLICATION STATUS:", appRes.status);

      if (!appRes.ok) {
        const errorText = await appRes.text();
        console.error("❌ APPLICATION ERROR RESPONSE:", errorText);
      }

      const applications = await appRes.json();
      console.log("✅ APPLICATION DATA:", applications);

      if (applications.length > 0) setAppData(applications[0]);
    } catch (e) {
      console.error("🔥 FETCH ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFDF8]">
        <Leaf className="animate-bounce text-[#31694E]" size={48} />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#FDFDF8] font-sans selection:bg-[#F0E491]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-[#31694E] text-white p-6 flex flex-col z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E] font-bold shadow-lg">
            <Leaf size={20} fill="#31694E" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#F0E491]">
            Kacu
          </span>
        </div>
        <nav className="space-y-2 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: Home },
            { id: "application", label: "Application", icon: FileText },
            { id: "documents", label: "Documents", icon: Folder },
            { id: "messages", label: "Messages", icon: MessageCircle },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? "bg-[#658C58] text-white shadow-md" : "text-[#F0E491]/60 hover:bg-[#658C58]/10"}`}
            >
              <item.icon size={18} />{" "}
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 px-5 py-4 text-red-300 font-bold"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 lg:ml-72 p-4 md:p-8 xl:p-12">
        <div className="lg:hidden flex items-center justify-between mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#31694E] bg-white rounded-lg shadow-sm border border-[#BBC863]/20"
          >
            <Menu size={24} />
          </button>
          <span className="text-xl font-bold text-[#31694E]">Kacu</span>
          <div className="w-10 h-10 bg-[#F0E491] rounded-full" />
        </div>
        <div className="min-h-[400px]">
          {activeTab === "dashboard" && (
            <DashboardView
              user={user}
              appData={appData}
              onRefresh={fetchData}
            />
          )}
          {activeTab === "application" && <ApplicationView appData={appData} />}
          {activeTab === "profile" && <ProfileView user={user} />}
          {/* Document and Messages remain placeholders for UI consistency */}
          {activeTab === "documents" && (
            <div className="p-20 text-center text-[#658C58] italic border-2 border-dashed rounded-3xl border-[#BBC863]/30">
              Document Management (Coming Soon)
            </div>
          )}
          {activeTab === "messages" && (
            <div className="p-20 text-center text-[#658C58] italic border-2 border-dashed rounded-3xl border-[#BBC863]/30">
              Agent Messenger (Coming Soon)
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Re-using your working ProfileView logic with prop injection
const ProfileView = ({ user }) => (
  <div className="max-w-3xl">
    <Card className="p-8">
      <h2 className="text-xl font-bold text-[#31694E] mb-8 border-b border-[#BBC863]/10 pb-4">
        Personal Information
      </h2>
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="w-24 h-24 bg-[#F0E491] rounded-full flex items-center justify-center text-[#31694E] text-2xl font-bold border-4 border-white shadow-xl flex-shrink-0">
          {user?.first_name?.[0]}
          {user?.last_name?.[0]}
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-[#BBC863] uppercase block mb-1">
              Full Name
            </label>
            <p className="font-bold text-[#31694E]">
              {user?.first_name} {user?.last_name}
            </p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#BBC863] uppercase block mb-1">
              Email
            </label>
            <p className="font-bold text-[#31694E]">{user?.email}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#BBC863] uppercase block mb-1">
              Phone
            </label>
            <p className="font-bold text-[#31694E]">{user?.phone || "—"}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#BBC863] uppercase block mb-1">
              Role
            </label>
            <span className="inline-block bg-[#F0E491]/30 text-[#31694E] px-2 py-0.5 rounded text-[10px] font-black uppercase">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-[#31694E] text-[#F0E491] px-8 py-3 rounded-xl text-xs font-bold hover:bg-[#25503b] shadow-lg transition-all">
          Update Account
        </button>
      </div>
    </Card>
  </div>
);
