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
  CreditCard,
  Calendar,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- THEME COLORS ---
const COLORS = {
  primary: "#00ABE4", // Kacu Bright Blue
  primaryDark: "#0095c8",
  bgLight: "#E9F1FA",
  sidebarBg: "#0F172A", // Dark Navy
  sidebarActive: "#1E293B",
  textMain: "#0F172A",
  textMuted: "#64748B",
};

// --- MOCK DATA ---
const USER = {
  name: "John Doe",
  role: "Business Owner",
  company: "TechFlow Solutions",
  avatar: "JD",
  email: "john@techflow.com",
};

// --- COMPONENTS ---

// 1. DASHBOARD OVERVIEW
const DashboardView = ({ onChangeTab }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {/* Header Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#E9F1FA] text-[#00ABE4] flex items-center justify-center">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Requested Amount</p>
          <p className="text-2xl font-bold text-slate-900">$50,000</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
          <Briefcase size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">
            Application Status
          </p>
          <p className="text-2xl font-bold text-slate-900">Under Review</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
          <MessageCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Agent Assigned</p>
          <p className="text-xl font-bold text-slate-900">Sarah Jenkins</p>
        </div>
      </div>
    </div>

    {/* Application Progress */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-8">
        Application Progress
      </h3>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full -z-10">
          <div
            className="h-full bg-[#00ABE4] rounded-full transition-all duration-1000"
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
            <div key={idx} className="flex flex-col items-center bg-white px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 mb-3 transition-colors
                  ${
                    step.status === "completed"
                      ? "bg-[#00ABE4] border-[#00ABE4] text-white"
                      : step.status === "active"
                        ? "bg-white border-[#00ABE4] text-[#00ABE4]"
                        : "bg-slate-100 border-white text-slate-400"
                  }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle size={18} />
                ) : step.status === "active" ? (
                  <div className="w-3 h-3 bg-[#00ABE4] rounded-full animate-pulse" />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-sm font-bold ${step.status === "pending" ? "text-slate-400" : "text-slate-900"}`}
              >
                {step.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">{step.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Actions Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={() => onChangeTab("documents")}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#00ABE4]/30 transition-all text-left group"
      >
        <div className="w-10 h-10 bg-blue-50 text-[#00ABE4] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload size={20} />
        </div>
        <h4 className="font-bold text-slate-900 mb-1">Upload Documents</h4>
        <p className="text-sm text-slate-500">2 documents pending</p>
      </button>

      <button
        onClick={() => onChangeTab("messages")}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#00ABE4]/30 transition-all text-left group"
      >
        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <MessageCircle size={20} />
        </div>
        <h4 className="font-bold text-slate-900 mb-1">Contact Agent</h4>
        <p className="text-sm text-slate-500">Avg response: 1 hr</p>
      </button>

      <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#00ABE4]/30 transition-all text-left group">
        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <FileText size={20} />
        </div>
        <h4 className="font-bold text-slate-900 mb-1">View Agreement</h4>
        <p className="text-sm text-slate-500">Download draft</p>
      </button>
    </div>
  </motion.div>
);

// 2. APPLICATION DETAILS
const ApplicationView = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
  >
    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Application #APP-2025-88
        </h2>
        <p className="text-sm text-slate-500">Submitted on Nov 10, 2025</p>
      </div>
      <button className="text-[#00ABE4] font-semibold text-sm hover:underline">
        Download PDF
      </button>
    </div>

    <div className="p-8 grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Business Details
        </h3>
        <div className="space-y-4">
          {[
            { label: "Company Name", val: "TechFlow Solutions LLC" },
            { label: "Business Type", val: "Limited Liability Company (LLC)" },
            { label: "Industry", val: "Software Development" },
            { label: "Tax ID (EIN)", val: "**-***4582" },
            { label: "Annual Revenue", val: "$450,000" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-slate-50 pb-2"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Loan Request
        </h3>
        <div className="space-y-4">
          {[
            { label: "Product", val: "Working Capital Loan" },
            { label: "Amount Requested", val: "$50,000" },
            { label: "Term Length", val: "12 Months" },
            { label: "Purpose", val: "Inventory Expansion" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-slate-50 pb-2"
            >
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
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
      <div className="bg-[#E9F1FA] p-6 rounded-xl border border-[#00ABE4]/20 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900">Required Action</h3>
          <p className="text-sm text-slate-600">
            Please upload your last 3 months of bank statements to proceed.
          </p>
        </div>
        <button
          onClick={handleUpload}
          className="bg-[#00ABE4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0095c8] transition-colors flex items-center gap-2 shadow-md disabled:opacity-70"
          disabled={uploading}
        >
          {uploading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <>
              {" "}
              <Upload size={18} /> Upload Now{" "}
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-900">
          Uploaded Documents
        </div>
        <div className="divide-y divide-slate-50">
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
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">
                    {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full 
                        ${doc.status === "Approved" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {doc.status}
                </span>
                <button className="text-slate-400 hover:text-[#00ABE4]">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// 4. MESSAGES (CHAT)
const MessagesView = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Hi John, I'm Sarah, your dedicated funding specialist. I've reviewed your application and it looks great.",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Hi Sarah, thanks! When can I expect a decision?",
      time: "10:15 AM",
    },
    {
      id: 3,
      sender: "agent",
      text: "We just need those bank statements uploaded. Once that's done, usually within 4-6 hours!",
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

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "agent",
          text: "Thanks for the update. I'll keep an eye out for it.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 2000);
  };

  return (
    <div className="h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              alt="Agent"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-bold text-slate-900">Sarah Jenkins</p>
            <p className="text-xs text-slate-500">Loan Specialist • Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                  ${
                    msg.sender === "user"
                      ? "bg-[#00ABE4] text-white rounded-br-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                  }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[10px] mt-2 text-right ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}
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
        className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
      >
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-[#00ABE4] transition-colors"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ABE4] focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="p-3 bg-[#00ABE4] text-white rounded-full hover:bg-[#0095c8] shadow-lg shadow-[#00ABE4]/30 transition-transform active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// 5. PROFILE VIEW
const ProfileView = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl"
  >
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        Personal Information
      </h2>
      <div className="flex items-start gap-8 mb-8">
        <div className="w-24 h-24 bg-[#E9F1FA] rounded-full flex items-center justify-center text-[#00ABE4] text-3xl font-bold border-4 border-white shadow-lg">
          JD
        </div>
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full border-b border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:border-[#00ABE4]"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase">
              Email
            </label>
            <input
              type="text"
              defaultValue="john@techflow.com"
              className="w-full border-b border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:border-[#00ABE4]"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase">
              Phone
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 123-4567"
              className="w-full border-b border-slate-200 py-2 text-slate-900 font-medium focus:outline-none focus:border-[#00ABE4]"
            />
          </div>
        </div>
      </div>
      <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
        Save Changes
      </button>
    </div>
  </motion.div>
);

// --- MAIN LAYOUT ---

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mapping for titles based on active tab
  const pageTitles = {
    dashboard: "Dashboard Overview",
    application: "My Application",
    documents: "Documents",
    messages: "Message Center",
    profile: "My Profile",
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-[#00ABE4] selection:text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-[#0F172A] text-white p-6 flex flex-col z-50 shadow-2xl">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-[#00ABE4] rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="text-xl font-bold tracking-tight">Kacu</span>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 mb-10 px-3 pb-8 border-b border-slate-700">
          <div className="w-12 h-12 bg-[#00ABE4] rounded-full flex items-center justify-center text-lg font-bold shadow-lg shadow-[#00ABE4]/30">
            {USER.avatar}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold truncate">{USER.name}</h3>
            <p className="text-xs text-slate-400 truncate">{USER.company}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                ${
                  activeTab === item.id
                    ? "bg-[#00ABE4] text-white shadow-lg shadow-[#00ABE4]/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>

              {/* Active Indicator */}
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}

              {/* Badge */}
              {item.badge && activeTab !== item.id && (
                <span className="absolute right-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors mt-auto">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8 lg:p-12">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {pageTitles[activeTab]}
            </h1>
            <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>Client Portal</span> <ChevronRight size={14} />{" "}
              <span className="text-[#00ABE4]">{pageTitles[activeTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-full text-slate-500 shadow-sm border border-slate-100 hover:text-[#00ABE4] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-3 bg-white rounded-full text-slate-500 shadow-sm border border-slate-100 hover:text-[#00ABE4] transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Content Render */}
        <div className="min-h-[600px]">
          {activeTab === "dashboard" && (
            <DashboardView onChangeTab={setActiveTab} />
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
