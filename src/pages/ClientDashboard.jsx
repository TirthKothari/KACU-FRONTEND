import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  FileText,
  Folder,
  MessageCircle,
  User,
  LogOut,
  Briefcase,
  DollarSign,
  Upload,
  Download,
  CheckCircle,
  File,
  Bell,
  Search,
  Settings,
  ChevronRight,
  Paperclip,
  Send,
  Leaf,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- THEME PALETTE ---
// #F0E491 - Cream/Yellow - Highlights & Accents
// #BBC863 - Olive/Lime - Cards & Containers
// #658C58 - Sage Green - Buttons & Interactive
// #31694E - Deep Forest - Navigation & Headers

const THEME = {
  primary: "#31694E", // Deep Forest
  secondary: "#658C58", // Sage
  tertiary: "#BBC863", // Olive
  accent: "#F0E491", // Cream
  bg: "#FDFDF8", // Very light off-white/cream for main background
};

// --- MOCK DATA ---
const USER = {
  name: "John Doe",
  role: "EcoVentures Owner",
  company: "GreenLeaf Solutions",
  avatar: "JD",
  email: "john@greenleaf.com",
};

// --- SHARED COMPONENTS ---

// A reusable Card component to ensure consistent use of #BBC863
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-3xl border border-[#BBC863]/40 shadow-sm shadow-[#31694E]/5 ${className}`}
  >
    {children}
  </div>
);

// 1. DASHBOARD OVERVIEW
const DashboardView = ({ onChangeTab }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {/* Header Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#F0E491]/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <div className="w-14 h-14 rounded-2xl bg-[#F0E491] text-[#31694E] flex items-center justify-center shadow-inner">
          <DollarSign size={28} strokeWidth={2.5} />
        </div>
        <div className="z-10">
          <p className="text-sm text-[#658C58] font-bold uppercase tracking-wider">
            Requested
          </p>
          <p className="text-3xl font-bold text-[#31694E]">$50,000</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#BBC863]/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <div className="w-14 h-14 rounded-2xl bg-[#BBC863]/30 text-[#31694E] flex items-center justify-center">
          <Briefcase size={28} strokeWidth={2.5} />
        </div>
        <div className="z-10">
          <p className="text-sm text-[#658C58] font-bold uppercase tracking-wider">
            Status
          </p>
          <p className="text-3xl font-bold text-[#31694E]">In Review</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#658C58]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <div className="w-14 h-14 rounded-2xl bg-[#658C58]/20 text-[#31694E] flex items-center justify-center">
          <User size={28} strokeWidth={2.5} />
        </div>
        <div className="z-10">
          <p className="text-sm text-[#658C58] font-bold uppercase tracking-wider">
            Agent
          </p>
          <p className="text-xl font-bold text-[#31694E]">Sarah Jenkins</p>
        </div>
      </Card>
    </div>

    {/* Application Progress */}
    <Card className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-[#31694E]">
          Application Timeline
        </h3>
        <span className="bg-[#F0E491] text-[#31694E] px-3 py-1 rounded-full text-xs font-bold">
          Step 2 of 4
        </span>
      </div>

      <div className="relative px-4">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-[#BBC863]/20 rounded-full -z-10">
          <div
            className="h-full bg-[#658C58] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(101,140,88,0.4)]"
            style={{ width: "50%" }}
          ></div>
        </div>

        <div className="flex justify-between">
          {[
            { label: "Submitted", date: "Nov 10", status: "completed" },
            { label: "Under Review", date: "Nov 12", status: "active" },
            { label: "Approval", date: "Pending", status: "pending" },
            { label: "Funded", date: "-", status: "pending" },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 mb-3 transition-colors shadow-sm
                  ${
                    step.status === "completed"
                      ? "bg-[#658C58] border-[#658C58] text-[#F0E491]"
                      : step.status === "active"
                        ? "bg-[#F0E491] border-[#658C58] text-[#31694E]"
                        : "bg-white border-[#BBC863]/30 text-[#BBC863]"
                  }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle size={18} />
                ) : step.status === "active" ? (
                  <Sun size={18} className="animate-spin-slow" />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-sm font-bold ${step.status === "pending" ? "text-[#BBC863]" : "text-[#31694E]"}`}
              >
                {step.label}
              </p>
              <p className="text-xs text-[#658C58]/80 mt-1">{step.date}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>

    {/* Quick Actions Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={() => onChangeTab("documents")}
        className="bg-white p-6 rounded-3xl border border-[#BBC863]/40 hover:border-[#658C58] hover:shadow-md transition-all text-left group relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 text-[#BBC863] -mr-6 -mb-6 group-hover:scale-110 transition-transform">
          <Folder size={100} />
        </div>
        <div className="w-12 h-12 bg-[#F0E491] text-[#31694E] rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform">
          <Upload size={22} />
        </div>
        <h4 className="font-bold text-[#31694E] text-lg mb-1">
          Upload Documents
        </h4>
        <p className="text-sm text-[#658C58]">2 documents pending</p>
      </button>

      <button
        onClick={() => onChangeTab("messages")}
        className="bg-white p-6 rounded-3xl border border-[#BBC863]/40 hover:border-[#658C58] hover:shadow-md transition-all text-left group relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 text-[#BBC863] -mr-6 -mb-6 group-hover:scale-110 transition-transform">
          <MessageCircle size={100} />
        </div>
        <div className="w-12 h-12 bg-[#31694E] text-[#F0E491] rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform">
          <MessageCircle size={22} />
        </div>
        <h4 className="font-bold text-[#31694E] text-lg mb-1">Contact Agent</h4>
        <p className="text-sm text-[#658C58]">Avg response: 1 hr</p>
      </button>

      <button className="bg-white p-6 rounded-3xl border border-[#BBC863]/40 hover:border-[#658C58] hover:shadow-md transition-all text-left group relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 text-[#BBC863] -mr-6 -mb-6 group-hover:scale-110 transition-transform">
          <FileText size={100} />
        </div>
        <div className="w-12 h-12 bg-[#BBC863] text-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform">
          <FileText size={22} />
        </div>
        <h4 className="font-bold text-[#31694E] text-lg mb-1">
          View Agreement
        </h4>
        <p className="text-sm text-[#658C58]">Download draft</p>
      </button>
    </div>
  </motion.div>
);

// 2. APPLICATION DETAILS
const ApplicationView = () => (
  <Card className="overflow-hidden">
    <div className="p-8 border-b border-[#BBC863]/20 flex justify-between items-center bg-[#FDFDF8]">
      <div>
        <h2 className="text-2xl font-bold text-[#31694E] flex items-center gap-2">
          Application #APP-2025-88
          <span className="bg-[#F0E491] text-[#31694E] text-xs px-2 py-1 rounded-full">
            Active
          </span>
        </h2>
        <p className="text-sm text-[#658C58] mt-1">Submitted on Nov 10, 2025</p>
      </div>
      <button className="text-[#658C58] font-bold text-sm hover:text-[#31694E] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#F0E491]/30 transition-colors">
        <Download size={16} /> Download PDF
      </button>
    </div>

    <div className="p-8 grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest mb-6 flex items-center gap-2">
          <Briefcase size={14} /> Business Details
        </h3>
        <div className="space-y-5">
          {[
            { label: "Company Name", val: "GreenLeaf Solutions LLC" },
            { label: "Business Type", val: "Limited Liability Company (LLC)" },
            { label: "Industry", val: "Sustainable Agriculture" },
            { label: "Tax ID (EIN)", val: "**-***4582" },
            { label: "Annual Revenue", val: "$450,000" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-[#BBC863]/10 pb-3"
            >
              <span className="text-[#658C58]">{item.label}</span>
              <span className="font-semibold text-[#31694E]">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest mb-6 flex items-center gap-2">
          <DollarSign size={14} /> Loan Request
        </h3>
        <div className="space-y-5">
          {[
            { label: "Product", val: "Eco-Growth Capital" },
            { label: "Amount Requested", val: "$50,000" },
            { label: "Term Length", val: "12 Months" },
            { label: "Purpose", val: "Greenhouse Expansion" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-[#BBC863]/10 pb-3"
            >
              <span className="text-[#658C58]">{item.label}</span>
              <span className="font-semibold text-[#31694E]">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

// 3. DOCUMENTS MANAGER
const DocumentsView = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("Simulation: Document Uploaded Successfully!");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-[#F0E491]/30 p-8 rounded-3xl border border-[#F0E491] flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-[#BBC863] pointer-events-none">
          <Leaf size={140} />
        </div>
        <div className="z-10">
          <h3 className="font-bold text-[#31694E] text-lg">Required Action</h3>
          <p className="text-sm text-[#658C58] mt-1 max-w-lg">
            Please upload your last 3 months of bank statements to proceed with
            the underwriting process.
          </p>
        </div>
        <button
          onClick={handleUpload}
          className="z-10 bg-[#658C58] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#31694E] transition-all flex items-center gap-2 shadow-lg shadow-[#658C58]/30 disabled:opacity-70 transform active:scale-95"
          disabled={uploading}
        >
          {uploading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <>
              <Upload size={18} /> Upload Now
            </>
          )}
        </button>
      </div>

      <Card>
        <div className="p-6 border-b border-[#BBC863]/20 font-bold text-[#31694E] text-lg">
          Uploaded Documents
        </div>
        <div className="divide-y divide-[#BBC863]/10">
          {[
            {
              name: "Driver License (Front/Back)",
              date: "Nov 10, 2025",
              size: "2.4 MB",
              status: "Approved",
            },
            {
              name: "Business License",
              date: "Nov 10, 2025",
              size: "1.1 MB",
              status: "Approved",
            },
            {
              name: "Bank Statement (Oct 2025)",
              date: "-",
              size: "-",
              status: "Pending",
            },
          ].map((doc, i) => (
            <div
              key={i}
              className="p-5 flex items-center justify-between hover:bg-[#F0E491]/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F9FAFB] border border-[#BBC863]/20 rounded-xl flex items-center justify-center text-[#658C58] group-hover:bg-white group-hover:border-[#658C58]">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="font-bold text-[#31694E]">{doc.name}</p>
                  <p className="text-xs text-[#BBC863] font-medium mt-1">
                    {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border
                        ${
                          doc.status === "Approved"
                            ? "bg-[#658C58]/10 text-[#658C58] border-[#658C58]/20"
                            : "bg-[#F0E491]/40 text-[#b58d3f] border-[#F0E491]"
                        }`}
                >
                  {doc.status}
                </span>
                <button className="text-[#BBC863] hover:text-[#31694E] p-2 rounded-full hover:bg-[#F0E491]/20">
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

// 4. MESSAGES (CHAT)
const MessagesView = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Hi John, I'm Sarah. I've reviewed your green energy proposal and it looks fantastic.",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Hi Sarah, glad to hear that! When can I expect a decision?",
      time: "10:15 AM",
    },
    {
      id: 3,
      sender: "agent",
      text: "Once the bank statements are uploaded, usually within 4-6 hours.",
      time: "10:20 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <Card className="h-[650px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-5 border-b border-[#BBC863]/20 bg-[#F9FAFB] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="w-12 h-12 rounded-full border-2 border-[#F0E491] shadow-sm"
              alt="Agent"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#658C58] border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-bold text-[#31694E] text-lg">Sarah Jenkins</p>
            <p className="text-xs text-[#658C58] font-bold uppercase tracking-wide">
              Loan Specialist
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 p-8 overflow-y-auto bg-white space-y-6"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed
                  ${
                    msg.sender === "user"
                      ? "bg-[#658C58] text-white rounded-br-none"
                      : "bg-[#F0E491]/20 text-[#31694E] border border-[#BBC863]/20 rounded-bl-none"
                  }`}
            >
              <p className="font-medium">{msg.text}</p>
              <p
                className={`text-[10px] mt-2 text-right opacity-70 ${msg.sender === "user" ? "text-white" : "text-[#658C58]"}`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSend}
        className="p-5 bg-[#F9FAFB] border-t border-[#BBC863]/20 flex items-center gap-3"
      >
        <button
          type="button"
          className="p-3 text-[#BBC863] hover:text-[#658C58] transition-colors rounded-full hover:bg-[#F0E491]/20"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white border border-[#BBC863]/30 rounded-full px-6 py-4 text-sm text-[#31694E] placeholder-[#BBC863] focus:outline-none focus:ring-2 focus:ring-[#658C58] focus:border-transparent transition-all shadow-sm"
        />
        <button
          type="submit"
          className="p-4 bg-[#658C58] text-white rounded-full hover:bg-[#31694E] shadow-lg shadow-[#658C58]/30 transition-transform active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </Card>
  );
};

// 5. PROFILE VIEW
const ProfileView = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl"
  >
    <Card className="p-8 mb-8">
      <h2 className="text-xl font-bold text-[#31694E] mb-8 border-b border-[#BBC863]/20 pb-4">
        Personal Information
      </h2>
      <div className="flex items-start gap-8 mb-8">
        <div className="w-28 h-28 bg-[#F0E491] rounded-full flex items-center justify-center text-[#31694E] text-3xl font-bold border-4 border-white shadow-xl shadow-[#BBC863]/20">
          JD
        </div>
        <div className="flex-1 grid grid-cols-2 gap-8">
          {[
            { label: "Full Name", val: "John Doe" },
            { label: "Email", val: "john@greenleaf.com" },
            { label: "Phone", val: "+1 (555) 123-4567" },
            { label: "Role", val: "Owner" },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-xs text-[#BBC863] font-bold uppercase tracking-wider block mb-2">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.val}
                className="w-full border-b border-[#BBC863]/30 py-2 text-[#31694E] font-bold focus:outline-none focus:border-[#658C58] bg-transparent transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-[#31694E] text-[#F0E491] px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#25503b] shadow-lg shadow-[#31694E]/20 transition-all">
          Save Changes
        </button>
      </div>
    </Card>
  </motion.div>
);

// --- MAIN LAYOUT ---

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const pageTitles = {
    dashboard: "Dashboard Overview",
    application: "My Application",
    documents: "Documents",
    messages: "Message Center",
    profile: "My Profile",
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDF8] font-sans selection:bg-[#F0E491] selection:text-[#31694E]">
      {/* Sidebar - Primary Color #31694E */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-[#31694E] text-white p-6 flex flex-col z-50 shadow-2xl shadow-[#31694E]/40">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-12 px-2 mt-2">
          <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E] font-bold shadow-lg transform rotate-3">
            <Leaf size={20} fill="#31694E" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#F0E491]">
            Kacu
          </span>
        </div>

        {/* User Profile Snippet */}
        <div className="flex items-center gap-4 mb-10 px-3 pb-8 border-b border-[#F0E491]/20">
          <div className="w-12 h-12 bg-[#658C58] rounded-full flex items-center justify-center text-lg font-bold shadow-md text-[#F0E491] border-2 border-[#31694E]">
            {USER.avatar}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold truncate text-white">
              {USER.name}
            </h3>
            <p className="text-xs text-[#F0E491]/80 truncate">{USER.company}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: Home },
            { id: "application", label: "My Application", icon: FileText },
            { id: "documents", label: "Documents", icon: Folder },
            {
              id: "messages",
              label: "Messages",
              icon: MessageCircle,
              badge: 2,
            },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                ${
                  activeTab === item.id
                    ? "bg-[#658C58] text-white shadow-lg shadow-[#000]/20"
                    : "text-[#F0E491]/70 hover:bg-[#658C58]/20 hover:text-[#F0E491]"
                }`}
            >
              <item.icon
                size={20}
                className={activeTab === item.id ? "text-[#F0E491]" : ""}
              />
              <span className="font-semibold text-sm">{item.label}</span>

              {/* Badge */}
              {item.badge && activeTab !== item.id && (
                <span className="absolute right-4 bg-[#F0E491] text-[#31694E] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[#F0E491]/60 hover:bg-[#658C58]/20 hover:text-[#F0E491] transition-colors mt-auto">
          <LogOut size={20} />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8 lg:p-12 relative overflow-hidden">
        {/* Background Decorative Blob for Nature Feel */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F0E491]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-[#658C58]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Page Header */}
        <div className="flex justify-between items-center mb-12 relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-[#31694E] tracking-tight">
              {pageTitles[activeTab]}
            </h1>
            <div className="text-sm text-[#658C58] mt-2 flex items-center gap-2 font-medium">
              <span>Client Portal</span> <ChevronRight size={14} />{" "}
              <span className="text-[#BBC863] font-bold">
                {pageTitles[activeTab]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F0E491] rounded-full border border-white"></span>
            </button>
            <button className="p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Content Render */}
        <div className="min-h-[600px] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && (
                <DashboardView onChangeTab={setActiveTab} />
              )}
              {activeTab === "application" && <ApplicationView />}
              {activeTab === "documents" && <DocumentsView />}
              {activeTab === "messages" && <MessagesView />}
              {activeTab === "profile" && <ProfileView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
