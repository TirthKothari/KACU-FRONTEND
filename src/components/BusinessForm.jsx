// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Building2, Mail, Phone, MapPin, Globe, Briefcase,
//   Calendar, FileText, ChevronRight, ChevronLeft, ShieldCheck,
//   Zap, Sparkles, Landmark, Scale, Star, TrendingUp, Activity,
//   Shield, Layers, CheckCircle2, HelpCircle, Info
// } from 'lucide-react';

// const COLORS = {
//   bgLight: "#FDFCF0",     // Kacu Background
//   formDark: "#0A1A12",    // Midnight Forest Form
//   accent: "#F0E491",      // Kacu Pale Cream
//   primary: "#31694E",     // Forest Green
//   sage: "#658C58",        // Sage Green
// };

// export const BusinessForm = () => {
//   const [step, setStep] = useState(1);
//   const [selectedScore, setSelectedScore] = useState('Excellent');
//   const totalSteps = 4;

//   const [formData, setFormData] = useState({
//     isDBASame: true, legalName: '', dbaName: '', email: '', phone: '',
//     country: 'United States', address: '', city: '', state: '', zip: '',
//     website: '', industry: '', entityType: '', lengthOfOwnership: '',
//     taxId: '', startDate: '', stateOfInc: ''
//   });

//   const creditOptions = [
//     { id: 'Excellent', label: 'Excellent', sub: '720+', icon: <Star /> },
//     { id: 'Great', label: 'Great', sub: '680-719', icon: <TrendingUp /> },
//     { id: 'Good', label: 'Good', sub: '640-679', icon: <Activity /> },
//     { id: 'Fair', label: 'Fair', sub: '600-639', icon: <Shield /> },
//     { id: 'Poor', label: 'Poor', sub: '< 600', icon: <Layers /> },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const progress = (step / totalSteps) * 100;

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[#FDFCF0] relative overflow-hidden font-sans">

//       {/* 1. KACU LIGHT BACKGROUND LAYER */}
//       <div className="absolute inset-0 z-0 opacity-[0.05]"
//            style={{ backgroundImage: `linear-gradient(#31694E 1px, transparent 1px), linear-gradient(90deg, #31694E 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
//       <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#31694E] rounded-full blur-[160px] opacity-[0.07]" />
//       <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-[#BBC863] rounded-full blur-[140px] opacity-[0.1]" />

//       {/* HEADER SECTION */}
//       <div className="z-10 text-center mb-12">
//         <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mb-6">
//           <div className="px-4 py-1 rounded-full bg-white border border-gray-100 shadow-sm flex items-center gap-2 text-[10px] font-bold text-[#31694E] uppercase tracking-[0.2em]">
//             <ShieldCheck size={14} /> Global Enterprise Standards
//           </div>
//         </motion.div>
//         <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1A2E23] mb-6 leading-[0.9]">
//           Cultivate Your <br />
//           <span className="relative inline-block">
//             Natural Future.
//             <motion.div
//               initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.8 }}
//               className="absolute -bottom-2 left-0 h-6 bg-[#F0E491]/70 -z-10"
//             />
//           </span>
//         </h1>
//         <p className="text-[#658C58] max-w-2xl mx-auto text-base font-medium opacity-80">
//           Complete the multi-phase business verification to immediately access tailored capital solutions engineered for sustainable growth.
//         </p>
//       </div>

//       {/* 2. MIDNIGHT FORM CARD (ULTRA WIDE) */}
//       <motion.div
//         layout
//         className="z-10 w-full max-w-7xl bg-[#0A1A12] border border-white/5 rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] overflow-hidden relative"
//       >
//         {/* PROGRESS HUD */}
//         <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 flex">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex-1 relative border-r border-black/20">
//               {step >= i && (
//                 <motion.div
//                   initial={{ width: 0 }} animate={{ width: '100%' }}
//                   className="absolute inset-0 bg-gradient-to-r from-[#31694E] to-[#F0E491]"
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         <form className="p-10 md:p-20">
//           <AnimatePresence mode="wait">

//             {/* STEP 1: IDENTITY */}
//             {step === 1 && (
//               <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
//                 <div className="flex flex-col lg:flex-row items-center justify-between p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] gap-8">
//                   <div className="max-w-md">
//                     <h3 className="text-xl font-bold text-white mb-2">Structure Verification</h3>
//                     <p className="text-sm text-[#658C58] leading-relaxed">Does your business operate under a 'Doing Business As' (DBA) name that differs from your Legal Entity Name?</p>
//                   </div>
//                   <div className="flex p-2 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
//                     {['Yes', 'No'].map((opt) => (
//                       <button
//                         key={opt} type="button"
//                         onClick={() => setFormData({...formData, isDBASame: opt === 'Yes'})}
//                         className={`px-12 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${((opt === 'Yes') === formData.isDBASame) ? 'bg-[#F0E491] text-[#0A1A12] shadow-xl' : 'text-white/40 hover:text-white'}`}
//                       >{opt}</button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <LuxuryInput label="Legal Business Name" icon={<Building2 size={20}/>} name="legalName" onChange={handleInputChange} />
//                   <LuxuryInput label="DBA Name" icon={<FileText size={20}/>} name="dbaName" disabled={formData.isDBASame} onChange={handleInputChange} />
//                   <LuxuryInput label="Business Contact Email" icon={<Mail size={20}/>} name="email" type="email" onChange={handleInputChange} />
//                   <LuxuryInput label="Business Phone" icon={<Phone size={20}/>} name="phone" onChange={handleInputChange} />
//                 </div>
//               </motion.div>
//             )}

//             {/* STEP 2: ADDRESS */}
//             {step === 2 && (
//               <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <LuxurySelect label="Primary Country" icon={<Globe size={20}/>} options={['United States', 'Canada']} />
//                 <LuxuryInput label="Street Address" icon={<MapPin size={20}/>} name="address" onChange={handleInputChange} />
//                 <LuxuryInput label="City" name="city" onChange={handleInputChange} />
//                 <LuxurySelect label="State / Province" options={['New York', 'California', 'Texas', 'Florida']} />
//                 <LuxuryInput label="Zip Code" name="zip" onChange={handleInputChange} />
//                 <LuxuryInput label="Company Website" icon={<Globe size={20}/>} name="website" placeholder="https://" onChange={handleInputChange} />
//               </motion.div>
//             )}

//             {/* STEP 3: ADDITIONAL INFO */}
//             {step === 3 && (
//               <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <LuxuryInput label="Industry Type" icon={<Briefcase size={20}/>} name="industry" onChange={handleInputChange} />
//                 <LuxurySelect label="Legal Entity Type" icon={<Scale size={20}/>} options={['LLC', 'Corporation', 'Partnership', 'Sole Prop']} />
//                 <LuxuryInput label="Length of Ownership" icon={<Calendar size={20}/>} name="lengthOfOwnership" placeholder="e.g. 5 Years" onChange={handleInputChange} />
//                 <LuxuryInput label="Federal Tax ID (EIN)" icon={<Landmark size={20}/>} name="taxId" onChange={handleInputChange} />
//                 <LuxuryInput label="Start Date" type="date" name="startDate" onChange={handleInputChange} />
//                 <LuxurySelect label="State of Incorporation" options={['Delaware', 'Wyoming', 'Nevada']} />
//               </motion.div>
//             )}

//             {/* STEP 4: CREDIT SCORE (THE FINALE) */}
//             {step === 4 && (
//               <motion.div key="st4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
//                 <div className="text-center mb-4">
//                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0E491]">Final Phase</span>
//                   <h3 className="text-3xl font-bold text-white mt-2">Personal Credit Assessment</h3>
//                 </div>

//                 <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
//                   {creditOptions.map((opt) => (
//                     <button
//                       key={opt.id} type="button"
//                       onClick={() => setSelectedScore(opt.id)}
//                       className={`relative flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all duration-500 border
//                         ${selectedScore === opt.id
//                           ? 'bg-[#F0E491] border-transparent shadow-[0_0_50px_rgba(240,228,145,0.25)] scale-110 z-10'
//                           : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-60 hover:opacity-100'}`}
//                     >
//                       <div className={`mb-4 transition-colors ${selectedScore === opt.id ? 'text-[#0A1A12]' : 'text-[#658C58]'}`}>
//                         {React.cloneElement(opt.icon, { size: 32 })}
//                       </div>
//                       <span className={`text-sm font-black uppercase tracking-widest ${selectedScore === opt.id ? 'text-[#0A1A12]' : 'text-white'}`}>
//                         {opt.label}
//                       </span>
//                       <span className={`text-xs font-bold mt-1 ${selectedScore === opt.id ? 'text-[#0A1A12]/50' : 'text-[#658C58]'}`}>
//                         {opt.sub}
//                       </span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* DYNAMIC FUNDING RESULT */}
//                 <div className="bg-gradient-to-br from-[#31694E]/20 to-transparent border border-[#31694E]/30 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
//                   <div className="space-y-3 text-center md:text-left">
//                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F0E491]">
//                       <Zap size={14} fill="currentColor" /> Calculated Funding Power
//                     </div>
//                     <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
//                       {selectedScore === 'Excellent' ? '$50,000 - $5M+' : '$10,000 - $450k'}
//                     </h2>
//                     <p className="text-sm text-[#658C58] font-medium max-w-sm">Your profile indicates elite eligibility for prime-market interest rates and flexible terms.</p>
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 border border-white/5 text-[10px] text-white font-bold uppercase tracking-widest">
//                       <CheckCircle2 size={16} className="text-[#F0E491]" /> Secure Data Handling
//                     </div>
//                     <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/40 border border-white/5 text-[10px] text-[#658C58] font-bold uppercase tracking-widest">
//                       <Info size={16} /> Pre-Qual Result
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//           </AnimatePresence>

//           {/* FOOTER ACTIONS */}
//           <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
//             <div className="flex items-center gap-4 text-xs text-[#658C58] font-bold uppercase tracking-[0.2em]">
//               <ShieldCheck size={24} className="text-[#F0E491]" />
//               <span>Protected by Kacu Quantum Security</span>
//             </div>

//             <div className="flex gap-6 w-full md:w-auto">
//               {step > 1 && (
//                 <button type="button" onClick={() => setStep(step - 1)} className="px-10 py-5 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
//                   Previous Phase
//                 </button>
//               )}

//               <button
//                 type="button"
//                 onClick={() => step < 4 ? setStep(step + 1) : console.log("Final Payload:", formData)}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-4 px-14 py-6 rounded-2xl bg-[#F0E491] text-[#0A1A12] font-black text-xs uppercase tracking-[0.2em] shadow-[0_25px_50px_-10px_rgba(240,228,145,0.4)] hover:scale-[1.03] active:scale-95 transition-all"
//               >
//                 {step === 4 ? "Finalize Eligibility" : "Next Step"}
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         </form>
//       </motion.div>

//       <p className="z-10 mt-12 text-[11px] text-[#658C58]/50 text-center max-w-3xl px-10 uppercase tracking-[0.15em] font-bold leading-relaxed">
//         Kacu Financial LLC is a licensed business funding provider. Submitting this form constitutes a request for pre-qualification and does not impact your credit score.
//         Data processed via AES-256 military-grade encryption.
//       </p>
//     </div>
//   );
// };

// // UI ATOM: Luxury Midnight Input
// const LuxuryInput = ({ label, icon, type = "text", name, disabled, placeholder, onChange }) => (
//   <div className={`space-y-3 group ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
//     <div className="flex justify-between items-center px-2">
//       <label className="text-[11px] font-black text-[#658C58] uppercase tracking-[0.2em]">{label} *</label>
//       <HelpCircle size={16} className="text-white/5 group-hover:text-[#F0E491]/40 transition-colors" />
//     </div>
//     <div className="relative">
//       {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-colors">{icon}</div>}
//       <input
//         type={type} name={name} disabled={disabled} onChange={onChange} placeholder={placeholder}
//         className={`w-full bg-white/[0.02] border border-white/5 rounded-[1.25rem] py-5 ${icon ? 'pl-16' : 'pl-6'} pr-6 outline-none
//                    focus:border-[#F0E491]/30 focus:ring-8 focus:ring-[#F0E491]/5 transition-all text-sm font-semibold text-white placeholder:text-white/10 shadow-inner`}
//       />
//     </div>
//   </div>
// );

// // UI ATOM: Luxury Midnight Select
// const LuxurySelect = ({ label, icon, options }) => (
//   <div className="space-y-3 group">
//     <label className="text-[11px] font-black text-[#658C58] uppercase tracking-[0.2em] px-2">{label} *</label>
//     <div className="relative">
//       {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-colors">{icon}</div>}
//       <select className={`w-full appearance-none bg-white/[0.02] border border-white/5 rounded-[1.25rem] py-5 ${icon ? 'pl-16' : 'pl-6'} pr-12 outline-none
//                          focus:border-[#F0E491]/30 transition-all text-sm font-semibold text-white shadow-inner`}>
//         {options.map(o => <option key={o} value={o} className="bg-[#0A1A12] text-white">{o}</option>)}
//       </select>
//       <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#658C58]" />
//     </div>
//   </div>
// );

//---------------------------------------------------------------------

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Building2, Mail, Phone, MapPin, Globe, Briefcase,
//   Calendar, FileText, ChevronRight, ChevronLeft, ShieldCheck,
//   Zap, Sparkles, Landmark, Scale, Star, TrendingUp, Activity,
//   Shield, Layers, CheckCircle2, HelpCircle, DollarSign, BarChart3
// } from 'lucide-react';

// const COLORS = {
//   primary: "#31694E", // Deep Forest Green
//   secondary: "#658C58", // Sage Green
//   accent: "#F0E491", // Pale Cream/Yellow
//   muted: "#BBC863", // Olive/Muted Lime
//   bgLight: "#FDFCF0", // Kacu Light Cream
// };

// export const BusinessForm = () => {
//   const [step, setStep] = useState(1);
//   const [selectedScore, setSelectedScore] = useState('Excellent');
//   const totalSteps = 4;

//   const [formData, setFormData] = useState({
//     isDBASame: true, legalName: '', dbaName: '', email: '', phone: '',
//     address: '', city: '', state: '', zip: '', website: '',
//     industry: '', entityType: '', ownershipYears: '', taxId: '',
//     annualRevenue: '$500k - $1M', startDate: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const progress = (step / totalSteps) * 100;

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[#FDFCF0] relative overflow-hidden font-sans selection:bg-[#F0E491] selection:text-[#31694E]">

//       {/* 1. KACU LIGHT BACKGROUND LAYER */}
//       <div className="absolute inset-0 z-0 opacity-[0.04]"
//            style={{ backgroundImage: `linear-gradient(#31694E 1.5px, transparent 1.5px), linear-gradient(90deg, #31694E 1.5px, transparent 1.5px)`, backgroundSize: '70px 70px' }} />
//       <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#31694E] rounded-full blur-[180px] opacity-[0.08]" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#BBC863] rounded-full blur-[160px] opacity-[0.12]" />

//       {/* BRAND HEADER */}
//       <div className="z-10 text-center mb-16">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-8">
//           <div className="px-6 py-2 rounded-full bg-white border border-[#BBC863]/20 shadow-xl flex items-center gap-3 text-[11px] font-black text-[#31694E] uppercase tracking-[0.3em]">
//             <div className="w-2 h-2 rounded-full bg-[#BBC863] animate-pulse" />
//             Vetted Business Liquidity
//           </div>
//         </motion.div>

//         <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A2E23] mb-6 leading-[0.85] text-center">
//           Engineered for <br />
//           <span className="relative inline-block text-[#31694E]">
//             Natural Growth.
//             <motion.div
//               initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.4, duration: 0.9 }}
//               className="absolute -bottom-2 left-0 h-6 bg-[#F0E491]/80 -z-10 rounded-sm"
//             />
//           </span>
//         </h1>
//       </div>

//       {/* 2. THE MULTI-TONE FORM ENGINE (ULTRA WIDE) */}
//       <motion.div
//         layout
//         className="z-10 w-full max-w-7xl bg-gradient-to-br from-[#0A1A12] via-[#0D2418] to-[#122E1F] border border-white/10 rounded-[4rem] shadow-[0_80px_160px_-30px_rgba(10,26,18,0.5)] overflow-hidden relative"
//       >
//         {/* STEPPER NAV */}
//         <div className="flex bg-black/30 border-b border-white/5">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex-1 py-4 flex flex-col items-center relative overflow-hidden">
//                <span className={`text-[10px] font-black uppercase tracking-widest z-10 transition-colors ${step >= i ? 'text-[#F0E491]' : 'text-white/20'}`}>
//                 Phase 0{i}
//                </span>
//                {step >= i && <motion.div layoutId="navGlow" className="absolute bottom-0 w-full h-[3px] bg-gradient-to-r from-[#31694E] via-[#F0E491] to-[#BBC863]" />}
//             </div>
//           ))}
//         </div>

//         <form className="p-10 md:p-20">
//           <AnimatePresence mode="wait">

//             {/* STEP 1: CORPORATE IDENTITY */}
//             {step === 1 && (
//               <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
//                 <div className="flex flex-col lg:flex-row items-center justify-between p-12 bg-[#31694E]/10 border border-[#BBC863]/10 rounded-[3rem] gap-10">
//                   <div className="max-w-md">
//                     <div className="flex items-center gap-2 mb-2">
//                        <Scale className="text-[#BBC863]" size={18} />
//                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Legal Registration</h3>
//                     </div>
//                     <p className="text-sm text-[#658C58] leading-relaxed">Ensure your legal business name matches exactly with your articles of incorporation and IRS documentation.</p>
//                   </div>
//                   <div className="flex p-1.5 bg-black/60 rounded-[2rem] border border-white/5 shadow-2xl">
//                     {['Yes', 'No'].map((opt) => (
//                       <button
//                         key={opt} type="button"
//                         onClick={() => setFormData({...formData, isDBASame: opt === 'Yes'})}
//                         className={`px-14 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${((opt === 'Yes') === formData.isDBASame) ? 'bg-gradient-to-b from-[#F0E491] to-[#E6D87A] text-[#0A1A12] shadow-[0_10px_30px_rgba(240,228,145,0.3)]' : 'text-white/30 hover:text-white'}`}
//                       >{opt}</button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormInput label="Legal Business Name" icon={<Building2 />} name="legalName" placeholder="e.g., Acme Corp LLC" onChange={handleInputChange} />
//                   <FormInput label="Doing Business As (DBA)" icon={<FileText />} name="dbaName" disabled={formData.isDBASame} placeholder="Trading name" onChange={handleInputChange} />
//                   <FormInput label="Federal Tax ID (EIN)" icon={<Landmark />} name="taxId" placeholder="XX-XXXXXXX" onChange={handleInputChange} />
//                   <FormSelect label="Legal Entity Type" icon={<Layers />} options={['LLC', 'S-Corp', 'C-Corp', 'Partnership', 'Sole Proprietorship']} />
//                 </div>
//               </motion.div>
//             )}

//             {/* STEP 2: OPERATIONAL FOOTPRINT */}
//             {step === 2 && (
//               <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormInput label="Corporate Headquarters" icon={<MapPin />} name="address" placeholder="123 Business Way" onChange={handleInputChange} />
//                   <FormInput label="City" name="city" placeholder="San Francisco" onChange={handleInputChange} />
//                   <FormSelect label="State of Operation" options={['California', 'Delaware', 'Texas', 'New York']} />
//                   <FormInput label="Zip Code" name="zip" placeholder="94105" onChange={handleInputChange} />
//                   <FormInput label="Professional Email" icon={<Mail />} name="email" type="email" placeholder="ceo@company.com" onChange={handleInputChange} />
//                   <FormInput label="Business Website" icon={<Globe />} name="website" placeholder="https://www.company.com" onChange={handleInputChange} />
//                 </div>
//               </motion.div>
//             )}

//             {/* STEP 3: FINANCIAL LANDSCAPE */}
//             {step === 3 && (
//               <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <FormSelect label="Approx. Annual Revenue" icon={<BarChart3 />} options={['<$100k', '$100k - $500k', '$500k - $2M', '$2M - $10M+']} />
//                   <FormInput label="Years of Ownership" icon={<Calendar />} name="ownershipYears" placeholder="e.g. 4.5" onChange={handleInputChange} />
//                   <FormSelect label="Primary Industry" icon={<Briefcase />} options={['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Construction']} />
//                   <FormInput label="Direct Line" icon={<Phone />} name="phone" placeholder="+1 (555) 000-0000" onChange={handleInputChange} />
//                 </div>
//               </motion.div>
//             )}

//             {/* STEP 4: CREDIT & QUALIFICATION */}
//             {step === 4 && (
//               <motion.div key="s4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
//                 <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
//                   {['Excellent', 'Great', 'Good', 'Fair', 'Poor'].map((label, idx) => (
//                     <button
//                       key={label} type="button"
//                       onClick={() => setSelectedScore(label)}
//                       className={`relative flex flex-col items-center justify-center p-10 rounded-[2.5rem] transition-all duration-700 border
//                         ${selectedScore === label
//                           ? 'bg-[#F0E491] border-transparent shadow-[0_0_60px_rgba(240,228,145,0.2)] scale-110 z-10'
//                           : 'bg-white/[0.03] border-white/5 hover:border-[#BBC863]/30'}`}
//                     >
//                       <div className={`mb-4 transition-transform duration-500 ${selectedScore === label ? 'text-[#31694E] scale-125' : 'text-[#658C58]'}`}>
//                         {idx === 0 ? <Star /> : idx === 1 ? <TrendingUp /> : <Activity />}
//                       </div>
//                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedScore === label ? 'text-[#31694E]' : 'text-white'}`}>
//                         {label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* QUALIFICATION HUD */}
//                 <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/5 rounded-full blur-[100px] pointer-events-none" />
//                   <div className="space-y-4 text-center md:text-left z-10">
//                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#31694E]/30 text-[#F0E491] text-[9px] font-black uppercase tracking-[0.2em]">
//                       <Zap size={14} /> Peak Allocation Estimate
//                     </div>
//                     <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
//                       {selectedScore === 'Excellent' ? '$5,000,000+' : '$250,000+'}
//                     </h2>
//                     <p className="text-[#658C58] text-sm font-medium max-w-sm">Calculated using AI-driven credit modeling based on your {selectedScore} profile.</p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 w-full md:w-auto z-10">
//                     <QualificationPill icon={<ShieldCheck className="text-[#F0E491]"/>} text="Tier 1 Security" />
//                     <QualificationPill icon={<CheckCircle2 className="text-[#BBC863]"/>} text="Pre-Approved Status" />
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//           </AnimatePresence>

//           {/* FOOTER ACTIONS */}
//           <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
//             <div className="flex items-center gap-4">
//                <div className="p-3 rounded-2xl bg-[#31694E]/20 text-[#BBC863]">
//                  <Shield size={24} />
//                </div>
//                <div>
//                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Quantum Encryption</p>
//                   <p className="text-[9px] text-[#658C58] uppercase font-bold tracking-tighter">Secure Data Pipeline Active</p>
//                </div>
//             </div>

//             <div className="flex gap-6 w-full md:w-auto">
//               {step > 1 && (
//                 <button type="button" onClick={() => setStep(step - 1)} className="px-12 py-5 rounded-2xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
//                   Back
//                 </button>
//               )}

//               <button
//                 type="button"
//                 onClick={() => step < 4 ? setStep(step + 1) : console.log("Finalizing...")}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-5 px-16 py-6 rounded-[1.5rem] bg-[#F0E491] text-[#0A1A12] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(240,228,145,0.4)] hover:scale-[1.04] active:scale-95 transition-all"
//               >
//                 {step === 4 ? "Submit Profile" : "Next Phase"}
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         </form>
//       </motion.div>

//       <p className="z-10 mt-14 text-[10px] text-[#31694E]/50 text-center max-w-4xl px-12 uppercase tracking-[0.2em] font-black leading-[1.8]">
//         The information provided is subject to verification. Kacu Financial reserves the right to request
//         Bank statements or P&L sheets for funding amounts exceeding $1,000,000. Data is strictly confidential.
//       </p>
//     </div>
//   );
// };

// // UI ATOM: Multi-Tone Input
// const FormInput = ({ label, icon, type = "text", name, disabled, placeholder, onChange }) => (
//   <div className={`space-y-4 group ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
//     <div className="flex justify-between items-center px-2">
//       <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.2em]">{label} *</label>
//       <HelpCircle size={16} className="text-white/5 group-hover:text-[#BBC863]/60 transition-colors" />
//     </div>
//     <div className="relative">
//       {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-colors">
//         {React.cloneElement(icon, { size: 20 })}
//       </div>}
//       <input
//         type={type} name={name} disabled={disabled} onChange={onChange} placeholder={placeholder}
//         className={`w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-5 ${icon ? 'pl-16' : 'pl-7'} pr-7 outline-none
//                    focus:border-[#BBC863]/40 focus:ring-8 focus:ring-[#BBC863]/5 transition-all text-[13px] font-bold text-white placeholder:text-white/10 shadow-inner`}
//       />
//     </div>
//   </div>
// );

// // UI ATOM: Multi-Tone Select
// const FormSelect = ({ label, icon, options }) => (
//   <div className="space-y-4 group">
//     <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.2em] px-2">{label} *</label>
//     <div className="relative">
//       {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-colors">
//         {React.cloneElement(icon, { size: 20 })}
//       </div>}
//       <select className={`w-full appearance-none bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-5 ${icon ? 'pl-16' : 'pl-7'} pr-14 outline-none
//                          focus:border-[#BBC863]/40 transition-all text-[13px] font-bold text-white shadow-inner`}>
//         {options.map(o => <option key={o} value={o} className="bg-[#0A1A12] text-white">{o}</option>)}
//       </select>
//       <ChevronRight size={18} className="absolute right-7 top-1/2 -translate-y-1/2 rotate-90 text-[#658C58]" />
//     </div>
//   </div>
// );

// const QualificationPill = ({ icon, text }) => (
//   <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
//     {icon}
//     <span className="text-[10px] font-black text-white uppercase tracking-widest">{text}</span>
//   </div>
// );

// `````````````````````````````````````````````````````````````````````

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Building2, Mail, Phone, MapPin, Globe, Briefcase,
//   Calendar, FileText, ChevronRight, ChevronLeft, ShieldCheck,
//   Zap, Sparkles, Landmark, Scale, Star, TrendingUp, Activity,
//   Shield, Layers, CheckCircle2, HelpCircle, BarChart3, Fingerprint
// } from 'lucide-react';

// const COLORS = {
//   primary: "#31694E", // Deep Forest Green
//   secondary: "#658C58", // Sage Green
//   accent: "#F0E491", // Pale Cream/Yellow
//   muted: "#BBC863", // Olive/Muted Lime
//   bgLight: "#FDFCF0", // Kacu Light Cream
// };

// export const BusinessForm = () => {
//   const [step, setStep] = useState(1);
//   const [selectedScore, setSelectedScore] = useState('Excellent');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const totalSteps = 4;

//   const [formData, setFormData] = useState({
//     isDBASame: true,
//     legalName: '',
//     dbaName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: 'California',
//     zip: '',
//     website: '',
//     industry: 'Technology',
//     entityType: 'LLC',
//     ownershipYears: '',
//     taxId: '',
//     annualRevenue: '$500k - $2M',
//     startDate: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // FINAL SUBMIT LOGIC
//   const handleSubmit = (e) => {
//     if (e) e.preventDefault();
//     setIsSubmitting(true);

//     // Construct Final Payload
//     const finalPayload = {
//       ...formData,
//       creditScore: selectedScore,
//       submittedAt: new Date().toISOString(),
//       source: "Kacu Digital Portal"
//     };

//     // Professional Console Logging
//     setTimeout(() => {
//       console.log("%c🚀 KACU SYSTEM: DATA TRANSMISSION INITIALIZED", "color: #F0E491; font-weight: bold; font-size: 14px;");
//       console.log("%cFinal Payload Structure:", "color: #BBC863; font-weight: bold;", finalPayload);
//       console.table(finalPayload);

//       alert("Success! Check your browser console to see the business profile payload.");
//       setIsSubmitting(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[#FDFCF0] relative overflow-hidden font-sans selection:bg-[#F0E491] selection:text-[#31694E]">

//       {/* 1. KACU LIGHT BACKGROUND LAYER (Unchanged per request) */}
//       <div className="absolute inset-0 z-0 opacity-[0.04]"
//            style={{ backgroundImage: `linear-gradient(#31694E 1.5px, transparent 1.5px), linear-gradient(90deg, #31694E 1.5px, transparent 1.5px)`, backgroundSize: '70px 70px' }} />
//       <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#31694E] rounded-full blur-[180px] opacity-[0.08]" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#BBC863] rounded-full blur-[160px] opacity-[0.12]" />

//       {/* BRAND HEADER */}
//       <div className="z-10 text-center mb-16">
//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
//           <div className="px-6 py-2 rounded-full bg-white border border-[#BBC863]/20 shadow-xl flex items-center gap-3 text-[11px] font-black text-[#31694E] uppercase tracking-[0.3em]">
//             <Fingerprint size={16} className="text-[#31694E]" />
//             Verified Digital Application
//           </div>
//         </motion.div>

//         <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A2E23] mb-6 leading-[0.85] text-center">
//           Engineered for <br />
//           <span className="relative inline-block text-[#31694E]">
//             Natural Growth.
//             <motion.div
//               initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.4, duration: 0.9 }}
//               className="absolute -bottom-2 left-0 h-6 bg-[#F0E491]/80 -z-10 rounded-sm"
//             />
//           </span>
//         </h1>
//       </div>

//       {/* 2. THE FUTURISTIC FORM ENGINE */}
//       <motion.div
//         layout
//         className="z-10 w-full max-w-7xl bg-gradient-to-br from-[#0A1A12] via-[#0D2418] to-[#122E1F] border border-white/10 rounded-[4rem] shadow-[0_80px_160px_-30px_rgba(10,26,18,0.5)] overflow-hidden relative backdrop-blur-3xl"
//       >
//         {/* TOP GLOW INDICATOR */}
//         <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
//            <motion.div
//             animate={{ width: `${(step/totalSteps)*100}%` }}
//             className="h-full bg-gradient-to-r from-[#31694E] via-[#F0E491] to-[#BBC863] shadow-[0_0_20px_rgba(240,228,145,0.4)]"
//            />
//         </div>

//         {/* STEPPER NAV DOCK */}
//         <div className="flex bg-black/40 border-b border-white/5 p-2">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex-1 py-6 flex flex-col items-center relative overflow-hidden transition-all">
//                <span className={`text-[10px] font-black uppercase tracking-[0.3em] z-10 transition-colors duration-500 ${step >= i ? 'text-[#F0E491]' : 'text-white/10'}`}>
//                 Module 0{i}
//                </span>
//                {step === i && <motion.div layoutId="navGlow" className="absolute bottom-0 w-12 h-1 bg-[#F0E491] rounded-full blur-[2px]" />}
//             </div>
//           ))}
//         </div>

//         <form className="p-10 md:p-20 relative" onSubmit={(e) => e.preventDefault()}>
//           <AnimatePresence mode="wait">

//             {/* STEP 1: CORPORATE IDENTITY */}
//             {step === 1 && (
//               <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
//                 <div className="flex flex-col lg:flex-row items-center justify-between p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] gap-10">
//                   <div className="max-w-md">
//                     <div className="flex items-center gap-3 mb-2">
//                        <Scale className="text-[#BBC863]" size={20} />
//                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Legal Identity</h3>
//                     </div>
//                     <p className="text-sm text-[#658C58] leading-relaxed opacity-60 font-medium">Synchronize your legal entity name with federal registration records for instant verification.</p>
//                   </div>
//                   <div className="flex p-2 bg-black/60 rounded-[2rem] border border-white/10 shadow-inner">
//                     {['Yes', 'No'].map((opt) => (
//                       <button
//                         key={opt} type="button"
//                         onClick={() => setFormData({...formData, isDBASame: opt === 'Yes'})}
//                         className={`px-14 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${((opt === 'Yes') === formData.isDBASame) ? 'bg-[#F0E491] text-[#0A1A12] shadow-2xl' : 'text-white/20 hover:text-white'}`}
//                       >{opt}</button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                   <LuxuryInput label="Legal Business Name" icon={<Building2 />} name="legalName" value={formData.legalName} placeholder="Acme Global Corp" onChange={handleInputChange} />
//                   <LuxuryInput label="DBA / Trading Name" icon={<FileText />} name="dbaName" value={formData.dbaName} disabled={formData.isDBASame} placeholder="Enter DBA" onChange={handleInputChange} />
//                   <LuxuryInput label="Tax Identifier (EIN)" icon={<Landmark />} name="taxId" value={formData.taxId} placeholder="XX-XXXXXXX" onChange={handleInputChange} />
//                   <LuxurySelect label="Entity Structure" icon={<Layers />} name="entityType" value={formData.entityType} options={['LLC', 'S-Corp', 'C-Corp', 'Partnership']} onChange={handleInputChange} />
//                 </div>
//               </motion.div>
//             )}

//             {/* STEP 2: OPERATIONAL HQ */}
//             {step === 2 && (
//               <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//                 <LuxuryInput label="Street Address" icon={<MapPin />} name="address" value={formData.address} onChange={handleInputChange} />
//                 <LuxuryInput label="HQ City" name="city" value={formData.city} onChange={handleInputChange} />
//                 <LuxurySelect label="State" name="state" value={formData.state} options={['California', 'Delaware', 'Texas', 'New York']} onChange={handleInputChange} />
//                 <LuxuryInput label="Zip Code" name="zip" value={formData.zip} onChange={handleInputChange} />
//                 <LuxuryInput label="Corporate Email" icon={<Mail />} name="email" value={formData.email} onChange={handleInputChange} />
//                 <LuxuryInput label="Company URL" icon={<Globe />} name="website" value={formData.website} onChange={handleInputChange} />
//               </motion.div>
//             )}

//             {/* STEP 3: FINANCIAL LANDSCAPE */}
//             {step === 3 && (
//               <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                 <LuxurySelect label="Annual Gross Revenue" icon={<BarChart3 />} name="annualRevenue" value={formData.annualRevenue} options={['<$100k', '$100k - $500k', '$500k - $2M', '$2M - $10M+']} onChange={handleInputChange} />
//                 <LuxuryInput label="Ownership Period (Years)" icon={<Calendar />} name="ownershipYears" value={formData.ownershipYears} placeholder="e.g. 5" onChange={handleInputChange} />
//                 <LuxurySelect label="Primary Sector" icon={<Briefcase />} name="industry" value={formData.industry} options={['Technology', 'Manufacturing', 'Retail', 'Logistics']} onChange={handleInputChange} />
//                 <LuxuryInput label="Primary Phone" icon={<Phone />} name="phone" value={formData.phone} placeholder="+1" onChange={handleInputChange} />
//               </motion.div>
//             )}

//             {/* STEP 4: CREDIT & QUALIFICATION */}
//             {step === 4 && (
//               <motion.div key="s4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
//                 <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
//                   {['Excellent', 'Great', 'Good', 'Fair', 'Poor'].map((label, idx) => (
//                     <button
//                       key={label} type="button"
//                       onClick={() => setSelectedScore(label)}
//                       className={`relative flex flex-col items-center justify-center p-12 rounded-[3rem] transition-all duration-500 border
//                         ${selectedScore === label
//                           ? 'bg-[#F0E491] border-transparent shadow-[0_20px_60px_rgba(240,228,145,0.3)] scale-110 z-10'
//                           : 'bg-white/[0.03] border-white/5 hover:border-[#BBC863]/40'}`}
//                     >
//                       <div className={`mb-4 transition-transform duration-500 ${selectedScore === label ? 'text-[#31694E] scale-125' : 'text-[#658C58]'}`}>
//                         {idx === 0 ? <Star /> : idx === 1 ? <TrendingUp /> : <Activity />}
//                       </div>
//                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedScore === label ? 'text-[#31694E]' : 'text-white'}`}>
//                         {label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* THE "QUANTUM" QUALIFICATION DASHBOARD */}
//                 <div className="bg-[#31694E]/10 border border-white/10 rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/5 rounded-full blur-[120px] pointer-events-none" />
//                   <div className="space-y-4 text-center md:text-left z-10">
//                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#31694E]/40 text-[#F0E491] text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
//                       <Zap size={14} fill="currentColor" /> Peak Capital Reach
//                     </div>
//                     <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
//                       {selectedScore === 'Excellent' ? '$5,000,000+' : '$350,000+'}
//                     </h2>
//                     <p className="text-[#658C58] text-sm font-bold tracking-tight max-w-sm">Liquidity estimate verified for Tier 1 {selectedScore} credentials.</p>
//                   </div>

//                   <div className="flex flex-col gap-4 w-full md:w-auto z-10">
//                     <QualificationPill icon={<ShieldCheck className="text-[#F0E491]"/>} text="Tier 1 Secure" />
//                     <QualificationPill icon={<CheckCircle2 className="text-[#BBC863]"/>} text="Pre-Approved" />
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//           </AnimatePresence>

//           {/* FOOTER ACTIONS */}
//           <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
//             <div className="flex items-center gap-4">
//                <div className="p-4 rounded-2xl bg-[#31694E]/20 text-[#BBC863] border border-white/5">
//                  <Shield size={28} />
//                </div>
//                <div>
//                   <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Quantum Encryption</p>
//                   <p className="text-[9px] text-[#658C58] uppercase font-bold tracking-tighter opacity-60">Subsidized Data Pipeline</p>
//                </div>
//             </div>

//             <div className="flex gap-6 w-full md:w-auto">
//               {step > 1 && (
//                 <button type="button" onClick={() => setStep(step - 1)} className="px-12 py-5 rounded-2xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all active:scale-95">
//                   Back
//                 </button>
//               )}

//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-5 px-20 py-6 rounded-[2rem] bg-[#F0E491] text-[#0A1A12] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(240,228,145,0.4)] hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
//               >
//                 {isSubmitting ? "Transmitting..." : step === 4 ? "Submit Profile" : "Next Phase"}
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         </form>
//       </motion.div>

//       <p className="z-10 mt-14 text-[10px] text-[#31694E]/40 text-center max-w-4xl px-12 uppercase tracking-[0.3em] font-black leading-relaxed">
//         Kacu Financial System v4.0. Pre-qualification is a soft assessment and does not impact your credit score.
//         Data is transmitted via AES-256 air-gapped encryption.
//       </p>
//     </div>
//   );
// };

// // UI ATOM: Multi-Tone Input
// const LuxuryInput = ({ label, icon, type = "text", name, disabled, value, placeholder, onChange }) => (
//   <div className={`space-y-4 group transition-all duration-500 ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
//     <div className="flex justify-between items-center px-2">
//       <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.3em]">{label} *</label>
//       <HelpCircle size={14} className="text-white/5 group-hover:text-[#BBC863]/60 transition-colors" />
//     </div>
//     <div className="relative">
//       {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-all duration-500">
//         {React.cloneElement(icon, { size: 20 })}
//       </div>}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         disabled={disabled}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-6 ${icon ? 'pl-16' : 'pl-7'} pr-7 outline-none
//                    focus:border-[#BBC863]/40 focus:ring-8 focus:ring-[#BBC863]/5 transition-all text-[13px] font-bold text-white placeholder:text-white/10 shadow-inner`}
//       />
//     </div>
//   </div>
// );

// // UI ATOM: Multi-Tone Select
// const LuxurySelect = ({ label, icon, name, value, options, onChange }) => (
//   <div className="space-y-4 group transition-all duration-500">
//     <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.3em] px-2">{label} *</label>
//     <div className="relative">
//       {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-all duration-500">
//         {React.cloneElement(icon, { size: 20 })}
//       </div>}
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className={`w-full appearance-none bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-6 ${icon ? 'pl-16' : 'pl-7'} pr-14 outline-none
//                          focus:border-[#BBC863]/40 transition-all text-[13px] font-bold text-white shadow-inner cursor-pointer`}>
//         {options.map(o => <option key={o} value={o} className="bg-[#0A1A12] text-white">{o}</option>)}
//       </select>
//       <ChevronRight size={18} className="absolute right-7 top-1/2 -translate-y-1/2 rotate-90 text-[#658C58]" />
//     </div>
//   </div>
// );

// const QualificationPill = ({ icon, text }) => (
//   <div className="flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-black/40 border border-white/5 shadow-2xl backdrop-blur-md">
//     {icon}
//     <span className="text-[10px] font-black text-white uppercase tracking-widest">{text}</span>
//   </div>
// );

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  FileText,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Sparkles,
  Landmark,
  Scale,
  Star,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Fingerprint,
  Database,
} from "lucide-react";

// Theme Constants
const COLORS = {
  primary: "#31694E", // Deep Forest Green
  secondary: "#658C58", // Sage Green
  accent: "#F0E491", // Pale Cream/Yellow
  muted: "#BBC863", // Olive/Muted Lime
  bgLight: "#FDFCF0", // Kacu Light Cream
};

export const BusinessForm = () => {
  const [step, setStep] = useState(1);
  const [selectedScore, setSelectedScore] = useState("Excellent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  // Fully Mapped Form State
  const [formData, setFormData] = useState({
    isDBASame: true,
    legalName: "",
    dbaName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "California",
    zip: "",
    website: "",
    industry: "Technology",
    entityType: "LLC",
    ownershipYears: "",
    taxId: "",
    annualRevenue: "$500k - $2M",
    startDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FINAL SUBMISSION & REDIRECT LOGIC
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // 1. Construct the complete business profile payload
    const finalPayload = {
      ...formData,
      creditScore: selectedScore,
      submissionMetadata: {
        timestamp: new Date().toISOString(),
        environment: "Kacu Production V4",
        browser: navigator.userAgent,
      },
    };

    // 2. Transmit to console (Mocking API Call)
    setTimeout(() => {
      console.log(
        "%c🌿 KACU SYSTEM: DATA TRANSMISSION COMPLETE",
        "color: #BBC863; font-weight: bold; font-size: 16px;",
      );
      console.log(
        "%cPayload delivered to console:",
        "color: #F0E491; font-weight: bold;",
        finalPayload,
      );
      console.table(finalPayload);

      // 3. Redirect to /wizard
      // If using react-router-dom, use: navigate('/wizard');
      window.location.href = "/wizard";
    }, 2000); // 2 second delay to let the user see the "Transmitting" state
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[#FDFCF0] relative overflow-hidden font-sans selection:bg-[#F0E491] selection:text-[#31694E]">
      {/* 1. KACU LIGHT BACKGROUND LAYER */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#31694E 1.5px, transparent 1.5px), linear-gradient(90deg, #31694E 1.5px, transparent 1.5px)`,
          backgroundSize: "70px 70px",
        }}
      />
      <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#31694E] rounded-full blur-[180px] opacity-[0.08]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#BBC863] rounded-full blur-[160px] opacity-[0.12]" />

      {/* BRAND HEADER */}
      <div className="z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="px-6 py-2 rounded-full bg-white border border-[#BBC863]/20 shadow-xl flex items-center gap-3 text-[11px] font-black text-[#31694E] uppercase tracking-[0.3em]">
            <Database size={16} className="text-[#31694E] animate-pulse" />
            Vetted Capital Access
          </div>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A2E23] mb-6 leading-[0.85] text-center">
          Engineered for <br />
          <span className="relative inline-block text-[#31694E]">
            Natural Growth.
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="absolute -bottom-2 left-0 h-6 bg-[#F0E491]/80 -z-10 rounded-sm"
            />
          </span>
        </h1>
      </div>

      {/* 2. THE MULTI-TONE FORM ENGINE (ULTRA WIDE) */}
      <motion.div
        layout
        className="z-10 w-full max-w-7xl bg-gradient-to-br from-[#0A1A12] via-[#0D2418] to-[#122E1F] border border-white/10 rounded-[4rem] shadow-[0_80px_160px_-30px_rgba(10,26,18,0.5)] overflow-hidden relative"
      >
        {/* PROGRESS PROGRESSION BAR */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#31694E] via-[#F0E491] to-[#BBC863]"
          />
        </div>

        {/* STEPPER NAV DOCK */}
        <div className="flex bg-black/40 border-b border-white/5 p-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 py-6 flex flex-col items-center relative overflow-hidden"
            >
              <span
                className={`text-[10px] font-black uppercase tracking-[0.3em] z-10 transition-all duration-500 ${step >= i ? "text-[#F0E491]" : "text-white/10"}`}
              >
                Module 0{i}
              </span>
              {step === i && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute bottom-0 w-16 h-1 bg-[#F0E491] rounded-full blur-[2px]"
                />
              )}
            </div>
          ))}
        </div>

        <form
          className="p-10 md:p-20 relative"
          onSubmit={(e) => e.preventDefault()}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: CORPORATE IDENTITY */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col lg:flex-row items-center justify-between p-12 bg-[#31694E]/10 border border-[#BBC863]/10 rounded-[3rem] gap-10 shadow-inner">
                  <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-2">
                      <Scale className="text-[#BBC863]" size={20} />
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                        Registration Data
                      </h3>
                    </div>
                    <p className="text-sm text-[#658C58] leading-relaxed opacity-60">
                      Synchronize your legal entity name with federal records
                      for peak underwriting speed.
                    </p>
                  </div>
                  <div className="flex p-2 bg-black/60 rounded-[2rem] border border-white/10 shadow-2xl">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, isDBASame: opt === "Yes" })
                        }
                        className={`px-14 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${(opt === "Yes") === formData.isDBASame ? "bg-[#F0E491] text-[#0A1A12] shadow-2xl" : "text-white/20 hover:text-white"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <LuxuryInput
                    label="Legal Business Name"
                    icon={<Building2 />}
                    name="legalName"
                    value={formData.legalName}
                    placeholder="Acme Global Corp"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Doing Business As (DBA)"
                    icon={<FileText />}
                    name="dbaName"
                    value={formData.dbaName}
                    disabled={formData.isDBASame}
                    placeholder="Enter Trading Name"
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Federal Tax ID (EIN)"
                    icon={<Landmark />}
                    name="taxId"
                    value={formData.taxId}
                    placeholder="XX-XXXXXXX"
                    onChange={handleInputChange}
                  />
                  <LuxurySelect
                    label="Entity Structure"
                    icon={<Layers />}
                    name="entityType"
                    value={formData.entityType}
                    options={["LLC", "S-Corp", "C-Corp", "Partnership"]}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: OPERATIONAL FOOTPRINT */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <LuxuryInput
                  label="Street Address"
                  icon={<MapPin />}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="State"
                  name="state"
                  value={formData.state}
                  options={["California", "Delaware", "Texas", "New York"]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Zip Code"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Business Email"
                  icon={<Mail />}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Company Website"
                  icon={<Globe />}
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {/* STEP 3: FINANCIAL LANDSCAPE */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                <LuxurySelect
                  label="Estimated Annual Revenue"
                  icon={<BarChart3 />}
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  options={[
                    "<$100k",
                    "$100k - $500k",
                    "$500k - $2M",
                    "$2M - $10M+",
                  ]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Years in Business"
                  icon={<Calendar />}
                  name="ownershipYears"
                  value={formData.ownershipYears}
                  placeholder="Years"
                  onChange={handleInputChange}
                />
                <LuxurySelect
                  label="Primary Industry"
                  icon={<Briefcase />}
                  name="industry"
                  value={formData.industry}
                  options={[
                    "Technology",
                    "Manufacturing",
                    "Retail",
                    "Logistics",
                  ]}
                  onChange={handleInputChange}
                />
                <LuxuryInput
                  label="Direct Line"
                  icon={<Phone />}
                  name="phone"
                  value={formData.phone}
                  placeholder="+1 (555) 000-0000"
                  onChange={handleInputChange}
                />
              </motion.div>
            )}

            {/* STEP 4: CREDIT & QUALIFICATION */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {["Excellent", "Great", "Good", "Fair", "Poor"].map(
                    (label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedScore(label)}
                        className={`relative flex flex-col items-center justify-center p-12 rounded-[3rem] transition-all duration-700 border
                        ${
                          selectedScore === label
                            ? "bg-[#F0E491] border-transparent shadow-[0_20px_60px_rgba(240,228,145,0.3)] scale-110 z-10"
                            : "bg-white/[0.03] border-white/5 hover:border-[#BBC863]/40"
                        }`}
                      >
                        <div
                          className={`mb-4 transition-transform duration-500 ${selectedScore === label ? "text-[#31694E] scale-125" : "text-[#658C58]"}`}
                        >
                          {idx === 0 ? (
                            <Star />
                          ) : idx === 1 ? (
                            <TrendingUp />
                          ) : (
                            <Activity />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${selectedScore === label ? "text-[#31694E]" : "text-white"}`}
                        >
                          {label}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <div className="bg-[#31694E]/10 border border-white/10 rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0E491]/5 rounded-full blur-[120px] pointer-events-none" />
                  <div className="space-y-4 text-center md:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#31694E]/40 text-[#F0E491] text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
                      <Zap size={14} fill="currentColor" /> Peak Allocation
                      Potential
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
                      {selectedScore === "Excellent"
                        ? "$5,000,000+"
                        : "$500,000+"}
                    </h2>
                    <p className="text-[#658C58] text-sm font-bold tracking-tight max-w-sm">
                      Neural-verified capital availability based on your Tier 1{" "}
                      {selectedScore} credentials.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 w-full md:w-auto z-10">
                    <QualificationPill
                      icon={<ShieldCheck className="text-[#F0E491]" />}
                      text="Tier 1 Secure"
                    />
                    <QualificationPill
                      icon={<CheckCircle2 className="text-[#BBC863]" />}
                      text="Verified Match"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER ACTIONS */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#31694E]/20 text-[#BBC863] border border-white/5">
                <Shield size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">
                  Quantum Encryption
                </p>
                <p className="text-[9px] text-[#658C58] uppercase font-bold tracking-tighter opacity-50">
                  Subsidized Secure Link
                </p>
              </div>
            </div>

            <div className="flex gap-6 w-full md:w-auto">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-12 py-5 rounded-2xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all active:scale-95"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => (step < 4 ? setStep(step + 1) : handleSubmit())}
                className="flex-1 md:flex-none flex items-center justify-center gap-5 px-20 py-6 rounded-[2rem] bg-[#F0E491] text-[#0A1A12] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(240,228,145,0.4)] hover:scale-[1.04] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting
                  ? "Transmitting..."
                  : step === 4
                    ? "Submit Profile"
                    : "Next Phase"}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <p className="z-10 mt-14 text-[10px] text-[#31694E]/40 text-center max-w-4xl px-12 uppercase tracking-[0.3em] font-black leading-relaxed">
        Kacu Financial LLC. Pre-qualification is a soft assessment and does not
        impact credit scores. All data is encrypted via AES-256 military-grade
        standards.
      </p>
    </div>
  );
};

// UI ATOM: Multi-Tone Input
const LuxuryInput = ({
  label,
  icon,
  type = "text",
  name,
  disabled,
  value,
  placeholder,
  onChange,
}) => (
  <div
    className={`space-y-4 group transition-all duration-500 ${disabled ? "opacity-20 pointer-events-none" : ""}`}
  >
    <div className="flex justify-between items-center px-2">
      <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.3em]">
        {label} *
      </label>
      <HelpCircle
        size={14}
        className="text-white/5 group-hover:text-[#BBC863]/60 transition-colors"
      />
    </div>
    <div className="relative">
      {icon && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-all duration-500">
          {React.cloneElement(icon, { size: 20 })}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-6 ${icon ? "pl-16" : "pl-7"} pr-7 outline-none 
                   focus:border-[#BBC863]/40 focus:ring-8 focus:ring-[#BBC863]/5 transition-all text-[13px] font-bold text-white placeholder:text-white/10 shadow-inner`}
      />
    </div>
  </div>
);

// UI ATOM: Multi-Tone Select
const LuxurySelect = ({ label, icon, name, value, options, onChange }) => (
  <div className="space-y-4 group">
    <label className="text-[10px] font-black text-[#658C58] uppercase tracking-[0.3em] px-2">
      {label} *
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#F0E491] transition-all duration-500">
          {React.cloneElement(icon, { size: 20 })}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full appearance-none bg-white/[0.01] border border-white/5 rounded-[1.5rem] py-6 ${icon ? "pl-16" : "pl-7"} pr-14 outline-none 
                         focus:border-[#BBC863]/40 transition-all text-[13px] font-bold text-white shadow-inner cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0A1A12] text-white">
            {o}
          </option>
        ))}
      </select>
      <ChevronRight
        size={18}
        className="absolute right-7 top-1/2 -translate-y-1/2 rotate-90 text-[#658C58]"
      />
    </div>
  </div>
);

const QualificationPill = ({ icon, text }) => (
  <div className="flex items-center gap-4 px-8 py-4 rounded-[2rem] bg-black/40 border border-white/5 shadow-inner backdrop-blur-md transition-all hover:bg-black/60">
    {icon}
    <span className="text-[10px] font-black text-white uppercase tracking-widest">
      {text}
    </span>
  </div>
);
