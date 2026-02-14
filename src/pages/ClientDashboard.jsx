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
  Bell,
  Settings,
  ChevronRight,
  Paperclip,
  Send,
  Leaf,
  Menu,
  X,
} from "lucide-react";

// --- THEME PALETTE ---
const THEME = {
  primary: "#31694E",
  secondary: "#658C58",
  tertiary: "#BBC863",
  accent: "#F0E491",
  bg: "#FDFDF8",
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
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-[#BBC863]/30 shadow-sm ${className}`}
  >
    {children}
  </div>
);

// 1. DASHBOARD OVERVIEW
const DashboardView = ({ onChangeTab }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Header Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <Card className="p-4 md:p-5">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#F0E491] text-[#31694E] flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs md:text-sm text-[#658C58] font-semibold uppercase tracking-wide">
              Requested
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#31694E]">
              $50,000
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-5">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#BBC863]/30 text-[#31694E] flex items-center justify-center flex-shrink-0">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs md:text-sm text-[#658C58] font-semibold uppercase tracking-wide">
              Status
            </p>
            <p className="text-2xl md:text-3xl font-bold text-[#31694E]">
              In Review
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-5 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#658C58]/20 text-[#31694E] flex items-center justify-center flex-shrink-0">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs md:text-sm text-[#658C58] font-semibold uppercase tracking-wide">
              Agent
            </p>
            <p className="text-lg md:text-xl font-bold text-[#31694E]">
              Sarah Jenkins
            </p>
          </div>
        </div>
      </Card>
    </div>

    {/* Application Progress */}
    <Card className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-bold text-[#31694E]">
          Application Timeline
        </h3>
        <span className="bg-[#F0E491] text-[#31694E] px-3 py-1 rounded-full text-xs font-bold w-fit">
          Step 2 of 4
        </span>
      </div>

      <div className="relative">
        {/* Progress Line - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:block absolute top-5 left-0 w-full h-1 bg-[#BBC863]/20 rounded-full">
          <div
            className="h-full bg-[#658C58] rounded-full transition-all duration-500"
            style={{ width: "50%" }}
          ></div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden sm:flex justify-between px-0 sm:px-4">
          {[
            { label: "Submitted", date: "Nov 10", status: "completed" },
            { label: "Under Review", date: "Nov 12", status: "active" },
            { label: "Approval", date: "Pending", status: "pending" },
            { label: "Funded", date: "-", status: "pending" },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 mb-2 transition-colors
                  ${
                    step.status === "completed"
                      ? "bg-[#658C58] border-[#658C58] text-white"
                      : step.status === "active"
                        ? "bg-[#F0E491] border-[#658C58] text-[#31694E]"
                        : "bg-white border-[#BBC863]/30 text-[#BBC863]"
                  }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle size={18} />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-xs md:text-sm font-bold text-center ${step.status === "pending" ? "text-[#BBC863]" : "text-[#31694E]"}`}
              >
                {step.label}
              </p>
              <p className="text-xs text-[#658C58]/80 mt-1">{step.date}</p>
            </div>
          ))}
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="sm:hidden space-y-4">
          {[
            { label: "Submitted", date: "Nov 10", status: "completed" },
            { label: "Under Review", date: "Nov 12", status: "active" },
            { label: "Approval", date: "Pending", status: "pending" },
            { label: "Funded", date: "-", status: "pending" },
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 flex-shrink-0
                  ${
                    step.status === "completed"
                      ? "bg-[#658C58] border-[#658C58] text-white"
                      : step.status === "active"
                        ? "bg-[#F0E491] border-[#658C58] text-[#31694E]"
                        : "bg-white border-[#BBC863]/30 text-[#BBC863]"
                  }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle size={18} />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${step.status === "pending" ? "text-[#BBC863]" : "text-[#31694E]"}`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-[#658C58]/80">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>

    {/* Quick Actions Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <button
        onClick={() => onChangeTab("documents")}
        className="bg-white p-4 md:p-5 rounded-xl border border-[#BBC863]/30 hover:border-[#658C58] hover:shadow-md transition-all text-left"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F0E491] text-[#31694E] rounded-lg flex items-center justify-center mb-3">
          <Upload size={20} />
        </div>
        <h4 className="font-bold text-[#31694E] text-base md:text-lg mb-1">
          Upload Documents
        </h4>
        <p className="text-sm text-[#658C58]">2 documents pending</p>
      </button>

      <button
        onClick={() => onChangeTab("messages")}
        className="bg-white p-4 md:p-5 rounded-xl border border-[#BBC863]/30 hover:border-[#658C58] hover:shadow-md transition-all text-left"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#31694E] text-[#F0E491] rounded-lg flex items-center justify-center mb-3">
          <MessageCircle size={20} />
        </div>
        <h4 className="font-bold text-[#31694E] text-base md:text-lg mb-1">
          Contact Agent
        </h4>
        <p className="text-sm text-[#658C58]">Avg response: 1 hr</p>
      </button>

      <button className="bg-white p-4 md:p-5 rounded-xl border border-[#BBC863]/30 hover:border-[#658C58] hover:shadow-md transition-all text-left sm:col-span-2 lg:col-span-1">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#BBC863] text-white rounded-lg flex items-center justify-center mb-3">
          <FileText size={20} />
        </div>
        <h4 className="font-bold text-[#31694E] text-base md:text-lg mb-1">
          View Agreement
        </h4>
        <p className="text-sm text-[#658C58]">Download draft</p>
      </button>
    </div>
  </div>
);

// 2. APPLICATION DETAILS
const ApplicationView = () => (
  <Card className="overflow-hidden">
    <div className="p-4 md:p-6 lg:p-8 border-b border-[#BBC863]/20 bg-[#FDFDF8]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#31694E] flex flex-wrap items-center gap-2">
            Application #APP-2025-88
            <span className="bg-[#F0E491] text-[#31694E] text-xs px-2 py-1 rounded-full">
              Active
            </span>
          </h2>
          <p className="text-sm text-[#658C58] mt-1">
            Submitted on Nov 10, 2025
          </p>
        </div>
        <button className="text-[#658C58] font-bold text-sm hover:text-[#31694E] flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#F0E491]/30 transition-colors w-fit">
          <Download size={16} /> Download PDF
        </button>
      </div>
    </div>

    <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
      <div>
        <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
          <Briefcase size={14} /> Business Details
        </h3>
        <div className="space-y-3 md:space-y-4">
          {[
            { label: "Company Name", val: "GreenLeaf Solutions LLC" },
            { label: "Business Type", val: "Limited Liability Company (LLC)" },
            { label: "Industry", val: "Sustainable Agriculture" },
            { label: "Tax ID (EIN)", val: "**-***4582" },
            { label: "Annual Revenue", val: "$450,000" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:justify-between border-b border-[#BBC863]/10 pb-3 gap-1"
            >
              <span className="text-[#658C58] text-sm">{item.label}</span>
              <span className="font-semibold text-[#31694E] text-sm">
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#BBC863] uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
          <DollarSign size={14} /> Loan Request
        </h3>
        <div className="space-y-3 md:space-y-4">
          {[
            { label: "Product", val: "Eco-Growth Capital" },
            { label: "Amount Requested", val: "$50,000" },
            { label: "Term Length", val: "12 Months" },
            { label: "Purpose", val: "Greenhouse Expansion" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:justify-between border-b border-[#BBC863]/10 pb-3 gap-1"
            >
              <span className="text-[#658C58] text-sm">{item.label}</span>
              <span className="font-semibold text-[#31694E] text-sm">
                {item.val}
              </span>
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
      alert("Document Uploaded Successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-[#F0E491]/30 p-4 md:p-6 lg:p-8 rounded-xl border border-[#F0E491]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h3 className="font-bold text-[#31694E] text-base md:text-lg">
              Required Action
            </h3>
            <p className="text-sm text-[#658C58] mt-1">
              Please upload your last 3 months of bank statements to proceed
              with the underwriting process.
            </p>
          </div>
          <button
            onClick={handleUpload}
            className="bg-[#658C58] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#31694E] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full md:w-auto"
            disabled={uploading}
          >
            {uploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <Upload size={18} /> Upload Now
              </>
            )}
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 md:p-6 border-b border-[#BBC863]/20 font-bold text-[#31694E] text-base md:text-lg">
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
              className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#F0E491]/10 transition-colors"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F9FAFB] border border-[#BBC863]/20 rounded-lg flex items-center justify-center text-[#658C58] flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#31694E] text-sm md:text-base">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[#BBC863] font-medium mt-1">
                    {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end sm:justify-start">
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
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
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
    <Card className="h-[500px] md:h-[600px] lg:h-[650px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 md:p-5 border-b border-[#BBC863]/20 bg-[#F9FAFB] flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F0E491] shadow-sm"
              alt="Agent"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#658C58] border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-bold text-[#31694E] text-sm md:text-base lg:text-lg">
              Sarah Jenkins
            </p>
            <p className="text-xs text-[#658C58] font-semibold uppercase tracking-wide">
              Loan Specialist
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-white space-y-4 md:space-y-6"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] p-4 md:p-5 rounded-2xl shadow-sm text-sm leading-relaxed
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
        className="p-3 md:p-4 lg:p-5 bg-[#F9FAFB] border-t border-[#BBC863]/20 flex items-center gap-2 md:gap-3"
      >
        <button
          type="button"
          className="p-2 md:p-3 text-[#BBC863] hover:text-[#658C58] transition-colors rounded-full hover:bg-[#F0E491]/20 flex-shrink-0"
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white border border-[#BBC863]/30 rounded-full px-4 md:px-6 py-3 md:py-4 text-sm text-[#31694E] placeholder-[#BBC863] focus:outline-none focus:ring-2 focus:ring-[#658C58] focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="p-3 md:p-4 bg-[#658C58] text-white rounded-full hover:bg-[#31694E] shadow-md transition-colors flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </Card>
  );
};

// 5. PROFILE VIEW
const ProfileView = () => (
  <div className="max-w-3xl">
    <Card className="p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold text-[#31694E] mb-6 md:mb-8 border-b border-[#BBC863]/20 pb-4">
        Personal Information
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-[#F0E491] rounded-full flex items-center justify-center text-[#31694E] text-2xl md:text-3xl font-bold border-4 border-white shadow-xl mx-auto sm:mx-0 flex-shrink-0">
          JD
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
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
                className="w-full border-b border-[#BBC863]/30 py-2 text-[#31694E] font-semibold focus:outline-none focus:border-[#658C58] bg-transparent transition-colors text-sm md:text-base"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-[#31694E] text-[#F0E491] px-6 md:px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#25503b] shadow-lg transition-colors w-full sm:w-auto">
          Save Changes
        </button>
      </div>
    </Card>
  </div>
);

// --- MAIN LAYOUT ---
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles = {
    dashboard: "Dashboard Overview",
    application: "My Application",
    documents: "Documents",
    messages: "Message Center",
    profile: "My Profile",
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDF8] font-sans selection:bg-[#F0E491] selection:text-[#31694E]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-[#31694E] text-white p-4 md:p-6 flex flex-col z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-[#F0E491] hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Branding */}
        <div className="flex items-center gap-3 mb-8 md:mb-12 px-2">
          <div className="w-10 h-10 bg-[#F0E491] rounded-xl flex items-center justify-center text-[#31694E] font-bold shadow-lg">
            <Leaf size={20} fill="#31694E" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[#F0E491]">
            Kacu
          </span>
        </div>

        {/* User Profile Snippet */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 px-2 md:px-3 pb-6 md:pb-8 border-b border-[#F0E491]/20">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#658C58] rounded-full flex items-center justify-center text-base md:text-lg font-bold text-[#F0E491] border-2 border-[#31694E] flex-shrink-0">
            {USER.avatar}
          </div>
          <div className="overflow-hidden flex-1">
            <h3 className="text-sm font-bold truncate text-white">
              {USER.name}
            </h3>
            <p className="text-xs text-[#F0E491]/80 truncate">{USER.company}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 md:space-y-3 flex-1">
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
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-colors group relative
                ${
                  activeTab === item.id
                    ? "bg-[#658C58] text-white"
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
        <button className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-[#F0E491]/60 hover:bg-[#658C58]/20 hover:text-[#F0E491] transition-colors">
          <LogOut size={20} />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 md:p-6 lg:p-8 xl:p-12">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#31694E] hover:bg-[#F0E491]/30 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F0E491] rounded-lg flex items-center justify-center text-[#31694E] font-bold">
              <Leaf size={16} fill="#31694E" />
            </div>
            <span className="text-lg font-bold text-[#31694E]">Kacu</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F0E491] rounded-full border border-white"></span>
            </button>
          </div>
        </div>

        {/* Page Header - Desktop */}
        <div className="hidden lg:flex justify-between items-center mb-8 xl:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#31694E] tracking-tight">
              {pageTitles[activeTab]}
            </h1>
            <div className="text-xs md:text-sm text-[#658C58] mt-2 flex items-center gap-2 font-medium">
              <span>Client Portal</span> <ChevronRight size={14} />{" "}
              <span className="text-[#BBC863] font-bold">
                {pageTitles[activeTab]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-2 md:p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#F0E491] rounded-full border border-white"></span>
            </button>
            <button className="p-2 md:p-3 bg-white rounded-full text-[#BBC863] shadow-sm border border-[#BBC863]/30 hover:text-[#658C58] hover:shadow-md transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Page Title */}
        <div className="lg:hidden mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[#31694E]">
            {pageTitles[activeTab]}
          </h1>
        </div>

        {/* Dynamic Content Render */}
        <div className="min-h-[400px]">
          {activeTab === "dashboard" && (
            <DashboardView onChangeTab={handleTabChange} />
          )}
          {activeTab === "application" && <ApplicationView />}
          {activeTab === "documents" && <DocumentsView />}
          {activeTab === "messages" && <MessagesView />}
          {activeTab === "profile" && <ProfileView />}
        </div>
      </main>
    </div>
  );
}
