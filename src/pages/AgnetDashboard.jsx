import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ESLint fix: prefix unused-but-kept debug helpers with _ or consolidate
const logError = (label, err) =>
  console.error(
    `%c[AGENT ERROR] ${label}`,
    "color:#e53935;font-weight:bold;",
    err,
  );

const getToken = () => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("kacu_auth_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

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
  if (handle401(res)) return null;
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
  if (handle401(res)) return null;
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

const normaliseStatus = (s) => (s || "").toLowerCase();

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

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS — reusable mobile detection
// ─────────────────────────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

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
  Mail: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.02-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  ExternalLink: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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
  const s = normaliseStatus(status);
  const meta = STATUS_META[s] || STATUS_META.draft;
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
        whiteSpace: "nowrap",
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
      gap: 8,
    }}
  >
    <span
      style={{
        fontSize: 12,
        color: "#888",
        fontWeight: 600,
        minWidth: 120,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: highlight ? "#31694E" : "#1a1a1a",
        textAlign: "right",
        wordBreak: "break-word",
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
      setError("Partner commission is required.");
      return;
    }
    if (decision === "rejected" && !rejectionReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { status: decision };
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "20px 20px",
            background: "#FAFDF8",
            borderBottom: "1.5px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#31694E" }}>
              Make a Decision
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {app?.user?.first_name} {app?.user?.last_name} ·{" "}
              {app?.loan_type_info?.name || "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#fef2f2",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon.X width={16} height={16} />
          </button>
        </div>
        <div style={{ padding: "20px" }}>
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
                  fontFamily: "inherit",
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
            padding: "16px 20px",
            borderTop: "1.5px solid #f0f0f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
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
              padding: "10px 24px",
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
                ? "Approve"
                : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
const AppDetailDrawer = ({ uuid, onClose, onDecisionMade }) => {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDecision, setShowDecision] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!uuid) return;
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

  const normStatus = normaliseStatus(app?.status);
  const canDecide = normStatus === "submitted" || normStatus === "pending";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "business", label: "Business" },
    { id: "funding", label: "Funding" },
    { id: "owner", label: "Owner" },
    { id: "documents", label: "Docs" },
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
            padding: "16px 16px",
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
            <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
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
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {app.user?.first_name} {app.user?.last_name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#888",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {app.loan_type_info?.name || "—"} ·{" "}
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
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
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
                marginTop: 12,
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

        {/* Tabs — scrollable on mobile */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1.5px solid #f0f0f0",
            flexShrink: 0,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "12px 14px",
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
                flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
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
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      {
                        label: "Loan Type",
                        value: app.loan_type_info?.name || "—",
                      },
                      {
                        label: "Status",
                        value: <StatusBadge status={app.status} />,
                      },
                      {
                        label: "Submitted",
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
                          padding: "12px",
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
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {app.user?.partner && (
                    <div
                      style={{
                        background: "rgba(187,200,99,0.08)",
                        border: "1.5px solid rgba(187,200,99,0.3)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
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
                      <div style={{ flex: 1, minWidth: 0 }}>
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
                        <div style={{ textAlign: "right" }}>
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

                  {normaliseStatus(app.status) === "rejected" &&
                    app.rejection_reason && (
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
                          style={{
                            fontSize: 13,
                            color: "#666",
                            lineHeight: 1.6,
                          }}
                        >
                          {app.rejection_reason}
                        </div>
                      </div>
                    )}
                  {normaliseStatus(app.status) === "approved" && (
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
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                            minWidth: 0,
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
                              flexShrink: 0,
                            }}
                          >
                            <Icon.File
                              width={16}
                              height={16}
                              style={{ color: "#31694E" }}
                            />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1a1a1a",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
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
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              flexShrink: 0,
                            }}
                          >
                            <Icon.ExternalLink width={12} height={12} /> View
                          </a>
                        )}
                      </div>
                    ))}
                  </SectionCard>
                ) : (
                  <EmptySection label="No documents uploaded yet." />
                ))}
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
// APPLICATION ROW — mobile-responsive card/row layout
// ─────────────────────────────────────────────────────────────────────────────
const AppRow = ({ app, onClick, isMobile }) => {
  const stepIdx = STEPS_ORDER.indexOf(
    app.current_step ?? "business_information",
  );
  const progress =
    app.completion_percentage ??
    Math.round(((stepIdx + 1) / STEPS_ORDER.length) * 100);

  if (isMobile) {
    // Mobile: card layout
    return (
      <div
        onClick={onClick}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "14px 16px",
          border: "1.5px solid #f0f0f0",
          cursor: "pointer",
          marginBottom: 10,
          activeOpacity: 0.7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <Avatar
            first={app.user?.first_name}
            last={app.user?.last_name}
            size={40}
            radius={10}
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
          <StatusBadge status={app.status} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: "#31694E" }}>
              {app.loan_type_info?.name || "—"}
            </div>
            {app.business_information?.business_legal_name && (
              <div style={{ fontSize: 11, color: "#aaa" }}>
                {app.business_information.business_legal_name}
              </div>
            )}
          </div>
          {app.user?.partner ? (
            <span
              style={{
                background: "rgba(187,200,99,0.15)",
                color: "#868a30",
                padding: "3px 8px",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              Referred
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              flex: 1,
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
          <span
            style={{
              fontSize: 10,
              color: "#888",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
    );
  }

  // Desktop: row layout
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "14px 20px",
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
          {app.loan_type_info?.name || "—"}
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
const ApplicationsView = ({ onSelect, loanTypes }) => {
  const isMobile = useIsMobile();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoanType, setFilterLoanType] = useState("all");
  const [filterPartner, setFilterPartner] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [showFilters, setShowFilters] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const query = debouncedSearch
          ? `?search=${encodeURIComponent(debouncedSearch)}`
          : "";
        const data = await apiGet(`/application/${query}`);
        setApps(Array.isArray(data) ? data : data?.results || []);
      } catch (e) {
        logError("Applications fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [debouncedSearch]);

  const filtered = apps
    .filter((app) => {
      const matchStatus =
        filterStatus === "all" || normaliseStatus(app.status) === filterStatus;
      const appLoanType = app.loan_type_info?.name || "";
      const matchLoanType =
        filterLoanType === "all" || appLoanType === filterLoanType;
      const matchPartner =
        filterPartner === "all" ||
        (filterPartner === "referred"
          ? !!app.user?.partner
          : !app.user?.partner);
      return matchStatus && matchLoanType && matchPartner;
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
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          All Applications
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {apps.length} total · {filtered.length} shown
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "9px 14px",
          }}
        >
          <Icon.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, business..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
              minWidth: 0,
            }}
          />
          {loading && search && <Spinner size={14} />}
        </div>
        {!isMobile && (
          <div style={{ position: "relative" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "9px 36px 9px 14px",
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
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "9px 14px",
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
          {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
        </button>
      </div>

      {/* Mobile sort */}
      {isMobile && (
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 14px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            color: "#31694E",
            cursor: "pointer",
            outline: "none",
            marginBottom: 10,
          }}
        >
          <option value="created_desc">Newest First</option>
          <option value="created_asc">Oldest First</option>
          <option value="name_asc">Name A→Z</option>
          <option value="name_desc">Name Z→A</option>
          <option value="loan_type">By Loan Type</option>
          <option value="progress_desc">By Progress</option>
        </select>
      )}

      {showFilters && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #f0f0f0",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 14,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "100%" }}>
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
          <div style={{ width: "100%" }}>
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
              }}
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {loading && !search ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={32} />
        </div>
      ) : filtered.length > 0 ? (
        filtered.map((app) => (
          <AppRow
            key={app.loan_application_uuid}
            app={app}
            onClick={() => onSelect(app.loan_application_uuid)}
            isMobile={isMobile}
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
          {search
            ? `No applications found for "${search}".`
            : "No applications match your filters."}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
const ClientDetailDrawer = ({ clientId, onClose, onSelectApp }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiGet(`/agent/users/${clientId}/`);
        if (!cancelled) setClient(data);
      } catch (e) {
        logError("Client detail fetch failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const clientApps = client?.applications || [];

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
            padding: "16px 16px",
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
            <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
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
              {client && (
                <>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
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
                      fontSize: 12,
                      color: "#888",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {client.email}
                  </div>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {client && (
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
                  {client.role || "applicant"}
                </span>
              )}
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

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
          {loading && (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 40 }}
            >
              <Spinner size={32} />
            </div>
          )}
          {client && !loading && (
            <>
              {activeTab === "details" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <Avatar
                      first={client.first_name}
                      last={client.last_name}
                      size={60}
                      radius={16}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: "#1a1a1a",
                        }}
                      >
                        {client.first_name} {client.last_name}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#888", marginTop: 2 }}
                      >
                        {client.email}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: 99,
                            fontSize: 10,
                            fontWeight: 800,
                            background: client.is_qualified
                              ? "rgba(34,197,94,0.1)"
                              : "rgba(239,68,68,0.1)",
                            color: client.is_qualified ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {client.is_qualified
                            ? "✅ Qualified"
                            : "❌ Not Qualified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <SectionCard title="Contact Information" icon={Icon.User}>
                    <FieldRow label="Phone" value={client.phone} />
                    <FieldRow label="Username" value={client.username} />
                    <FieldRow label="Role" value={client.role} />
                    {client.partner_details && (
                      <FieldRow
                        label="Partner"
                        value={`${client.partner_details.first_name} ${client.partner_details.last_name}`}
                        highlight
                      />
                    )}
                    {client.assigned_agent_details && (
                      <FieldRow
                        label="Assigned Agent"
                        value={`${client.assigned_agent_details.first_name} ${client.assigned_agent_details.last_name}`}
                      />
                    )}
                  </SectionCard>
                  <SectionCard title="Application Summary" icon={Icon.File}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 10,
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
                          value: clientApps.filter(
                            (a) => normaliseStatus(a.status) === "approved",
                          ).length,
                          color: "#22c55e",
                        },
                        {
                          label: "Pending",
                          value: clientApps.filter((a) =>
                            ["pending", "submitted"].includes(
                              normaliseStatus(a.status),
                            ),
                          ).length,
                          color: "#f59e0b",
                        },
                        {
                          label: "Rejected",
                          value: clientApps.filter(
                            (a) => normaliseStatus(a.status) === "rejected",
                          ).length,
                          color: "#ef4444",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          style={{
                            background: "#FAFDF8",
                            borderRadius: 10,
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 20, fontWeight: 800, color }}>
                            {value}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#888",
                              fontWeight: 600,
                            }}
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
                          padding: "14px 16px",
                          border: "1.5px solid #f0f0f0",
                          marginBottom: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#1a1a1a",
                            }}
                          >
                            {app.loan_type_info?.name || "—"}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#aaa",
                              marginTop: 2,
                            }}
                          >
                            {app.loan_application_uuid?.slice(0, 8)}…
                          </div>
                          {app.business_information?.business_legal_name && (
                            <div
                              style={{
                                fontSize: 12,
                                color: "#888",
                                marginTop: 2,
                              }}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS VIEW
// ─────────────────────────────────────────────────────────────────────────────
const ClientsView = ({ onSelectApp }) => {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const query = debouncedSearch
          ? `?search=${encodeURIComponent(debouncedSearch)}`
          : "";
        const data = await apiGet(`/agent/users/${query}`);
        setClients(Array.isArray(data) ? data : data?.results || []);
      } catch (e) {
        logError("Clients fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [debouncedSearch]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Clients
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          {clients.length} clients assigned to you
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: "9px 14px",
          }}
        >
          <Icon.Search width={16} height={16} style={{ color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name or email..."
            style={{
              border: "none",
              outline: "none",
              fontSize: 13,
              background: "transparent",
              flex: 1,
              color: "#1a1a1a",
            }}
          />
          {loading && search && <Spinner size={14} />}
        </div>
      </div>

      {loading && !search ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid #f0f0f0",
                  padding: 16,
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
                    marginBottom: 12,
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
                  {client.partner && (
                    <span
                      style={{
                        background: "rgba(187,200,99,0.15)",
                        color: "#868a30",
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      Referred
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
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
                        fontSize: 14,
                        fontWeight: 800,
                        color: client.is_qualified ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {client.is_qualified ? "✓" : "✗"}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      Qualified
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
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#31694E",
                      }}
                    >
                      {client.reference_code || "—"}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#888", fontWeight: 600 }}
                    >
                      Ref Code
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    color: "#aaa",
                  }}
                >
                  <Icon.Mail width={12} height={12} style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {client.email}
                  </span>
                </div>
                {client.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      color: "#aaa",
                      marginTop: 4,
                    }}
                  >
                    <Icon.Phone
                      width={12}
                      height={12}
                      style={{ flexShrink: 0 }}
                    />{" "}
                    {client.phone}
                  </div>
                )}
              </div>
            ))
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
              {search
                ? `No clients found for "${search}".`
                : "No clients assigned to you."}
            </div>
          )}
        </div>
      )}

      {selectedClientId && (
        <ClientDetailDrawer
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
          onSelectApp={onSelectApp}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TEAM CHANNEL — mobile-friendly redesign
// ─────────────────────────────────────────────────────────────────────────────
const TeamChannelView = ({ currentUser }) => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [showChannelList, setShowChannelList] = useState(false);
  const bottomRef = useRef(null);

  const CHANNELS = [
    { id: "general", label: "# general", desc: "Team-wide updates" },
    { id: "applications", label: "# applications", desc: "Application alerts" },
    {
      id: "announcements",
      label: "📣 announcements",
      desc: "Admin announcements",
    },
  ];

  useEffect(() => {
    const seeds = {
      general: [
        {
          id: 1,
          from: { name: "Admin", role: "ADMIN" },
          text: "Welcome to the Kacu team channel! Use this space for coordination.",
          time: new Date(Date.now() - 86400000).toISOString(),
          pinned: true,
        },
        {
          id: 2,
          from: { name: "System", role: "SYSTEM" },
          text: "New loan type 'Equipment Financing' is now available. Minimum revenue threshold: $25,000/year.",
          time: new Date(Date.now() - 3600000 * 4).toISOString(),
          pinned: false,
        },
      ],
      applications: [
        {
          id: 1,
          from: { name: "System", role: "SYSTEM" },
          text: "Application alerts and updates will appear here.",
          time: new Date(Date.now() - 7200000).toISOString(),
          pinned: false,
        },
      ],
      announcements: [
        {
          id: 1,
          from: { name: "Admin", role: "ADMIN" },
          text: "Q2 performance reviews are due by end of month. Please submit your metrics.",
          time: new Date(Date.now() - 172800000).toISOString(),
          pinned: true,
        },
      ],
    };

    let next = seeds[activeChannel] || [];
    const stored = localStorage.getItem(`channel_${activeChannel}`);
    if (stored) {
      try {
        next = JSON.parse(stored);
      } catch {
        /* fall through */
      }
    }

    const id = setTimeout(() => setMessages(next), 0);
    return () => clearTimeout(id);
  }, [activeChannel]);

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
      pinned: false,
    };
    setMessages((prev) => {
      const updated = [...prev, msg];
      localStorage.setItem(`channel_${activeChannel}`, JSON.stringify(updated));
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

  const formatTime = (iso) => {
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

  const currentChannelInfo = CHANNELS.find((c) => c.id === activeChannel);

  return (
    <div
      style={{
        display: "flex",
        height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 120px)",
        maxHeight: isMobile ? "none" : 720,
        background: "#fff",
        borderRadius: isMobile ? 16 : 20,
        border: "1.5px solid #f0f0f0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Desktop Sidebar / Mobile Channel Sheet */}
      {!isMobile && (
        <div
          style={{
            width: 200,
            background: "#1c3e2c",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "20px 14px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 2,
              }}
            >
              Team
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#F0E491" }}>
              Kacu Agents
            </div>
          </div>
          <div style={{ padding: "10px 6px", flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                padding: "4px 10px",
                marginBottom: 4,
              }}
            >
              Channels
            </div>
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    activeChannel === ch.id
                      ? "rgba(240,228,145,0.15)"
                      : "transparent",
                  color:
                    activeChannel === ch.id
                      ? "#F0E491"
                      : "rgba(255,255,255,0.55)",
                  fontWeight: activeChannel === ch.id ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                  transition: "all 0.15s",
                }}
              >
                {ch.label}
              </button>
            ))}
          </div>
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                first={currentUser?.first_name}
                last={currentUser?.last_name}
                size={28}
                radius={8}
              />
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.2,
                  }}
                >
                  {currentUser?.first_name}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                  {currentUser?.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Channel Picker Overlay */}
      {isMobile && showChannelList && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#1c3e2c",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            padding: "20px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F0E491" }}>
              Channels
            </div>
            <button
              onClick={() => setShowChannelList(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              <Icon.X width={20} height={20} />
            </button>
          </div>
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannel(ch.id);
                setShowChannelList(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                background:
                  activeChannel === ch.id
                    ? "rgba(240,228,145,0.15)"
                    : "rgba(255,255,255,0.05)",
                color:
                  activeChannel === ch.id ? "#F0E491" : "rgba(255,255,255,0.7)",
                fontWeight: activeChannel === ch.id ? 700 : 500,
                fontSize: 15,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 8,
                width: "100%",
              }}
            >
              <div style={{ flex: 1 }}>{ch.label}</div>
              {activeChannel === ch.id && <Icon.Check width={16} height={16} />}
            </button>
          ))}
        </div>
      )}

      {/* Message Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Channel Header */}
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1.5px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#FAFDF8",
          }}
        >
          {isMobile && (
            <button
              onClick={() => setShowChannelList(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "#31694E",
              }}
            >
              <Icon.Hash width={18} height={18} />
            </button>
          )}
          {!isMobile && (
            <Icon.Hash width={16} height={16} style={{ color: "#31694E" }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#1a1a1a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentChannelInfo?.label.replace("# ", "").replace("📣 ", "")}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>
              {currentChannelInfo?.desc}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.map((msg, i) => {
            const isMe = msg.from?.id === currentUser?.id;
            const isSystem =
              msg.from?.role === "SYSTEM" || msg.from?.role === "ADMIN";
            const showAvatar =
              !isMe && (i === 0 || messages[i - 1]?.from?.id !== msg.from?.id);

            if (msg.pinned && isSystem) {
              return (
                <div
                  key={msg.id}
                  style={{
                    margin: "8px 0",
                    background:
                      "linear-gradient(135deg, rgba(187,200,99,0.1), rgba(49,105,78,0.06))",
                    border: "1px solid rgba(187,200,99,0.25)",
                    borderRadius: 12,
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: "#31694E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon.Megaphone
                        width={11}
                        height={11}
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
                      {msg.from?.name} · {formatTime(msg.time)}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(187,200,99,0.2)",
                        color: "#868a30",
                        padding: "1px 8px",
                        borderRadius: 99,
                        fontWeight: 700,
                      }}
                    >
                      Pinned
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
                  gap: 8,
                  padding: "3px 0",
                  alignItems: "flex-end",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      width: 28,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    {showAvatar ? (
                      <Avatar
                        first={msg.from?.name?.split(" ")[0]}
                        last={msg.from?.name?.split(" ")[1]}
                        size={28}
                        radius={8}
                        color={
                          msg.from?.role === "ADMIN" ? "#31694E" : undefined
                        }
                      />
                    ) : null}
                  </div>
                )}
                <div style={{ maxWidth: isMobile ? "82%" : "70%" }}>
                  {showAvatar && !isMe && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#888",
                        marginBottom: 3,
                        paddingLeft: 2,
                      }}
                    >
                      {msg.from?.name}{" "}
                      <span style={{ fontWeight: 500, color: "#bbb" }}>
                        · {msg.from?.role}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      padding: "9px 12px",
                      borderRadius: isMe
                        ? "16px 16px 4px 16px"
                        : "4px 16px 16px 16px",
                      background: isMe ? "#31694E" : "#f0f0f0",
                      color: isMe ? "#fff" : "#1a1a1a",
                      fontSize: 13,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#bbb",
                      marginTop: 3,
                      textAlign: isMe ? "right" : "left",
                      paddingLeft: isMe ? 0 : 2,
                    }}
                  >
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: "1.5px solid #f0f0f0",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              background: "#f5f6f8",
              borderRadius: 12,
              padding: "6px 6px 6px 12px",
              border: "1.5px solid #e5e7eb",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${currentChannelInfo?.label.replace("# ", "#").replace("📣 ", "")}…`}
              rows={1}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 14,
                resize: "none",
                fontFamily: "inherit",
                lineHeight: 1.5,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: input.trim() ? "#31694E" : "#e5e7eb",
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon.Send
                width={16}
                height={16}
                style={{ color: input.trim() ? "#F0E491" : "#aaa" }}
              />
            </button>
          </div>
          {!isMobile && (
            <div
              style={{
                fontSize: 10,
                color: "#aaa",
                marginTop: 4,
                paddingLeft: 2,
              }}
            >
              Enter to send · Shift+Enter for new line
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────
const DashboardView = ({ onSelectApp }) => {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await apiGet("/agent/dashboard/");
        setStats(data);
      } catch (e) {
        logError("Dashboard fetch failed", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spinner size={36} />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: 32,
          background: "#fef2f2",
          borderRadius: 16,
          color: "#ef4444",
          fontSize: 13,
        }}
      >
        {error}
      </div>
    );
  if (!stats) return null;

  const conversionRate = stats.conversion_rate_percent || 0;
  const recentApps = stats.recent_applications || [];

  const statCards = [
    {
      label: "Total Apps",
      value: stats.total_applications,
      color: "#31694E",
      bg: "rgba(49,105,78,0.08)",
      icon: Icon.File,
    },
    {
      label: "Clients",
      value: stats.clients_assigned,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
      icon: Icon.Users,
    },
    {
      label: "Needs Review",
      value: stats.needs_review,
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
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: isMobile ? 20 : 28,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          Dashboard Overview
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          Your performance at a glance.
        </div>
      </div>

      {/* Stat Cards — 3 col on mobile, 6 col on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: isMobile ? 8 : 14,
          marginBottom: 20,
        }}
      >
        {statCards.map(({ label, value, color, bg, icon: StatIcon }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: isMobile ? 12 : 16,
              padding: isMobile ? "12px 10px" : 18,
              border: "1.5px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: isMobile ? 30 : 38,
                height: isMobile ? 30 : 38,
                borderRadius: isMobile ? 8 : 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: isMobile ? 6 : 10,
              }}
            >
              <StatIcon
                width={isMobile ? 14 : 18}
                height={isMobile ? 14 : 18}
                style={{ color }}
              />
            </div>
            <div
              style={{
                fontSize: isMobile ? 20 : 26,
                fontWeight: 800,
                color,
                marginBottom: 2,
              }}
            >
              {value ?? 0}
            </div>
            <div
              style={{
                fontSize: isMobile ? 9 : 11,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                lineHeight: 1.3,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 10,
            }}
          >
            Conversion Rate
          </div>
          <div
            style={{
              fontSize: isMobile ? 30 : 36,
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
                width: `${Math.min(conversionRate, 100)}%`,
                background: "linear-gradient(90deg,#31694E,#658C58)",
                borderRadius: 99,
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {stats.approved} approved out of {stats.total_applications} total
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #f0f0f0",
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#BBC863",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 10,
            }}
          >
            Total Funds Approved
          </div>
          <div
            style={{
              fontSize: isMobile ? 22 : 28,
              fontWeight: 900,
              color: "#22c55e",
              marginBottom: 8,
            }}
          >
            ${Number(stats.total_funds_approved || 0).toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
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
                {stats.needs_review}
              </div>
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>
                Pending Review
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
              <div style={{ fontSize: 13, fontWeight: 800, color: "#BBC863" }}>
                {stats.referred}
              </div>
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>
                Referred
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: 12,
          }}
        >
          Recent Activity{" "}
          <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>
            (submitted / pending)
          </span>
        </div>
        {recentApps.length > 0 ? (
          recentApps.map((app) => (
            <div
              key={app.loan_application_uuid}
              onClick={() => onSelectApp(app.loan_application_uuid)}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "12px 14px",
                border: "1.5px solid #f0f0f0",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#31694E";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(49,105,78,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Avatar
                first={app.user?.first_name}
                last={app.user?.last_name}
                size={36}
                radius={10}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1a1a1a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {app.user?.first_name} {app.user?.last_name}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {app.loan_type_info?.name || "—"} ·{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
              {app.user?.partner && !isMobile && (
                <span
                  style={{
                    background: "rgba(187,200,99,0.15)",
                    color: "#868a30",
                    padding: "2px 8px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  Referred
                </span>
              )}
              <StatusBadge status={app.status} />
              <Icon.ChevRight
                width={14}
                height={14}
                style={{ color: "#ccc", flexShrink: 0 }}
              />
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
            No pending applications.
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
    { label: "Email Address", value: user?.email },
    { label: "Phone Number", value: user?.phone || "—" },
    { label: "Username", value: user?.username },
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
            background: "linear-gradient(135deg, #31694E 0%, #658C58 100%)",
          }}
        />
        <div style={{ padding: "0 24px 24px", marginTop: -40 }}>
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
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              marginBottom: 14,
            }}
          >
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 8,
            }}
          >
            {user?.first_name} {user?.last_name}
          </div>
          {user?.role && (
            <span
              style={{
                color: "#31694E",
                backgroundColor: "rgba(49, 105, 78, 0.1)",
                padding: "4px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                display: "inline-block",
                marginBottom: 24,
              }}
            >
              {user.role}
            </span>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {fields.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "14px",
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
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    wordBreak: "break-word",
                  }}
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
// BOTTOM NAV (mobile) + SIDEBAR (desktop)
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Home },
  { id: "applications", label: "Applications", icon: Icon.File },
  { id: "clients", label: "Clients", icon: Icon.Users },
  { id: "team-channel", label: "Team", icon: Icon.MessageCircle },
  { id: "profile", label: "Profile", icon: Icon.User },
];

const Sidebar = ({ active, setActive, user, onClose, isMobile }) => (
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
        marginBottom: 28,
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

// Mobile Bottom Navigation Bar
const BottomNav = ({ active, setActive }) => (
  <nav
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      background: "#fff",
      borderTop: "1.5px solid #f0f0f0",
      display: "flex",
      alignItems: "center",
      zIndex: 90,
      paddingBottom: "env(safe-area-inset-bottom)",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
    }}
  >
    {NAV.map(({ id, label, icon: NavIcon }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => setActive(id)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "8px 4px",
            color: isActive ? "#31694E" : "#aaa",
          }}
        >
          <NavIcon width={20} height={20} />
          <span
            style={{
              fontSize: 9,
              fontWeight: isActive ? 800 : 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {label === "Applications" ? "Apps" : label}
          </span>
          {isActive && (
            <div
              style={{
                position: "absolute",
                bottom: 58,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#31694E",
              }}
            />
          )}
        </button>
      );
    })}
  </nav>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppUuid, setSelectedAppUuid] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const userData = await apiGet("/user-profile/me/");
      setUser(userData);
    } catch (e) {
      logError("fetchUser failed", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "applications" && loanTypes.length === 0) {
      apiGet("/loan-types/")
        .then((data) => {
          if (data)
            setLoanTypes(Array.isArray(data) ? data : data?.results || []);
        })
        .catch(() => {});
    }
  }, [activeTab, loanTypes.length]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
      input, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }
      /* Prevent iOS zoom on input focus */
      @media (max-width: 768px) {
        input, textarea, select { font-size: 16px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
          padding: 24,
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
          onClick={() => fetchUser()}
          style={{
            padding: "10px 24px",
            background: "#31694E",
            color: "white",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
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
      {!isMobile && (
        <div style={{ width: 240, flexShrink: 0 }}>
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
            />
          </div>
        </div>
      )}

      {/* Mobile Sidebar (slide-in) */}
      {isMobile && sidebarOpen && (
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
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px 14px" : "24px",
          overflowX: "hidden",
          // On mobile, add bottom padding for the bottom nav bar
          paddingBottom: isMobile ? 80 : 24,
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Leaf width={22} height={22} style={{ color: "#31694E" }} />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#31694E",
                  letterSpacing: "-0.04em",
                }}
              >
                Kacu
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar
                first={user?.first_name}
                last={user?.last_name}
                size={34}
                radius={10}
              />
            </div>
          </div>
        )}

        <div style={{ maxWidth: 1200 }}>
          {activeTab === "dashboard" && (
            <DashboardView onSelectApp={(uuid) => setSelectedAppUuid(uuid)} />
          )}
          {activeTab === "applications" && (
            <ApplicationsView
              onSelect={(uuid) => setSelectedAppUuid(uuid)}
              loanTypes={loanTypes}
            />
          )}
          {activeTab === "clients" && (
            <ClientsView onSelectApp={(uuid) => setSelectedAppUuid(uuid)} />
          )}
          {activeTab === "team-channel" && (
            <TeamChannelView currentUser={user} />
          )}
          {activeTab === "profile" && <ProfileView user={user} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav active={activeTab} setActive={setActiveTab} />}

      {selectedAppUuid && (
        <AppDetailDrawer
          uuid={selectedAppUuid}
          onClose={() => setSelectedAppUuid(null)}
          onDecisionMade={() => {
            /* dashboard re-fetches on next visit */
          }}
        />
      )}
    </div>
  );
}
