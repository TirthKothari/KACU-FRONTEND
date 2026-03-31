// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronRight,
//   Activity,
//   CheckCircle2,
//   Loader2,
//   Shield,
//   Lock,
// } from "lucide-react";

// const LOAN_AMOUNT_CHOICES = [
//   { key: "OPTION_1", label: "under $10,000" },
//   { key: "OPTION_2", label: "$10,000 – $25,000" },
//   { key: "OPTION_3", label: "$25,001 – $75,000" },
//   { key: "OPTION_4", label: "$75,001 – $250,000" },
//   { key: "OPTION_5", label: "$250,001 – $500,000" },
//   { key: "OPTION_6", label: "$500,001 – $750,000" },
//   { key: "OPTION_7", label: "$750,001 – $1,000,000" },
//   { key: "OPTION_8", label: "over $1,000,000" },
// ];
// const LOAN_TERM_CHOICES = [
//   { key: "TERM_1", label: "3 months" },
//   { key: "TERM_2", label: "6 months" },
//   { key: "TERM_3", label: "12 months" },
//   { key: "TERM_4", label: "18 months" },
//   { key: "TERM_5", label: "24 months" },
//   { key: "TERM_6", label: "More than 24 months" },
// ];
// const LOCATION_CHOICES = [
//   { key: "USA", label: "USA" },
//   { key: "CANADA", label: "Canada" },
// ];
// const YEARS_CHOICES = [
//   { key: "TERM_1", label: "Less than 6 months" },
//   { key: "TERM_2", label: "6 – 12 months" },
//   { key: "TERM_3", label: "1 year" },
//   { key: "TERM_4", label: "2 – 3 years" },
//   { key: "TERM_5", label: "3 – 5 years" },
//   { key: "TERM_6", label: "More than 5 years" },
// ];
// const STEP_LABELS = ["Contact", "Business", "Funding", "Review", "Register"];

// const dbg = {
//   info: (...a) =>
//     console.log("%c[KACU ℹ]", "color:#BBC863;font-weight:bold", ...a),
//   ok: (...a) =>
//     console.log("%c[KACU ✓]", "color:#4ade80;font-weight:bold", ...a),
//   error: (...a) =>
//     console.error("%c[KACU ✗]", "color:#f87171;font-weight:bold", ...a),
// };

// const SCOPED_CSS = `
//   @keyframes kacu-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
//   @keyframes kacu-float-a { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(35px,-25px) scale(1.06)} 70%{transform:translate(-18px,20px) scale(0.97)} }
//   @keyframes kacu-pulse   { 0%,100%{box-shadow:0 8px 28px -8px rgba(240,228,145,0.3)} 50%{box-shadow:0 8px 40px -4px rgba(240,228,145,0.55)} }
//   [data-kacu-form] .kacu-shimmer-bar  { animation: kacu-shimmer 4s ease-in-out infinite; }
//   [data-kacu-form] .kacu-btn-cta      { animation: kacu-pulse   3s ease-in-out infinite; }
//   [data-kacu-form] .kacu-grid         { opacity: 0.05; background-image: linear-gradient(#31694E 1px,transparent 1px),linear-gradient(90deg,#31694E 1px,transparent 1px); backgroundSize: 52px 52px; }
// `;

// const useFormStyles = () => {
//   useEffect(() => {
//     const el = document.createElement("style");
//     el.textContent = SCOPED_CSS;
//     document.head.appendChild(el);
//     return () => document.head.removeChild(el);
//   }, []);
// };

// const ContainedBackground = () => (
//   <div
//     style={{
//       position: "absolute",
//       inset: 0,
//       overflow: "hidden",
//       pointerEvents: "none",
//       zIndex: 0,
//     }}
//   >
//     <div style={{ position: "absolute", inset: 0, background: "#FAFAF8" }} />
//     <div className="kacu-grid" style={{ position: "absolute", inset: 0 }} />
//     <div
//       style={{
//         position: "absolute",
//         top: "-10%",
//         left: "-5%",
//         width: 600,
//         height: 600,
//         background:
//           "radial-gradient(circle,#F0E491 0%,#BBC863 40%,transparent 70%)",
//         filter: "blur(100px)",
//         opacity: 0.2,
//       }}
//     />
//   </div>
// );

// const StepDots = ({ step, total }) => (
//   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//     {Array.from({ length: total }).map((_, i) => {
//       const done = i + 1 < step,
//         active = i + 1 === step;
//       return (
//         <React.Fragment key={i}>
//           <motion.div
//             layout
//             style={{
//               borderRadius: 999,
//               height: 6,
//               width: active ? 28 : done ? 8 : 6,
//               background: active
//                 ? "linear-gradient(90deg,#F0E491,#BBC863)"
//                 : done
//                   ? "rgba(187,200,99,0.6)"
//                   : "rgba(255,255,255,0.15)",
//             }}
//           />
//           {i < total - 1 && (
//             <div
//               style={{
//                 height: 1,
//                 width: 16,
//                 background: done
//                   ? "rgba(187,200,99,0.4)"
//                   : "rgba(255,255,255,0.1)",
//               }}
//             />
//           )}
//         </React.Fragment>
//       );
//     })}
//   </div>
// );

// export const PreQualificationForm = () => {
//   useFormStyles();

//   const [step, setStep] = useState(1);
//   const [status, setStatus] = useState("idle");
//   const [serverMessage, setServerMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loanTypes, setLoanTypes] = useState([]);

//   // Registration data
//   const [capturedUuid, setCapturedUuid] = useState(null);
//   const [regPassword, setRegPassword] = useState("");

//   const API_BASE = "https://kacu-backend.onrender.com/api";

//   const [formData, setFormData] = useState({
//     business_name: "",
//     name: "",
//     email: "",
//     phone: "",
//     loan_amount: "OPTION_1",
//     loan_term: "TERM_1",
//     business_location: "USA",
//     years_in_business: "TERM_1",
//     annual_revenue: "",
//     loan_type: "",
//     refernce_code: "",
//   });

//   useEffect(() => {
//     const fetchLoanTypes = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/loan-types/active/`);
//         const result = await response.json();
//         if (result.success && Array.isArray(result.data)) {
//           setLoanTypes(result.data);
//           if (result.data.length > 0)
//             setFormData((p) => ({ ...p, loan_type: result.data[0].id }));
//         }
//       } catch (err) {
//         dbg.error("Fetch loan types failed");
//       }
//     };
//     fetchLoanTypes();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
//   };

//   const validateStep = (s) => {
//     const req = {
//       1: ["business_name", "name", "email", "phone"],
//       2: ["annual_revenue"],
//       3: ["loan_type"],
//     };
//     const newErrors = {};
//     (req[s] || []).forEach((f) => {
//       if (!formData[f]?.toString().trim()) newErrors[f] = true;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Submission 1: Pre-Qualification
//   const handleSubmitPrequal = async () => {
//     setStatus("submitting");
//     setServerMessage("");

//     const rawPhone = formData.phone.replace(/\D/g, "");
//     const formattedPhone =
//       rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`;

//     const payload = {
//       ...formData,
//       phone: formattedPhone,
//       annual_revenue: parseFloat(formData.annual_revenue) || 0,
//       loan_type: parseInt(formData.loan_type),
//     };

//     try {
//       const response = await fetch(
//         `${API_BASE}/applicant/prequalification/create/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );
//       const resData = await response.json();

//       if (response.ok && resData.success) {
//         dbg.ok("Prequal Success. form_uuid:", resData.form_uuid);
//         setCapturedUuid(resData.form_uuid); // Setting form_uuid from response
//         setStep(5);
//         setStatus("idle");
//       } else {
//         setStatus("error");
//         setServerMessage(resData.message || "Prequalification failed.");
//       }
//     } catch (err) {
//       setStatus("error");
//       setServerMessage("Connection error.");
//     }
//   };

//   // Submission 2: Registration
//   // const handleRegister = async () => {
//   //   if (!regPassword) {
//   //     setErrors({ regPassword: true });
//   //     return;
//   //   }
//   //   setStatus("submitting");
//   //   setServerMessage("");

//   //   // Split Name logic
//   //   const nameParts = formData.name.trim().split(" ");
//   //   const firstName = nameParts[0];
//   //   const lastName =
//   //     nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Applicant";

//   //   const rawPhone = formData.phone.replace(/\D/g, "");
//   //   const formattedPhone =
//   //     rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`;

//   //   const regPayload = {
//   //     first_name: firstName,
//   //     last_name: lastName,
//   //     email: formData.email,
//   //     password: regPassword,
//   //     phone: formattedPhone,
//   //     role: "APPLICANT",
//   //     prequalification_form_uuid: capturedUuid, // Using the form_uuid obtained earlier
//   //   };

//   //   try {
//   //     const response = await fetch(`${API_BASE}/applicant/register/`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(regPayload),
//   //     });
//   //     const resData = await response.json();

//   //     if (response.ok) {
//   //       dbg.ok("Registration Success");
//   //       setStatus("success");
//   //     } else {
//   //       setStatus("error");
//   //       setServerMessage(resData.message || "Registration failed.");
//   //     }
//   //   } catch (err) {
//   //     setStatus("error");
//   //     setServerMessage("Registration connection error.");
//   //   }
//   // };

//   const handleRegister = async () => {
//     if (!regPassword) {
//       setErrors({ regPassword: true });
//       return;
//     }

//     setStatus("submitting");
//     setServerMessage("");

//     const nameParts = formData.name.trim().split(" ");
//     const firstName = nameParts[0];
//     const lastName =
//       nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Applicant";

//     const rawPhone = formData.phone.replace(/\D/g, "");
//     const formattedPhone =
//       rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`;

//     const regPayload = {
//       first_name: firstName,
//       last_name: lastName,
//       email: formData.email,
//       password: regPassword,
//       phone: formattedPhone,
//       role: "APPLICANT",
//       prequalification_form_uuid: capturedUuid,
//     };

//     // 🔥 DEBUG 1: Check payload before sending
//     console.log("🚀 Registration Payload:", regPayload);

//     try {
//       const response = await fetch(`${API_BASE}/applicant/register/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(regPayload),
//       });

//       // 🔥 DEBUG 2: Log raw response
//       console.log("📡 Response Status:", response.status);

//       const resData = await response.json();

//       // 🔥 DEBUG 3: Log full backend response
//       console.log("📥 Backend Response:", resData);

//       if (response.ok) {
//         console.log("✅ Registration Success");
//         setStatus("success");
//       } else {
//         console.error("❌ Registration Failed:", resData);

//         // 🔥 Show exact backend error
//         if (typeof resData === "object") {
//           const errorMessages = Object.entries(resData)
//             .map(([key, value]) => `${key}: ${value}`)
//             .join("\n");

//           setServerMessage(errorMessages);
//         } else {
//           setServerMessage(resData.message || "Registration failed.");
//         }

//         setStatus("error");
//       }
//     } catch (err) {
//       console.error("🔥 Network Error:", err);
//       setStatus("error");
//       setServerMessage("Registration connection error.");
//     }
//   };

//   if (status === "success") return <SuccessScreen />;
//   return (
//     <div
//       data-kacu-form="true"
//       style={{
//         position: "relative",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 14,
//       }}
//     >
//       <ContainedBackground />

//       <motion.div
//         layout
//         style={{
//           width: "100%",
//           maxWidth: 820,
//           position: "relative",
//           zIndex: 10,
//         }}
//       >
//         <div
//           style={{
//             borderRadius: 32,
//             background:
//               "linear-gradient(160deg,#2A5943 0%,#1E3F30 30%,#172E23 100%)",
//             border: "1px solid rgba(240,228,145,0.12)",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               padding: "2.5rem 3rem 2rem",
//               borderBottom: "1px solid rgba(255,255,255,0.06)",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <div>
//                 <span
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 900,
//                     letterSpacing: "0.25em",
//                     color: "rgba(240,228,145,0.6)",
//                   }}
//                 >
//                   {step === 5 ? "REGISTRATION" : "PRE-QUALIFICATION"}
//                 </span>
//                 <h1
//                   style={{
//                     fontSize: 32,
//                     fontWeight: 900,
//                     color: "#FAFAF8",
//                     margin: 0,
//                   }}
//                 >
//                   {step === 5 ? "Create " : "Business "}
//                   <span
//                     style={{
//                       background:
//                         "linear-gradient(135deg,#F0E491 0%,#BBC863 100%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     {step === 5 ? "Account" : "Information"}
//                   </span>
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: 13,
//                     color: "rgba(255,255,255,0.3)",
//                     marginTop: 8,
//                   }}
//                 >
//                   {STEP_LABELS[step - 1]} · Step {step} of 5
//                 </p>
//               </div>
//               <StepDots step={step} total={5} />
//             </div>
//           </div>

//           <div style={{ padding: "2.5rem 3rem" }}>
//             <AnimatePresence mode="wait">
//               {step === 1 && (
//                 <motion.div
//                   key="s1"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 20,
//                   }}
//                 >
//                   <LuxuryInput
//                     label="Business Legal Name"
//                     name="business_name"
//                     value={formData.business_name}
//                     onChange={handleInputChange}
//                     error={errors.business_name}
//                   />
//                   <LuxuryInput
//                     label="Contact Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     error={errors.name}
//                   />
//                   <LuxuryInput
//                     label="Email Address"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     error={errors.email}
//                   />
//                   <LuxuryInput
//                     label="Phone"
//                     name="phone"
//                     placeholder="10 digits"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     error={errors.phone}
//                   />
//                 </motion.div>
//               )}

//               {step === 2 && (
//                 <motion.div
//                   key="s2"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 20,
//                   }}
//                 >
//                   <LuxuryInput
//                     label="Annual Revenue ($)"
//                     name="annual_revenue"
//                     type="number"
//                     value={formData.annual_revenue}
//                     onChange={handleInputChange}
//                     error={errors.annual_revenue}
//                   />
//                   <LuxurySelect
//                     label="Years in Business"
//                     name="years_in_business"
//                     options={YEARS_CHOICES}
//                     value={formData.years_in_business}
//                     onChange={handleInputChange}
//                   />
//                   <LuxurySelect
//                     label="Business Location"
//                     name="business_location"
//                     options={LOCATION_CHOICES}
//                     value={formData.business_location}
//                     onChange={handleInputChange}
//                   />
//                   <LuxuryInput
//                     label="Reference Code"
//                     name="refernce_code"
//                     value={formData.refernce_code}
//                     onChange={handleInputChange}
//                   />
//                 </motion.div>
//               )}

//               {step === 3 && (
//                 <motion.div
//                   key="s3"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   style={{ display: "flex", flexDirection: "column", gap: 28 }}
//                 >
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr",
//                       gap: 20,
//                     }}
//                   >
//                     <LuxurySelect
//                       label="Loan Amount"
//                       name="loan_amount"
//                       options={LOAN_AMOUNT_CHOICES}
//                       value={formData.loan_amount}
//                       onChange={handleInputChange}
//                     />
//                     <LuxurySelect
//                       label="Loan Term"
//                       name="loan_term"
//                       options={LOAN_TERM_CHOICES}
//                       value={formData.loan_term}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: 10,
//                         fontWeight: 900,
//                         textTransform: "uppercase",
//                         color: "rgba(240,228,145,0.5)",
//                         marginBottom: 12,
//                       }}
//                     >
//                       Select Loan Product
//                     </label>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(3,1fr)",
//                         gap: 12,
//                       }}
//                     >
//                       {loanTypes.map((t) => (
//                         <button
//                           key={t.id}
//                           onClick={() =>
//                             setFormData({ ...formData, loan_type: t.id })
//                           }
//                           style={{
//                             padding: 16,
//                             borderRadius: 14,
//                             textAlign: "left",
//                             background:
//                               formData.loan_type === t.id
//                                 ? "rgba(240,228,145,0.15)"
//                                 : "rgba(255,255,255,0.04)",
//                             border:
//                               formData.loan_type === t.id
//                                 ? "1px solid rgba(240,228,145,0.3)"
//                                 : "1px solid rgba(255,255,255,0.08)",
//                             cursor: "pointer",
//                             color: "white",
//                           }}
//                         >
//                           <div
//                             style={{
//                               fontSize: 11,
//                               fontWeight: 900,
//                               color:
//                                 formData.loan_type === t.id
//                                   ? "#F0E491"
//                                   : "white",
//                             }}
//                           >
//                             {t.name}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {step === 4 && (
//                 <motion.div
//                   key="s4"
//                   style={{ textAlign: "center", padding: "2rem 0" }}
//                 >
//                   <Activity
//                     size={48}
//                     color="#F0E491"
//                     style={{ margin: "0 auto 20px" }}
//                   />
//                   <h2 style={{ color: "white", fontSize: 24, fontWeight: 900 }}>
//                     Final Review
//                   </h2>
//                   <p style={{ color: "rgba(255,255,255,0.4)" }}>
//                     Submit your information to continue to registration.
//                   </p>
//                 </motion.div>
//               )}

//               {step === 5 && (
//                 <motion.div
//                   key="s5"
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   style={{ textAlign: "center" }}
//                 >
//                   <div
//                     style={{
//                       background: "rgba(255,255,255,0.03)",
//                       padding: "2.5rem",
//                       borderRadius: 24,
//                       border: "1px solid rgba(255,255,255,0.05)",
//                     }}
//                   >
//                     <Lock
//                       size={32}
//                       color="#F0E491"
//                       style={{ margin: "0 auto 16px" }}
//                     />
//                     <h2
//                       style={{
//                         color: "white",
//                         fontSize: 22,
//                         fontWeight: 900,
//                         marginBottom: 8,
//                       }}
//                     >
//                       To register yourself enter password
//                     </h2>
//                     <p
//                       style={{
//                         color: "rgba(255,255,255,0.4)",
//                         fontSize: 13,
//                         marginBottom: 24,
//                       }}
//                     >
//                       This allows you to track your loan status in real-time.
//                     </p>
//                     <div
//                       style={{
//                         maxWidth: 320,
//                         margin: "0 auto",
//                         textAlign: "left",
//                       }}
//                     >
//                       <LuxuryInput
//                         label="Password"
//                         type="password"
//                         value={regPassword}
//                         onChange={(e) => setRegPassword(e.target.value)}
//                         error={errors.regPassword}
//                       />
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Navigation */}
//             <div
//               style={{
//                 marginTop: 32,
//                 paddingTop: 28,
//                 borderTop: "1px solid rgba(255,255,255,0.06)",
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               <button
//                 onClick={() => step > 1 && step < 5 && setStep(step - 1)}
//                 style={{
//                   visibility: step === 1 || step === 5 ? "hidden" : "visible",
//                   color: "#BBC863",
//                   background: "transparent",
//                   border: "1px solid rgba(187,200,99,0.2)",
//                   padding: "10px 20px",
//                   borderRadius: 12,
//                   cursor: "pointer",
//                   fontWeight: 900,
//                 }}
//               >
//                 Back
//               </button>

//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 onClick={
//                   step === 4
//                     ? handleSubmitPrequal
//                     : step === 5
//                       ? handleRegister
//                       : () => validateStep(step) && setStep(step + 1)
//                 }
//                 disabled={status === "submitting"}
//                 className="kacu-btn-cta"
//                 style={{
//                   padding: "14px 40px",
//                   borderRadius: 14,
//                   fontWeight: 900,
//                   background: "linear-gradient(135deg,#F0E491 0%,#BBC863 100%)",
//                   color: "#1E3F30",
//                   cursor: "pointer",
//                   border: "none",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                 }}
//               >
//                 {status === "submitting" ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : step === 4 ? (
//                   "Finalize Pre-Qual"
//                 ) : step === 5 ? (
//                   "Register Now"
//                 ) : (
//                   "Continue"
//                 )}
//               </motion.button>
//             </div>
//             {serverMessage && (
//               <p
//                 style={{
//                   color: "#f87171",
//                   fontSize: 12,
//                   textAlign: "center",
//                   marginTop: 16,
//                 }}
//               >
//                 {serverMessage}
//               </p>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const LuxuryInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   error,
//   type = "text",
//   placeholder,
// }) => (
//   <div
//     style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
//   >
//     <label
//       style={{
//         fontSize: 10,
//         fontWeight: 900,
//         textTransform: "uppercase",
//         color: error ? "#f87171" : "rgba(240,228,145,0.5)",
//       }}
//     >
//       {label} {error && "· required"}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       style={{
//         borderRadius: 12,
//         padding: "13px 16px",
//         fontSize: 14,
//         color: "#F0E491",
//         background: "rgba(255,255,255,0.05)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         outline: "none",
//         width: "100%",
//         boxSizing: "border-box",
//       }}
//     />
//   </div>
// );

// const LuxurySelect = ({ label, name, value, options, onChange }) => (
//   <div
//     style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
//   >
//     <label
//       style={{
//         fontSize: 10,
//         fontWeight: 900,
//         textTransform: "uppercase",
//         color: "rgba(240,228,145,0.5)",
//       }}
//     >
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       style={{
//         borderRadius: 12,
//         padding: "13px 16px",
//         fontSize: 14,
//         color: "#F0E491",
//         background: "rgba(255,255,255,0.05)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         outline: "none",
//       }}
//     >
//       {options.map((o) => (
//         <option key={o.key} value={o.key} style={{ background: "#1E3F30" }}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const SuccessScreen = () => (
//   <div
//     style={{
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <ContainedBackground />
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       style={{ textAlign: "center", zIndex: 10 }}
//     >
//       <CheckCircle2
//         size={80}
//         color="#F0E491"
//         style={{ margin: "0 auto 24px" }}
//       />
//       <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1E3F30" }}>
//         Registered!
//       </h1>
//       <p
//         style={{
//           color: "rgba(49,105,78,0.6)",
//           maxWidth: 350,
//           margin: "12px auto 32px",
//         }}
//       >
//         Your account and application have been successfully linked.
//       </p>
//       <button
//         onClick={() => window.location.reload()}
//         style={{
//           padding: "14px 40px",
//           borderRadius: 999,
//           background: "#31694E",
//           color: "#F0E491",
//           border: "none",
//           fontWeight: 900,
//           cursor: "pointer",
//         }}
//       >
//         Back to Home
//       </button>
//     </motion.div>
//   </div>
// );

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Activity,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";
import.meta.env;

// --- Constants ---
const LOAN_AMOUNT_CHOICES = [
  { key: "OPTION_1", label: "under $10,000" },
  { key: "OPTION_2", label: "$10,000 – $25,000" },
  { key: "OPTION_3", label: "$25,001 – $75,000" },
  { key: "OPTION_4", label: "$75,001 – $250,000" },
  { key: "OPTION_5", label: "$250,001 – $500,000" },
  { key: "OPTION_6", label: "$500,001 – $750,000" },
  { key: "OPTION_7", label: "$750,001 – $1,000,000" },
  { key: "OPTION_8", label: "over $1,000,000" },
];

const YEARS_CHOICES = [
  { key: "TERM_1", label: "Less than 6 months" },
  { key: "TERM_2", label: "6 – 12 months" },
  { key: "TERM_3", label: "1 year" },
  { key: "TERM_4", label: "2 – 3 years" },
  { key: "TERM_5", label: "3 – 5 years" },
  { key: "TERM_6", label: "More than 5 years" },
];

const STEP_LABELS = ["Contact", "Business", "Funding", "Review", "Security"];

// --- Main Component ---
export const PreQualificationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loanTypes, setLoanTypes] = useState([]);
  const [capturedUuid, setCapturedUuid] = useState(null);
  const [regPassword, setRegPassword] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    business_name: "",
    name: "",
    email: "",
    phone: "",
    loan_amount: "OPTION_1",
    loan_term: "TERM_1",
    business_location: "USA",
    years_in_business: "TERM_1",
    annual_revenue: "",
    loan_type: "",
    refernce_code: "",
  });

  useEffect(() => {
    fetch(`${API_BASE}/loan-types/active/`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLoanTypes(result.data);
          if (result.data.length > 0)
            setFormData((p) => ({ ...p, loan_type: result.data[0].id }));
        }
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  // Fixed Validation Function
  const validateStep = (s) => {
    const req = {
      1: ["business_name", "name", "email", "phone"],
      2: ["annual_revenue"],
      3: ["loan_type"],
    };
    const newErrors = {};

    (req[s] || []).forEach((f) => {
      // Safe check for trim
      const val =
        formData[f] !== null && formData[f] !== undefined
          ? String(formData[f]).trim()
          : "";
      if (!val) newErrors[f] = true;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPrequal = async () => {
    setStatus("submitting");
    const rawPhone = formData.phone.replace(/\D/g, "");
    const payload = {
      ...formData,
      phone: rawPhone.length <= 10 ? `+1${rawPhone}` : `+${rawPhone}`,
      annual_revenue: parseFloat(formData.annual_revenue) || 0,
    };

    try {
      const res = await fetch(
        `${API_BASE}/applicant/prequalification/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setCapturedUuid(data.form_uuid);
        setStep(5);
        setStatus("idle");
      } else {
        setStatus("error");
        setServerMessage(data.message || "Submission failed.");
      }
    } catch (err) {
      setStatus("error");
      setServerMessage("Network error.");
    }
  };

  const handleRegister = async () => {
    if (!regPassword) {
      setErrors({ regPassword: true });
      return;
    }
    setStatus("submitting");
    const nameParts = formData.name.trim().split(" ");
    const regPayload = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "Applicant",
      email: formData.email,
      password: regPassword,
      phone: formData.phone,
      role: "APPLICANT",
      prequalification_form_uuid: capturedUuid,
    };

    try {
      const res = await fetch(`${API_BASE}/applicant/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regPayload),
      });
      if (res.ok) setStatus("success");
      else {
        const data = await res.json();
        setServerMessage(
          typeof data === "object"
            ? Object.values(data).join(", ")
            : "Registration failed.",
        );
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
      setServerMessage("Connection error.");
    }
  };

  if (status === "success") return <SuccessScreen navigate={navigate} />;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center p-4 lg:p-6 bg-white font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#F0E491] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#31694E] blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="bg-[#1E3F30] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 lg:px-12 lg:py-10 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#F0E491]/60 uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F0E491] shadow-[0_0_8px_#F0E491]" />
                {step === 5
                  ? "Identity Verification"
                  : "Secure Funding Request"}
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-none">
                {step === 5 ? "Account " : "Prequalify "}
                <span className="text-[#F0E491]">
                  {step === 5 ? "Security" : "Instantly"}
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step ? "w-8 bg-[#F0E491]" : "w-3 bg-white/10"}`}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 lg:px-12 lg:py-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <LuxuryInput
                    label="Business Name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    error={errors.business_name}
                  />
                  <LuxuryInput
                    label="Contact Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                  <LuxuryInput
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  <LuxuryInput
                    label="Phone"
                    name="phone"
                    placeholder="10 digits"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <LuxuryInput
                    label="Annual Revenue ($)"
                    name="annual_revenue"
                    type="number"
                    value={formData.annual_revenue}
                    onChange={handleInputChange}
                    error={errors.annual_revenue}
                  />
                  <LuxurySelect
                    label="Years in Business"
                    name="years_in_business"
                    options={YEARS_CHOICES}
                    value={formData.years_in_business}
                    onChange={handleInputChange}
                  />
                  <LuxurySelect
                    label="Location"
                    name="business_location"
                    options={[
                      { key: "USA", label: "USA" },
                      { key: "CANADA", label: "Canada" },
                    ]}
                    value={formData.business_location}
                    onChange={handleInputChange}
                  />
                  <LuxuryInput
                    label="Reference Code"
                    name="refernce_code"
                    value={formData.refernce_code}
                    onChange={handleInputChange}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <LuxurySelect
                      label="Desired Amount"
                      name="loan_amount"
                      options={LOAN_AMOUNT_CHOICES}
                      value={formData.loan_amount}
                      onChange={handleInputChange}
                    />
                    <LuxurySelect
                      label="Loan Term"
                      name="loan_term"
                      options={[
                        { key: "TERM_1", label: "3-12 Months" },
                        { key: "TERM_2", label: "12-24 Months" },
                      ]}
                      value={formData.loan_term}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loanTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setFormData({ ...formData, loan_type: t.id })
                        }
                        className={`p-4 rounded-xl border transition-all text-left ${formData.loan_type === t.id ? "bg-[#F0E491]/10 border-[#F0E491]" : "bg-white/5 border-white/10"}`}
                      >
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                          Product
                        </div>
                        <div
                          className={`font-bold text-sm ${formData.loan_type === t.id ? "text-[#F0E491]" : "text-white"}`}
                        >
                          {t.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <Activity size={48} className="text-[#F0E491] mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Submit
                  </h3>
                  <p className="text-white/40 max-w-sm">
                    Review your information before continuing to your secure
                    registration.
                  </p>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="s5"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto py-4"
                >
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center space-y-6">
                    <Lock size={32} className="text-[#F0E491] mx-auto" />
                    <h3 className="text-xl font-bold text-white">
                      To register yourself enter password
                    </h3>
                    <LuxuryInput
                      label="Password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      error={errors.regPassword}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                <Shield size={14} /> Encrypted
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={() => step > 1 && step < 5 && setStep(step - 1)}
                  className={`flex-1 md:flex-none px-6 py-4 rounded-xl font-bold text-sm ${step === 1 || step === 5 ? "hidden" : "text-white/40 hover:text-white"}`}
                >
                  Back
                </button>
                <button
                  onClick={
                    step === 4
                      ? handleSubmitPrequal
                      : step === 5
                        ? handleRegister
                        : () => validateStep(step) && setStep(step + 1)
                  }
                  disabled={status === "submitting"}
                  className="flex-1 md:flex-none px-10 py-4 bg-[#F0E491] text-[#1E3F30] rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {status === "submitting" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {step === 4 ? "Submit" : step === 5 ? "Finish" : "Next"}{" "}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            {serverMessage && (
              <p className="text-red-400 text-[11px] text-center mt-6 font-medium">
                {serverMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// UI Components
const LuxuryInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label
      className={`text-[9px] font-black uppercase tracking-wider ml-1 ${error ? "text-red-400" : "text-white/40"}`}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-white/5 border outline-none text-[#F0E491] transition-all ${error ? "border-red-500/50" : "border-white/10 focus:border-[#F0E491]/40"}`}
    />
  </div>
);

const LuxurySelect = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[9px] font-black uppercase tracking-wider ml-1 text-white/40">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-[#F0E491] cursor-pointer focus:border-[#F0E491]/40"
    >
      {options.map((o) => (
        <option key={o.key} value={o.key} className="bg-[#1E3F30]">
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const SuccessScreen = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigate("/clientdashboard"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <CheckCircle2 size={64} className="text-[#31694E] mx-auto mb-6" />
        <h1 className="text-4xl font-black text-[#1E3F30] mb-2">Success!</h1>
        <p className="text-[#1E3F30]/60 mb-8">
          Redirecting to your dashboard...
        </p>
        <Loader2 className="animate-spin text-[#31694E] mx-auto" size={32} />
      </motion.div>
    </div>
  );
};
