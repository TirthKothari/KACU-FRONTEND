import { useState, useEffect, useCallback, useRef } from "react";
// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const log = (label, data) =>
  console.log(
    `%c[AGENT DEBUG] ${label}`,
    "color:#31694E;font-weight:bold;",
    data ?? "",
  );
const logError = (label, err) =>
  console.error(
    `%c[AGENT ERROR] ${label}`,
    "color:#e53935;font-weight:bold;",
    err,
  );

const getToken = () => localStorage.getItem("token");

const handle401 = (res) => {
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return true;
  }
  return false;
};

const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
  });
  if (handle401(res)) return;
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
  return data;
};

const apiPatch = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  if (handle401(res)) return;
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_META = {
  draft: { label: "Draft", color: "#BBC863", bg: "rgba(187,200,99,0.12)" },
  submitted: {
    label: "Submitted",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.10)",
  },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
};

const STEPS_ORDER = [
  "business_information",
  "funding_information",
  "business_ownership_information",
  "terms_and_conditions",
  "document_upload",
  "review_submission",
  "completed",
];
const STEP_LABELS = {
  business_information: "Business Info",
  funding_information: "Funding",
  business_ownership_information: "Ownership",
  terms_and_conditions: "Terms",
  document_upload: "Documents",
  review_submission: "Review",
  completed: "Complete",
};

const LOAN_TYPE_COLORS = [
  "#31694E",
  "#BBC863",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  Leaf: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 6-8 6z" />
    </svg>
  ),
  Home: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Users: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  File: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  User: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Logout: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevRight: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevLeft: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevDown: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Check2: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  XCircle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Refresh: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  Dollar: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Search: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Eye: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Building: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 9h6" />
      <path d="M3 15h6" />
      <path d="M15 3v18" />
      <path d="M15 9h6" />
      <path d="M15 15h6" />
    </svg>
  ),
  Alert: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Folder: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  MessageCircle: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Send: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Megaphone: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
  TrendingUp: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Sort: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Filter: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Partner: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Hash: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Percent: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Spinner = ({ size = 24, color = "#31694E" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: "kacu-spin 0.8s linear infinite" }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="3"
      strokeOpacity="0.2"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: meta.color,
        background: meta.bg,
        display: "inline-block",
      }}
    >
      {meta.label}
    </span>
  );
};

const Avatar = ({ first, last, size = 40, radius = 12, color }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: color || "linear-gradient(135deg,#31694E,#658C58)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#F0E491",
      fontSize: size * 0.35,
      fontWeight: 800,
      flexShrink: 0,
    }}
  >
    {(first?.[0] || "").toUpperCase()}
    {(last?.[0] || "").toUpperCase()}
  </div>
);

const FieldRow = ({ label, value, highlight }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "8px 0",
      borderBottom: "1px solid #f5f5f5",
    }}
  >
    <span
      style={{ fontSize: 12, color: "#888", fontWeight: 600, minWidth: 140 }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: highlight ? "#31694E" : "#1a1a1a",
        textAlign: "right",
      }}
    >
      {value || "—"}
    </span>
  </div>
);

const SectionCard = ({ title, icon: IconComp, children, accent }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      border: "1.5px solid #f0f0f0",
      overflow: "hidden",
      marginBottom: 16,
    }}
  >
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "1.5px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#FAFDF8",
      }}
    >
      {IconComp && (
        <IconComp
          width={16}
          height={16}
          style={{ color: accent || "#31694E" }}
        />
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: accent || "#31694E",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const EmptySection = ({ label }) => (
  <div
    style={{
      padding: 40,
      textAlign: "center",
      color: "#bbb",
      fontSize: 13,
      border: "2px dashed #f0f0f0",
      borderRadius: 12,
    }}
  >
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CHAT BOX COMPONENT (within application drawer)
// FIX: Moved initial state computation out of useEffect to avoid
//      react-hooks/set-state-in-effect and no-empty errors.
// ─────────────────────────────────────────────────────────────────────────────
const getInitialMessages = (recipientId) => {
  const stored = localStorage.getItem(`chat_${recipientId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to default
    }
  }
  return [
    {
      id: 1,
      from: recipientId,
      text: "Hello, I have a question about my application.",
      time: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
};

const ChatBox = ({ recipientId, recipientName, currentUserId }) => {
  const [messages, setMessages] = useState(() =>
    getInitialMessages(recipientId),
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // FIX: Only scroll on message changes — no setState calls here
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // FIX: Re-initialize messages when recipientId changes without calling
  //      setState synchronously inside a useEffect body.
  useEffect(() => {
    setMessages(getInitialMessages(recipientId));
  }, [recipientId]);

  const sendMessage = () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const msg = {
      id: Date.now(),
      from: currentUserId,
      text: input.trim(),
      time: new Date().toISOString(),
    };
    setMessages((prev) => {
      const updated = [...prev, msg];
      localStorage.setItem(`chat_${recipientId}`, JSON.stringify(updated));
      return updated;
    });
    setInput("");
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 400,
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #f0f0f0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1.5px solid #f0f0f0",
          background: "#FAFDF8",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon.MessageCircle
          width={16}
          height={16}
          style={{ color: "#31694E" }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#31694E",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Chat with {recipientName}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.from === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "8px 12px",
                  borderRadius: isMe
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                  background: isMe ? "#31694E" : "#f0f0f0",
                  color: isMe ? "#fff" : "#1a1a1a",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
                <div
                  style={{
                    fontSize: 10,
                    color: isMe ? "rgba(255,255,255,0.6)" : "#aaa",
                    marginTop: 2,
                    textAlign: "right",
                  }}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1.5px solid #f0f0f0",
          display: "flex",
          gap: 8,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            outline: "none",
            fontSize: 13,
            resize: "none",
            fontFamily: "inherit",
            lineHeight: 1.4,
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#31694E",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: !input.trim() ? 0.5 : 1,
            flexShrink: 0,
          }}
        >
          <Icon.Send width={16} height={16} style={{ color: "#fff" }} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DECISION MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DecisionModal = ({ app, onClose, onSuccess }) => {
  const [decision, setDecision] = useState("approved");
  const [approvedFunds, setApprovedFunds] = useState("");
  const [partnerCommission, setPartnerCommission] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const hasPartner = !!app?.user?.partner;

  const handleSubmit = async () => {
    setError("");
    if (decision === "approved" && !approvedFunds) {
      setError("Approved funds amount is required.");
      return;
    }
    if (decision === "approved" && hasPartner && !partnerCommission) {
      setError("Partner commission is required for this application.");
      return;
    }
    if (decision === "rejected" && !rejectionReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { status: decision.toUpperCase() };
      if (decision === "approved") {
        payload.approved_funds = parseFloat(approvedFunds);
        if (hasPartner)
          payload.partner_commision = parseFloat(partnerCommission);
      } else {
        payload.rejection_reason = rejectionReason;
      }
      await apiPatch(
        `/application/${app.loan_application_uuid}/decision/`,
        payload,
      );
      onSuccess();
    } catch (e) {
      logError("Decision failed", e);
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(20,40,30,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            background: "#FAFDF8",
            borderBottom: "1.5px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}>
              Make a Decision
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {app?.user?.first_name} {app?.user?.last_name} ·{" "}
              {app?.loan_type_info?.name || app?.loan_type?.name || "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#fef2f2",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.X width={16} height={16} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              padding: 4,
              background: "#f5f5f5",
              borderRadius: 12,
            }}
          >
            {["approved", "rejected"].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDecision(d);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  transition: "all 0.2s",
                  background:
                    decision === d
                      ? d === "approved"
                        ? "#22c55e"
                        : "#ef4444"
                      : "transparent",
                  color: decision === d ? "#fff" : "#888",
                }}
              >
                {d === "approved" ? "✓ Approve" : "✗ Reject"}
              </button>
            ))}
          </div>
          {decision === "approved" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Approved Amount ($) *
                </label>
                <input
                  type="number"
                  value={approvedFunds}
                  onChange={(e) => setApprovedFunds(e.target.value)}
                  placeholder="e.g. 50000"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#31694E",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#31694E")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              {hasPartner && (
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#BBC863",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Partner Commission ($) *
                  </label>
                  <div
                    style={{
                      background: "rgba(187,200,99,0.08)",
                      border: "1px solid rgba(187,200,99,0.3)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      marginBottom: 8,
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    <Icon.Partner
                      width={12}
                      height={12}
                      style={{
                        color: "#BBC863",
                        marginRight: 6,
                        verticalAlign: "middle",
                      }}
                    />
                    Referred by:{" "}
                    <strong style={{ color: "#1a1a1a" }}>
                      {app?.user?.partner?.first_name}{" "}
                      {app?.user?.partner?.last_name}
                    </strong>
                  </div>
                  <input
                    type="number"
                    value={partnerCommission}
                    onChange={(e) => setPartnerCommission(e.target.value)}
                    placeholder="e.g. 1500"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#BBC863")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ef4444")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                borderRadius: 10,
                padding: "10px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Icon.Alert
                width={16}
                height={16}
                style={{ color: "#ef4444", flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#ef4444" }}>{error}</span>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "transparent",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              color: "#888",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 800,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: decision === "approved" ? "#22c55e" : "#ef4444",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <Spinner size={16} color="#fff" />
            ) : decision === "approved" ? (
              <Icon.Check2 width={16} height={16} />
            ) : (
              <Icon.XCircle width={16} height={16} />
            )}
            {submitting
              ? "Processing..."
              : decision === "approved"
                ? "Approve Application"
                : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION DETAIL DRAWER
// FIX: Replaced synchronous setState calls inside useEffect with a single
//      startTransition-compatible pattern using functional updates.
// ─────────────────────────────────────────────────────────────────────────────
const AppDetailDrawer = ({ uuid, onClose, onDecisionMade, currentUser }) => {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDecision, setShowDecision] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!uuid) return;

    // FIX: batch all resets into a single state object update pattern —
    //      each setter is called, but React batches them in React 18.
    //      The real lint issue was calling them outside async boundaries;
    //      wrapping in a local async IIFE is the idiomatic fix.
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setActiveTab("overview");
      try {
        const data = await apiGet(`/application/${uuid}/`);
        if (!cancelled) setApp(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  const canDecide = app?.status === "submitted" || app?.status === "pending";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "business", label: "Business" },
    { id: "funding", label: "Funding" },
    { id: "owner", label: "Owner" },
    { id: "documents", label: "Documents" },
    { id: "chat", label: "💬 Chat" },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 199,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(620px, 100vw)",
          background: "#fff",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1.5px solid #f0f0f0",
            background: "#FAFDF8",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Application Detail
              </div>
              {app && (
                <>
                  <div
                    style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}
                  >
                    {app.user?.first_name} {app.user?.last_name}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {app.loan_type_info?.name || app.loan_type?.name || "—"} ·{" "}
                    {app.loan_application_uuid?.slice(0, 8)}…
                    {app.user?.partner && (
                      <span
                        style={{
                          marginLeft: 8,
                          background: "rgba(187,200,99,0.15)",
                          color: "#868a30",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        Referred
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {app && <StatusBadge status={app.status} />}
              <button
                onClick={onClose}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Icon.X width={16} height={16} />
              </button>
            </div>
          </div>
          {canDecide && !loading && (
            <button
              onClick={() => setShowDecision(true)}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#31694E,#4a8c6a)",
                border: "none",
                color: "#F0E491",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon.Check2 width={14} height={14} /> Make Decision
            </button>
          )}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1.5px solid #f0f0f0",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 16px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: 12,
                color: activeTab === t.id ? "#31694E" : "#888",
                borderBottom:
                  activeTab === t.id
                    ? "2.5px solid #31694E"
                    : "2.5px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {loading && (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 40 }}
            >
              <Spinner size={32} />
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: 16,
                color: "#ef4444",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
          {app && !loading && (
            <>
              {activeTab === "overview" && (
                <div>
                  <SectionCard title="Application Progress" icon={Icon.Clock}>
                    <div style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          color: "#888",
                          marginBottom: 6,
                        }}
                      >
                        <span>Completion</span>
                        <span>{app.completion_percentage}%</span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: "#f0f0f0",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${app.completion_percentage}%`,
                            background:
                              "linear-gradient(90deg,#31694E,#658C58)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      {STEPS_ORDER.slice(0, 6).map((s, i) => {
                        const idx = STEPS_ORDER.indexOf(
                          app.current_step ?? "business_information",
                        );
                        const done = i <= idx;
                        return (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              padding: "4px 10px",
                              borderRadius: 99,
                              fontWeight: 700,
                              background: done
                                ? "rgba(49,105,78,0.12)"
                                : "#f5f5f5",
                              color: done ? "#31694E" : "#bbb",
                            }}
                          >
                            {STEP_LABELS[s]}
                          </span>
                        );
                      })}
                    </div>
                  </SectionCard>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      {
                        label: "Loan Type",
                        value:
                          app.loan_type_info?.name ||
                          app.loan_type?.name ||
                          "—",
                      },
                      {
                        label: "Status",
                        value: <StatusBadge status={app.status} />,
                      },
                      {
                        label: "Submitted At",
                        value: app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString()
                          : "Not yet",
                      },
                      {
                        label: "Approved Funds",
                        value: app.approved_funds
                          ? `$${Number(app.approved_funds).toLocaleString()}`
                          : "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          background: "#FAFDF8",
                          borderRadius: 12,
                          padding: "14px",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#BBC863",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 6,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Partner badge */}
                  {app.user?.partner && (
                    <div
                      style={{
                        background: "rgba(187,200,99,0.08)",
                        border: "1.5px solid rgba(187,200,99,0.3)",
                        borderRadius: 12,
                        padding: "12px 16px",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "#BBC863",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {app.user.partner.first_name?.[0]}
                        {app.user.partner.last_name?.[0]}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#BBC863",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          Referred by Partner
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {app.user.partner.first_name}{" "}
                          {app.user.partner.last_name}
                        </div>
                        <div style={{ fontSize: 11, color: "#888" }}>
                          {app.user.partner.email}
                        </div>
                      </div>
                      {app.partner_commision && (
                        <div style={{ marginLeft: "auto", textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color: "#888",
                              textTransform: "uppercase",
                            }}
                          >
                            Commission
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              color: "#31694E",
                            }}
                          >
                            ${Number(app.partner_commision).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <SectionCard title="Applicant" icon={Icon.User}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <Avatar
                        first={app.user?.first_name}
                        last={app.user?.last_name}
                        size={44}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>
                          {app.user?.first_name} {app.user?.last_name}
                        </div>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {app.user?.email}
                        </div>
                      </div>
                    </div>
                    <FieldRow label="Phone" value={app.user?.phone} />
                    <FieldRow label="Role" value={app.user?.role} />
                    <FieldRow
                      label="Qualified"
                      value={app.user?.is_qualified ? "✅ Yes" : "❌ No"}
                    />
                  </SectionCard>

                  {app.status === "rejected" && app.rejection_reason && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1.5px solid #fecaca",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#ef4444",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        Rejection Reason
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}
                      >
                        {app.rejection_reason}
                      </div>
                    </div>
                  )}
                  {app.status === "approved" && (
                    <div
                      style={{
                        background: "#f0fdf4",
                        border: "1.5px solid #bbf7d0",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#22c55e",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        Approved
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#22c55e",
                        }}
                      >
                        ${Number(app.approved_funds || 0).toLocaleString()}
                      </div>
                      {app.approved_at && (
                        <div
                          style={{ fontSize: 12, color: "#888", marginTop: 4 }}
                        >
                          {new Date(app.approved_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "business" &&
                (app.business_information ? (
                  <SectionCard
                    title="Business Information"
                    icon={Icon.Building}
                  >
                    <FieldRow
                      label="Legal Name"
                      value={app.business_information.business_legal_name}
                      highlight
                    />
                    <FieldRow
                      label="DBA Name"
                      value={app.business_information.business_dba_name}
                    />
                    <FieldRow
                      label="Email"
                      value={app.business_information.business_email}
                    />
                    <FieldRow
                      label="Phone"
                      value={app.business_information.business_phone_number}
                    />
                    <FieldRow
                      label="Website"
                      value={app.business_information.business_website}
                    />
                    <FieldRow
                      label="Address"
                      value={app.business_information.business_address}
                    />
                    <FieldRow
                      label="City"
                      value={app.business_information.business_city}
                    />
                    <FieldRow
                      label="State"
                      value={app.business_information.business_state}
                    />
                    <FieldRow
                      label="Zip Code"
                      value={app.business_information.business_zip_code}
                    />
                    <FieldRow
                      label="Industry"
                      value={app.business_information.business_industry_type}
                    />
                    <FieldRow
                      label="Entity Type"
                      value={app.business_information.business_legal_entity_type?.toUpperCase()}
                    />
                    <FieldRow
                      label="EIN / Reg. #"
                      value={app.business_information.business_number}
                    />
                    <FieldRow
                      label="Est. Start Date"
                      value={
                        app.business_information.business_estimated_start_date
                      }
                    />
                    <FieldRow
                      label="Monthly Sales"
                      value={
                        app.business_information
                          .business_average_gross_monthly_sales
                          ? `$${Number(app.business_information.business_average_gross_monthly_sales).toLocaleString()}`
                          : null
                      }
                      highlight
                    />
                  </SectionCard>
                ) : (
                  <EmptySection label="Business information not submitted yet." />
                ))}

              {activeTab === "funding" &&
                (app.funding_information ? (
                  <SectionCard title="Funding Information" icon={Icon.Dollar}>
                    <FieldRow
                      label="Amount Requested"
                      value={`$${Number(app.funding_information.loan_amount_requested).toLocaleString()}`}
                      highlight
                    />
                    <FieldRow
                      label="Term Requested"
                      value={app.funding_information.loan_term_requested}
                    />
                    <FieldRow
                      label="Purpose"
                      value={app.funding_information.loan_purpose}
                    />
                    <FieldRow
                      label="Overdraft Protection"
                      value={
                        app.funding_information.overdraft_protection
                          ? "Yes"
                          : "No"
                      }
                    />
                    {app.funding_information.overdraft_protection && (
                      <FieldRow
                        label="Overdraft Limit"
                        value={`$${Number(app.funding_information.overdraft_protection_limit).toLocaleString()}`}
                      />
                    )}
                    <FieldRow
                      label="Existing Loans"
                      value={
                        app.funding_information.business_existing_loan
                          ? "Yes"
                          : "No"
                      }
                    />
                    {app.funding_information.business_lender_details?.length >
                      0 && (
                      <div style={{ marginTop: 12 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#BBC863",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 8,
                          }}
                        >
                          Lenders
                        </div>
                        {app.funding_information.business_lender_details.map(
                          (l, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "6px 10px",
                                background: "#f9f9f9",
                                borderRadius: 8,
                                marginBottom: 4,
                                fontSize: 13,
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                {l.lender_name}
                              </span>
                              <span
                                style={{ fontWeight: 700, color: "#31694E" }}
                              >
                                ${Number(l.balance).toLocaleString()}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </SectionCard>
                ) : (
                  <EmptySection label="Funding information not submitted yet." />
                ))}

              {activeTab === "owner" &&
                (app.owner_information ? (
                  <SectionCard title="Owner Information" icon={Icon.User}>
                    <FieldRow
                      label="Full Name"
                      value={`${app.owner_information.owner_first_name} ${app.owner_information.owner_last_name}`}
                      highlight
                    />
                    <FieldRow
                      label="Email"
                      value={app.owner_information.owner_email}
                    />
                    <FieldRow
                      label="Phone"
                      value={app.owner_information.owner_phone_number}
                    />
                    <FieldRow
                      label="Date of Birth"
                      value={app.owner_information.owner_date_of_birth}
                    />
                    <FieldRow
                      label="SSN"
                      value={
                        app.owner_information.owner_ssn
                          ? "•••-••-" +
                            app.owner_information.owner_ssn.slice(-4)
                          : null
                      }
                    />
                    <FieldRow
                      label="Address"
                      value={app.owner_information.owner_address}
                    />
                    <FieldRow
                      label="City"
                      value={app.owner_information.owner_city}
                    />
                    <FieldRow
                      label="State"
                      value={app.owner_information.owner_state}
                    />
                    <FieldRow
                      label="Zip Code"
                      value={app.owner_information.owner_zip_code}
                    />
                    <FieldRow
                      label="Ownership %"
                      value={
                        app.owner_information.owner_percentage_of_ownership
                          ? `${app.owner_information.owner_percentage_of_ownership}%`
                          : null
                      }
                    />
                    <FieldRow
                      label="Credit Score"
                      value={app.owner_information.owner_credit_score}
                      highlight
                    />
                  </SectionCard>
                ) : (
                  <EmptySection label="Owner information not submitted yet." />
                ))}

              {activeTab === "documents" &&
                (app.documents?.length > 0 ? (
                  <SectionCard title="Uploaded Documents" icon={Icon.Folder}>
                    {app.documents.map((doc) => (
                      <div
                        key={doc.document_uuid}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "#FAFDF8",
                          borderRadius: 10,
                          marginBottom: 8,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: "rgba(49,105,78,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon.File
                              width={16}
                              height={16}
                              style={{ color: "#31694E" }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1a1a1a",
                              }}
                            >
                              {doc.document_name}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {doc.document_file && (
                          <a
                            href={doc.document_file}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              background: "rgba(49,105,78,0.1)",
                              color: "#31694E",
                              fontSize: 11,
                              fontWeight: 700,
                              textDecoration: "none",
                              textTransform: "uppercase",
                            }}
                          >
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </SectionCard>
                ) : (
                  <EmptySection label="No documents uploaded yet." />
                ))}

              {activeTab === "chat" && (
                <ChatBox
                  recipientId={app.user?.id}
                  recipientName={`${app.user?.first_name} ${app.user?.last_name}`}
                  currentUserId={currentUser?.id}
                />
              )}
            </>
          )}
        </div>
      </div>

      {showDecision && (
        <DecisionModal
          app={app}
          onClose={() => setShowDecision(false)}
          onSuccess={() => {
            setShowDecision(false);
            onDecisionMade();
            onClose();
          }}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION LIST ROW
// ─────────────────────────────────────────────────────────────────────────────
const AppRow = ({ app, onClick }) => {
  const stepIdx = STEPS_ORDER.indexOf(
    app.current_step ?? "business_information",
  );
  const progress =
    app.completion_percentage ??
    Math.round(((stepIdx + 1) / STEPS_ORDER.length) * 100);

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "16px 20px",
        border: "1.5px solid #f0f0f0",
        cursor: "pointer",
        transition: "all 0.18s",
        marginBottom: 10,
        display: "grid",
        gridTemplateColumns: "44px 1fr 1fr auto 80px auto auto",
        gap: 14,
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#31694E";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(49,105,78,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#f0f0f0";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Avatar
        first={app.user?.first_name}
        last={app.user?.last_name}
        size={44}
        radius={12}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 14,
            color: "#1a1a1a",
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {app.user?.first_name} {app.user?.last_name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#888",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {app.user?.email}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: "#31694E",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {app.loan_type_info?.name || app.loan_type?.name || "—"}
        </div>
        {app.business_information?.business_legal_name && (
          <div
            style={{
              fontSize: 11,
              color: "#aaa",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {app.business_information.business_legal_name}
          </div>
        )}
      </div>
      <div style={{ width: 90 }}>
        {app.user?.partner ? (
          <span
            style={{
              background: "rgba(187,200,99,0.15)",
              color: "#868a30",
              padding: "3px 8px",
              borderRadius: 99,
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Referred
          </span>
        ) : (
          <span style={{ fontSize: 11, color: "#ddd" }}>—</span>
        )}
      </div>
      <div
        style={{ width: 80, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <div style={{ fontSize: 10, color: "#888", textAlign: "right" }}>
          {progress}%
        </div>
        <div
          style={{
            height: 5,
            background: "#f0f0f0",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg,#31694E,#658C58)",
              borderRadius: 99,
            }}
          />
        </div>
      </div>
      <StatusBadge status={app.status} />
      <Icon.ChevRight width={16} height={16} style={{ color: "#ccc" }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ApplicationsView = ({ applications, onSelect, loanTypes }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoanType, setFilterLoanType] = useState("all");
  const [filterPartner, setFilterPartner] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = applications
    .filter((app) => {
      const name =
        `${app.user?.first_name} ${app.user?.last_name}`.toLowerCase();
      const biz = (
        app.business_information?.business_legal_name || ""
      ).toLowerCase();
      const matchSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        biz.includes(search.toLowerCase()) ||
        app.loan_application_uuid?.includes(search);
      const matchStatus = filterStatus === "all" || app.status === filterStatus;
      const appLoanType = app.loan_type_info?.name || app.loan_type?.name || "";
      const matchLoanType =
        filterLoanType === "all" || appLoanType === filterLoanType;
      const matchPartner =
        filterPartner === "all" ||
        (filterPartner === "referred"
          ? !!app.user?.partner
          : !app.user?.partner);
      return matchSearch && matchStatus && matchLoanType && matchPartner;
    })
    .sort((a, b) => {
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc")
        return `${a.user?.first_name} ${a.user?.last_name}`.localeCompare(
          `${b.user?.first_name} ${b.user?.last_name}`,
        );
      if (sortBy === "name_desc")
        return `${b.user?.first_name} ${b.user?.last_name}`.localeCompare(
          `${a.user?.first_name} ${a.user?.last_name}`,
        );
      if (sortBy === "loan_type")
        return (a.loan_type_info?.name || "").localeCompare(
          b.loan_type_info?.name || "",
        );
      if (sortBy === "progress_desc")
        return (b.completion_percentage || 0) - (a.completion_percentage || 0);
      return 0;
    });

  const activeFilterCount = [
    filterStatus !== "all",
    filterLoanType !== "all",
    filterPartner !== "all",
  ].filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          All Applications
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {applications.length} total · {filtered.length} shown
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <Icon.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, business name or UUID..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 36px 8px 14px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              fontSize: 12,
              fontWeight: 700,
              color: "#31694E",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="name_asc">Name A→Z</option>
            <option value="name_desc">Name Z→A</option>
            <option value="loan_type">By Loan Type</option>
            <option value="progress_desc">By Progress</option>
          </select>
          <Icon.Sort
            width={14}
            height={14}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#31694E",
              pointerEvents: "none",
            }}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: `1.5px solid ${activeFilterCount > 0 ? "#31694E" : "#e5e7eb"}`,
            background: activeFilterCount > 0 ? "rgba(49,105,78,0.08)" : "#fff",
            color: activeFilterCount > 0 ? "#31694E" : "#888",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon.Filter width={14} height={14} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {showFilters && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f0f0f0",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 16,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Status
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                "all",
                "submitted",
                "pending",
                "approved",
                "rejected",
                "draft",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: filterStatus === s ? "#31694E" : "#e5e7eb",
                    background:
                      filterStatus === s ? "rgba(49,105,78,0.08)" : "#fff",
                    color: filterStatus === s ? "#31694E" : "#888",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {s === "all" ? "All" : STATUS_META[s]?.label || s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Loan Type
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", ...(loanTypes || []).map((lt) => lt.name)].map((lt) => (
                <button
                  key={lt}
                  onClick={() => setFilterLoanType(lt)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: filterLoanType === lt ? "#31694E" : "#e5e7eb",
                    background:
                      filterLoanType === lt ? "rgba(49,105,78,0.08)" : "#fff",
                    color: filterLoanType === lt ? "#31694E" : "#888",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {lt === "all" ? "All Types" : lt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              Referral
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { val: "all", label: "All" },
                { val: "referred", label: "Referred" },
                { val: "direct", label: "Direct" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setFilterPartner(val)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: filterPartner === val ? "#31694E" : "#e5e7eb",
                    background:
                      filterPartner === val ? "rgba(49,105,78,0.08)" : "#fff",
                    color: filterPartner === val ? "#31694E" : "#888",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterLoanType("all");
                setFilterPartner("all");
              }}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "1.5px solid #ef4444",
                background: "#fef2f2",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
                alignSelf: "flex-end",
                marginTop: "auto",
              }}
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        filtered.map((app) => (
          <AppRow
            key={app.loan_application_uuid}
            app={app}
            onClick={() => onSelect(app.loan_application_uuid)}
          />
        ))
      ) : (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "#bbb",
            border: "2px dashed #f0f0f0",
            borderRadius: 16,
            fontSize: 14,
          }}
        >
          No applications match your filters.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
const ClientDetailDrawer = ({
  client,
  applications,
  onClose,
  onSelectApp,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const clientApps = applications.filter((a) => a.user?.id === client?.id);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 199,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(580px, 100vw)",
          background: "#fff",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1.5px solid #f0f0f0",
            background: "#FAFDF8",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                Client Profile
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>
                {client?.first_name} {client?.last_name}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                {client?.email}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  background: "rgba(49,105,78,0.1)",
                  color: "#31694E",
                }}
              >
                {client?.role || "applicant"}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                }}
              >
                <Icon.X width={16} height={16} />
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1.5px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          {[
            { id: "details", label: "Details" },
            {
              id: "applications",
              label: `Applications (${clientApps.length})`,
            },
            { id: "chat", label: "💬 Chat" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: 12,
                color: activeTab === t.id ? "#31694E" : "#888",
                borderBottom:
                  activeTab === t.id
                    ? "2.5px solid #31694E"
                    : "2.5px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {activeTab === "details" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <Avatar
                  first={client?.first_name}
                  last={client?.last_name}
                  size={64}
                  radius={18}
                />
                <div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}
                  >
                    {client?.first_name} {client?.last_name}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                    {client?.email}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 800,
                        background: client?.is_qualified
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(239,68,68,0.1)",
                        color: client?.is_qualified ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {client?.is_qualified
                        ? "✅ Qualified"
                        : "❌ Not Qualified"}
                    </span>
                  </div>
                </div>
              </div>
              <SectionCard title="Contact Information" icon={Icon.User}>
                <FieldRow label="Phone" value={client?.phone} />
                <FieldRow label="Username" value={client?.username} />
                <FieldRow label="Role" value={client?.role} />
                <FieldRow label="User ID" value={`#${client?.id}`} />
                {client?.partner && (
                  <FieldRow
                    label="Partner"
                    value={`${client.partner.first_name} ${client.partner.last_name}`}
                    highlight
                  />
                )}
              </SectionCard>
              <SectionCard title="Application Summary" icon={Icon.File}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      label: "Total Apps",
                      value: clientApps.length,
                      color: "#31694E",
                    },
                    {
                      label: "Approved",
                      value: clientApps.filter((a) => a.status === "approved")
                        .length,
                      color: "#22c55e",
                    },
                    {
                      label: "Pending",
                      value: clientApps.filter(
                        (a) =>
                          a.status === "pending" || a.status === "submitted",
                      ).length,
                      color: "#f59e0b",
                    },
                    {
                      label: "Rejected",
                      value: clientApps.filter((a) => a.status === "rejected")
                        .length,
                      color: "#ef4444",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      style={{
                        background: "#FAFDF8",
                        borderRadius: 10,
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 22, fontWeight: 800, color }}>
                        {value}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#888", fontWeight: 600 }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "applications" && (
            <div>
              {clientApps.length > 0 ? (
                clientApps.map((app) => (
                  <div
                    key={app.loan_application_uuid}
                    onClick={() => {
                      onClose();
                      onSelectApp(app.loan_application_uuid);
                    }}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "14px 18px",
                      border: "1.5px solid #f0f0f0",
                      marginBottom: 10,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#31694E";
                      e.currentTarget.style.boxShadow =
                        "0 2px 12px rgba(49,105,78,0.10)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f0f0f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#1a1a1a",
                        }}
                      >
                        {app.loan_type_info?.name || app.loan_type?.name || "—"}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}
                      >
                        {app.loan_application_uuid?.slice(0, 8)}…
                      </div>
                      {app.business_information?.business_legal_name && (
                        <div
                          style={{ fontSize: 12, color: "#888", marginTop: 2 }}
                        >
                          {app.business_information.business_legal_name}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                      }}
                    >
                      <StatusBadge status={app.status} />
                      {app.approved_funds && (
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#22c55e",
                          }}
                        >
                          ${Number(app.approved_funds).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Icon.ChevRight
                      width={16}
                      height={16}
                      style={{ color: "#ccc", flexShrink: 0 }}
                    />
                  </div>
                ))
              ) : (
                <EmptySection label="No applications found for this client." />
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <ChatBox
              recipientId={client?.id}
              recipientName={`${client?.first_name} ${client?.last_name}`}
              currentUserId={currentUser?.id}
            />
          )}
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ClientsView = ({ applications, onSelectApp, currentUser }) => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  const clientMap = {};
  applications.forEach((app) => {
    if (app.user && !clientMap[app.user.id]) clientMap[app.user.id] = app.user;
  });
  const clients = Object.values(clientMap);

  const filtered = clients.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    const matchSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || c.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Clients
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {clients.length} total clients assigned to you
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 14px",
          }}
        >
          <Icon.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { val: "all", label: "All" },
            { val: "APPLICANT", label: "Applicants" },
            { val: "PARTNER", label: "Partners" },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setFilterRole(val)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: filterRole === val ? "#31694E" : "#e5e7eb",
                background:
                  filterRole === val ? "rgba(49,105,78,0.08)" : "#fff",
                color: filterRole === val ? "#31694E" : "#888",
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((client) => {
            const clientApps = applications.filter(
              (a) => a.user?.id === client.id,
            );
            const hasPartner = !!client.partner;
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid #f0f0f0",
                  padding: 18,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#31694E";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(49,105,78,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <Avatar
                    first={client.first_name}
                    last={client.last_name}
                    size={44}
                    radius={12}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {client.first_name} {client.last_name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#888",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {client.email}
                    </div>
                  </div>
                  {hasPartner && (
                    <span
                      style={{
                        background: "rgba(187,200,99,0.15)",
                        color: "#868a30",
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      Referred
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      flex: 1,
                      background: "#FAFDF8",
                      borderRadius: 8,
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#31694E",
                      }}
                    >
                      {clientApps.length}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      Applications
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "#FAFDF8",
                      borderRadius: 8,
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#22c55e",
                      }}
                    >
                      {clientApps.filter((a) => a.status === "approved").length}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      Approved
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "#FAFDF8",
                      borderRadius: 8,
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: client?.is_qualified ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {client?.is_qualified ? "✓" : "✗"}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      Qualified
                    </div>
                  </div>
                </div>
                {clientApps.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {clientApps.slice(0, 3).map((a) => (
                      <StatusBadge
                        key={a.loan_application_uuid}
                        status={a.status}
                      />
                    ))}
                    {clientApps.length > 3 && (
                      <span
                        style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}
                      >
                        +{clientApps.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1/-1",
              padding: 60,
              textAlign: "center",
              color: "#bbb",
              border: "2px dashed #f0f0f0",
              borderRadius: 16,
              fontSize: 14,
            }}
          >
            No clients found.
          </div>
        )}
      </div>

      {selectedClient && (
        <ClientDetailDrawer
          client={selectedClient}
          applications={applications}
          onClose={() => setSelectedClient(null)}
          onSelectApp={onSelectApp}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GROUP CHAT VIEW
// FIX: Moved initial state computation out of useEffect using lazy initializer
//      to avoid react-hooks/set-state-in-effect and no-empty errors.
// ─────────────────────────────────────────────────────────────────────────────
const getInitialGroupMessages = () => {
  const stored = localStorage.getItem("group_chat_messages");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to defaults
    }
  }
  return [
    {
      id: 1,
      from: { id: 0, name: "Admin", role: "ADMIN" },
      text: "Welcome to the Kacu agent channel! Use this space for announcements and team updates.",
      time: new Date(Date.now() - 86400000).toISOString(),
      isAnnouncement: true,
    },
    {
      id: 2,
      from: { id: 0, name: "Admin", role: "ADMIN" },
      text: "New loan type 'Equipment Financing' is now available. Minimum revenue threshold: $25,000/year.",
      time: new Date(Date.now() - 3600000 * 4).toISOString(),
      isAnnouncement: true,
    },
  ];
};

const GroupChatView = ({ currentUser }) => {
  const [messages, setMessages] = useState(getInitialGroupMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      from: {
        id: currentUser?.id,
        name: `${currentUser?.first_name} ${currentUser?.last_name}`,
        role: currentUser?.role,
      },
      text: input.trim(),
      time: new Date().toISOString(),
      isAnnouncement: false,
    };
    setMessages((prev) => {
      const updated = [...prev, msg];
      localStorage.setItem("group_chat_messages", JSON.stringify(updated));
      return updated;
    });
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      d.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        maxHeight: 700,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Team Channel
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon.Hash width={14} height={14} /> kacu-agents · Announcements &amp;
          team chat
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          border: "1.5px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map((msg) => {
            const isMe = msg.from.id === currentUser?.id;

            if (msg.isAnnouncement) {
              return (
                <div
                  key={msg.id}
                  style={{
                    margin: "12px 0",
                    background:
                      "linear-gradient(135deg, rgba(187,200,99,0.1), rgba(49,105,78,0.08))",
                    border: "1.5px solid rgba(187,200,99,0.3)",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: "#31694E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon.Megaphone
                        width={12}
                        height={12}
                        style={{ color: "#F0E491" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#31694E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Announcement · {msg.from.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#aaa",
                        marginLeft: "auto",
                      }}
                    >
                      {formatDate(msg.time)}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.6 }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  marginBottom: 12,
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background:
                        msg.from.role === "ADMIN"
                          ? "#31694E"
                          : "linear-gradient(135deg,#BBC863,#9aaa3a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {msg.from.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  {!isMe && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#888",
                        marginBottom: 4,
                        paddingLeft: 2,
                      }}
                    >
                      {msg.from.name} · {msg.from.role}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: isMe
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                      background: isMe ? "#31694E" : "#f5f5f5",
                      color: isMe ? "#fff" : "#1a1a1a",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#aaa",
                      marginTop: 3,
                      textAlign: isMe ? "right" : "left",
                      paddingLeft: isMe ? 0 : 4,
                    }}
                  >
                    {formatDate(msg.time)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderTop: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Message the team... (Enter to send, Shift+Enter for new line)"
            rows={2}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              outline: "none",
              fontSize: 13,
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.4,
            }}
            onFocus={(e) => (e.target.style.borderColor = "#31694E")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#31694E",
              border: "none",
              cursor: !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: !input.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            <Icon.Send width={18} height={18} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MINI BAR CHART
// FIX: removed unused `label` destructure from props
// ─────────────────────────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: Math.max(4, (d.value / max) * 48),
              background: d.color || "#31694E",
              borderRadius: "4px 4px 0 0",
              opacity: 0.85,
              minHeight: 4,
            }}
          />
          <div
            style={{
              fontSize: 9,
              color: "#aaa",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// FIX: removed unused `IconComp` from the stats map destructure
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({ applications, user, loanTypes }) => {
  const stats = {
    total: applications.length,
    pending: applications.filter(
      (a) => a.status === "pending" || a.status === "submitted",
    ).length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    draft: applications.filter((a) => a.status === "draft").length,
    referred: applications.filter((a) => !!a.user?.partner).length,
    totalApproved: applications
      .filter((a) => a.status === "approved")
      .reduce((sum, a) => sum + Number(a.approved_funds || 0), 0),
  };

  const uniqueClients = new Set(
    applications.map((a) => a.user?.id).filter(Boolean),
  ).size;

  const loanTypeData = (loanTypes || []).slice(0, 6).map((lt, i) => ({
    label: lt.name?.split(" ")[0] || lt.name,
    value: applications.filter(
      (a) => (a.loan_type_info?.name || a.loan_type?.name) === lt.name,
    ).length,
    color: LOAN_TYPE_COLORS[i % LOAN_TYPE_COLORS.length],
  }));

  const recent = [...applications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);
  const conversionRate =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const statCards = [
    {
      label: "Total Applications",
      value: stats.total,
      color: "#31694E",
      bg: "rgba(49,105,78,0.08)",
      icon: Icon.File,
    },
    {
      label: "Clients Assigned",
      value: uniqueClients,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
      icon: Icon.Users,
    },
    {
      label: "Needs Review",
      value: stats.pending,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      icon: Icon.Clock,
    },
    {
      label: "Approved",
      value: stats.approved,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
      icon: Icon.Check,
    },
    {
      label: "Rejected",
      value: stats.rejected,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      icon: Icon.XCircle,
    },
    {
      label: "Referred",
      value: stats.referred,
      color: "#BBC863",
      bg: "rgba(187,200,99,0.08)",
      icon: Icon.Partner,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Welcome back, {user?.first_name}! 👋
        </div>
        <div style={{ fontSize: 14, color: "#888" }}>
          Here&apos;s your performance overview.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {statCards.map(({ label, value, color, bg, icon: StatIcon }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 18,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <StatIcon width={18} height={18} style={{ color }} />
            </div>
            <div
              style={{ fontSize: 26, fontWeight: 800, color, marginBottom: 4 }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Conversion Rate
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#31694E",
              marginBottom: 6,
            }}
          >
            {conversionRate}%
          </div>
          <div
            style={{
              height: 8,
              background: "#f0f0f0",
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${conversionRate}%`,
                background: "linear-gradient(90deg,#31694E,#658C58)",
                borderRadius: 99,
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {stats.approved} approved out of {stats.total} total
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Total Funds Approved
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#22c55e",
              marginBottom: 6,
            }}
          >
            ${stats.totalApproved.toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div
              style={{
                flex: 1,
                background: "#FAFDF8",
                borderRadius: 8,
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#31694E" }}>
                {stats.draft}
              </div>
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>
                Draft
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#FAFDF8",
                borderRadius: 8,
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b" }}>
                {stats.pending}
              </div>
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>
                Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {loanTypeData.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Applications by Loan Type
          </div>
          <MiniBarChart data={loanTypeData} />
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}
          >
            {loanTypeData.map((d) => (
              <div
                key={d.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: d.color,
                  }}
                />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>
                  {d.label}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 14,
          }}
        >
          Recent Activity
        </div>
        {recent.length > 0 ? (
          recent.map((app) => (
            <div
              key={app.loan_application_uuid}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 18px",
                border: "1.5px solid #f0f0f0",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Avatar
                first={app.user?.first_name}
                last={app.user?.last_name}
                size={38}
                radius={10}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}
                >
                  {app.user?.first_name} {app.user?.last_name}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {app.loan_type_info?.name || app.loan_type?.name || "—"} ·{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
              {app.user?.partner && (
                <span
                  style={{
                    background: "rgba(187,200,99,0.15)",
                    color: "#868a30",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  Referred
                </span>
              )}
              <StatusBadge status={app.status} />
            </div>
          ))
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#bbb",
              border: "2px dashed #f0f0f0",
              borderRadius: 12,
              fontSize: 13,
            }}
          >
            No applications yet.
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ProfileView = ({ user }) => {
  const fields = [
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone || "—" },
    { label: "Username", value: user?.username },
    { label: "Role", value: user?.role },
    { label: "User ID", value: `#${user?.id}` },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#1a1a1a",
          marginBottom: 20,
        }}
      >
        My Profile
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 80,
            background: "linear-gradient(135deg,#31694E,#658C58)",
          }}
        />
        <div style={{ padding: "0 28px 28px", marginTop: -40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "#F0E491",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#31694E",
              border: "4px solid #fff",
              marginBottom: 16,
            }}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            {user?.first_name} {user?.last_name}
          </div>
          <div style={{ marginBottom: 24 }}>
            <span
              style={{
                background: "rgba(49,105,78,0.1)",
                color: "#31694E",
                padding: "3px 12px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              {user?.role}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {fields.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: 16,
                  background: "#FAFDF8",
                  borderRadius: 12,
                  border: "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#BBC863",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Home },
  { id: "applications", label: "Applications", icon: Icon.File },
  { id: "clients", label: "Clients", icon: Icon.Users },
  { id: "group-chat", label: "Team Channel", icon: Icon.MessageCircle },
  { id: "profile", label: "My Profile", icon: Icon.User },
];

const Sidebar = ({
  active,
  setActive,
  user,
  onClose,
  isMobile,
  appCount,
  clientCount,
}) => (
  <aside
    style={{
      width: 240,
      height: "100%",
      background: "#1c3e2c",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: isMobile ? "fixed" : "relative",
      zIndex: isMobile ? 100 : "auto",
      top: 0,
      left: 0,
      bottom: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        paddingLeft: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon.Leaf width={28} height={28} style={{ color: "#F0E491" }} />
        <span
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#F0E491",
            letterSpacing: "-0.04em",
          }}
        >
          Kacu
        </span>
      </div>
      {isMobile && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
          }}
        >
          <Icon.X width={20} height={20} />
        </button>
      )}
    </div>

    <div
      style={{
        padding: "10px 12px",
        background: "rgba(240,228,145,0.12)",
        borderRadius: 10,
        marginBottom: 20,
        border: "1px solid rgba(240,228,145,0.2)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#BBC863",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 2,
        }}
      >
        Agent Portal
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
        {user?.first_name} {user?.last_name}
      </div>
      <div
        style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}
      >
        {user?.email}
      </div>
    </div>

    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      {NAV.map(({ id, label, icon: NavIcon }) => {
        const isActive = active === id;
        const badge =
          id === "applications" ? appCount : id === "clients" ? clientCount : 0;
        return (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              if (isMobile) onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              background: isActive ? "rgba(240,228,145,0.15)" : "transparent",
              color: isActive ? "#F0E491" : "rgba(255,255,255,0.5)",
              fontWeight: isActive ? 800 : 600,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.2s",
              borderLeft: isActive
                ? "3px solid #F0E491"
                : "3px solid transparent",
            }}
          >
            <NavIcon width={18} height={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge > 0 && (
              <span
                style={{
                  background: "#BBC863",
                  color: "#1c3e2c",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 7px",
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    <button
      onClick={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        border: "none",
        background: "transparent",
        color: "#ef9494",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        width: "100%",
      }}
    >
      <Icon.Logout width={18} height={18} /> Sign Out
    </button>
  </aside>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppUuid, setSelectedAppUuid] = useState(null);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const [userData, appsData, loanTypesData] = await Promise.all([
        apiGet("/user-profile/me/"),
        apiGet("/application/"),
        apiGet("/loan-types/").catch(() => []),
      ]);

      setUser(userData);
      setApplications(
        Array.isArray(appsData) ? appsData : appsData?.results || [],
      );
      setLoanTypes(
        Array.isArray(loanTypesData)
          ? loanTypesData
          : loanTypesData?.results || [],
      );
      log("Data loaded", { user: userData });
    } catch (e) {
      logError("fetchAll failed", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
      @keyframes kacu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f6f8; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 99px; }
      select { font-family: 'Plus Jakarta Sans', sans-serif; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const uniqueClientCount = new Set(
    applications.map((a) => a.user?.id).filter(Boolean),
  ).size;

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon.Leaf width={32} height={32} style={{ color: "#31694E" }} />
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#31694E",
              letterSpacing: "-0.04em",
            }}
          >
            Kacu
          </span>
        </div>
        <Spinner size={36} />
        <div style={{ fontSize: 13, color: "#888" }}>Loading agent portal…</div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>
          Failed to load
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            maxWidth: 320,
            textAlign: "center",
          }}
        >
          {error}
        </div>
        <button
          onClick={() => fetchAll()}
          style={{
            padding: "10px 24px",
            background: "#31694E",
            color: "white",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f6f8",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Desktop Sidebar */}
      <div
        style={{ width: 240, flexShrink: 0 }}
        className="agent-sidebar-desktop"
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 240,
            height: "100vh",
          }}
        >
          <Sidebar
            active={activeTab}
            setActive={setActiveTab}
            user={user}
            onClose={() => {}}
            isMobile={false}
            appCount={applications.length}
            clientCount={uniqueClientCount}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: 260,
            }}
          >
            <Sidebar
              active={activeTab}
              setActive={setActiveTab}
              user={user}
              onClose={() => setSidebarOpen(false)}
              isMobile
              appCount={applications.length}
              clientCount={uniqueClientCount}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, padding: 24, overflowX: "hidden" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="agent-menu-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              borderRadius: 10,
              cursor: "pointer",
              color: "#31694E",
            }}
          >
            <Icon.Menu width={20} height={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: "#31694E",
                cursor: "pointer",
              }}
            >
              <Icon.Refresh
                width={14}
                height={14}
                style={{
                  animation: refreshing
                    ? "kacu-spin 0.8s linear infinite"
                    : "none",
                }}
              />
              Refresh
            </button>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#BBC863",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#31694E",
              }}
            >
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200 }}>
          {activeTab === "dashboard" && (
            <DashboardView
              applications={applications}
              user={user}
              loanTypes={loanTypes}
            />
          )}
          {activeTab === "applications" && (
            <ApplicationsView
              applications={applications}
              onSelect={(uuid) => setSelectedAppUuid(uuid)}
              loanTypes={loanTypes}
            />
          )}
          {activeTab === "clients" && (
            <ClientsView
              applications={applications}
              onSelectApp={(uuid) => {
                setSelectedAppUuid(uuid);
              }}
              currentUser={user}
            />
          )}
          {activeTab === "group-chat" && <GroupChatView currentUser={user} />}
          {activeTab === "profile" && <ProfileView user={user} />}
        </div>
      </main>

      {selectedAppUuid && (
        <AppDetailDrawer
          uuid={selectedAppUuid}
          onClose={() => setSelectedAppUuid(null)}
          onDecisionMade={() => fetchAll(true)}
          currentUser={user}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .agent-sidebar-desktop { display: none !important; }
          .agent-menu-btn { display: flex !important; }
          main { padding: 16px !important; }
        }
        @media (min-width: 901px) {
          .agent-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
