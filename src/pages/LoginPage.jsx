import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Zap,
} from "lucide-react";

const stats = [
  { value: "$500M+", label: "Funding Provided" },
  { value: "10k+", label: "Businesses Supported" },
  { value: "4 hrs", label: "Avg. Approval" },
  { value: "4.9/5", label: "Rating" },
];

const testimonials = [
  {
    quote:
      "Kacu funded us in under 6 hours. No paperwork nightmares, no credit-score lectures. Just capital.",
    name: "Marcus T.",
    role: "Restaurant Owner, Chicago",
    avatar: "MT",
    color: "#BBC863",
  },
  {
    quote:
      "We went from application to funded in one afternoon. Kacu changed how I think about business finance.",
    name: "Priya S.",
    role: "E-commerce Founder, Austin",
    avatar: "PS",
    color: "#F0E491",
  },
  {
    quote:
      "The team actually picked up the phone. In the fintech world, that alone is worth everything.",
    name: "Derek W.",
    role: "Logistics Company, Toronto",
    avatar: "DW",
    color: "#88B49F",
  },
];

const features = [
  { icon: Zap, text: "Pre-qualify in minutes — no hard credit pull" },
  { icon: Clock, text: "Funds available in as little as 4 hours" },
  { icon: TrendingUp, text: "Rates starting as low as 6.99%" },
];

const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);
  const t = testimonials[idx];
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={9}
                style={{ fill: "#BBC863", color: "#BBC863" }}
              />
            ))}
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: 11,
              lineHeight: 1.5,
              marginBottom: 8,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            "{t.quote}"
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: t.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#31694E",
                fontSize: 8,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {t.avatar}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>
                {t.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>
                {t.role}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 8,
        }}
      >
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: i === idx ? 18 : 6,
              height: 5,
              background: i === idx ? "#BBC863" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/applicant/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user || data.username)
          localStorage.setItem(
            "user",
            JSON.stringify(data.user || { username: data.username }),
          );
        if (data.role === "AGENT" || data.user?.role === "AGENT")
          window.location.href = "/agentdashboard";
        else if (data.role === "ADMIN" || data.user?.role === "ADMIN")
          window.location.href = "/admindashboard";
        else window.location.href = "/clientdashboard";
      } else {
        setError(
          data.message || data.detail || "Invalid username or password.",
        );
      }
    } catch {
      setError("Connection failed. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#F6F7F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .kacu-input {
          width: 100%; padding: 10px 10px 10px 38px;
          background: #F0F2EC; border: 1.5px solid transparent; border-radius: 10px;
          outline: none; transition: all 0.2s; color: #1C3D2B;
          font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .kacu-input:focus { background: #fff; border-color: #BBC863; box-shadow: 0 0 0 3px rgba(187,200,99,0.15); }
        .kacu-input::placeholder { color: #9CAE9A; }

        .login-btn {
          width: 100%; padding: 11px; background: #31694E; color: #F0E491; border: none;
          border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 900;
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; box-shadow: 0 6px 18px rgba(49,105,78,0.25);
        }
        .login-btn:hover:not(:disabled) { background: #265540; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .social-btn {
          flex: 1; padding: 9px; background: #fff; border: 1.5px solid #E8EBE3;
          border-radius: 9px; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 6px; font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 12px; color: #31694E; transition: all 0.2s;
        }
        .social-btn:hover { background: #F6F7F2; border-color: #C8D4BF; }

        .login-wrapper {
          width: 100%; max-width: 1020px; background: #fff;
          display: flex; flex-direction: column; overflow: hidden; min-height: 100vh;
        }
        @media (min-width: 1024px) {
          .login-wrapper {
            flex-direction: row; min-height: auto; max-height: 520px;
            border-radius: 24px;
            box-shadow: 0 28px 56px rgba(49,105,78,0.12), 0 4px 12px rgba(0,0,0,0.06);
            margin: 24px;
          }
        }

        .form-panel {
          width: 100%; padding: 32px 24px; display: flex; flex-direction: column;
          justify-content: center; background: #fff; position: relative; z-index: 1;
        }
        @media (min-width: 1024px) { .form-panel { width: 44%; padding: 32px 40px; } }

        .right-panel { display: none; }
        @media (min-width: 1024px) {
          .right-panel {
            display: flex; width: 56%; background: #31694E;
            flex-direction: column; justify-content: center;
            padding: 32px 36px; position: relative; overflow: hidden;
          }
        }

        .mobile-trust { display: flex; background: #31694E; padding: 20px; flex-wrap: wrap; }
        @media (min-width: 1024px) { .mobile-trust { display: none; } }

        .stat-item {
          width: 50%; padding: 12px 8px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .stat-item:nth-child(2n) { border-right: none; }
        .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; }

        .divider-line { width: 100%; height: 1px; background: #E8EBE3; position: relative; }
        .divider-label {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: #fff; padding: 0 10px; font-size: 9px; font-weight: 900;
          color: #C0C8B8; text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap;
        }
        .error-box {
          padding: 9px 12px; background: #FEF2F2; border-left: 3px solid #EF4444;
          border-radius: 0 8px 8px 0; color: #B91C1C; font-size: 11px;
          font-weight: 700; margin-bottom: 12px;
        }
        .dot-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 22px 22px; pointer-events: none;
        }
        .blob1 {
          position: absolute; top: -60px; right: -60px; width: 220px; height: 220px;
          background: rgba(187,200,99,0.12); border-radius: 50%; filter: blur(50px); pointer-events: none;
        }
        .blob2 {
          position: absolute; bottom: -50px; left: -50px; width: 180px; height: 180px;
          background: rgba(240,228,145,0.08); border-radius: 50%; filter: blur(40px); pointer-events: none;
        }
      `}</style>

      {/* bg blobs */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          background: "rgba(49,105,78,0.07)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          background: "rgba(187,200,99,0.07)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ===== LEFT: FORM ===== */}
        <div className="form-panel">
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 22,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "#31694E",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F0E491",
                fontFamily: "'Playfair Display',serif",
                fontWeight: 900,
                fontSize: 15,
              }}
            >
              K
            </div>
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 900,
                fontSize: 17,
                color: "#31694E",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Kacu
            </span>
          </div>

          <p
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: "#BBC863",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Welcome Back
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(20px, 2.5vw, 26px)",
              fontWeight: 900,
              color: "#1C3D2B",
              lineHeight: 1.15,
              marginBottom: 4,
            }}
          >
            Your Capital.
            <br />
            On Your Terms.
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "#658C58",
              fontWeight: 500,
              marginBottom: 18,
              lineHeight: 1.5,
            }}
          >
            Eco-friendly funding solutions for modern entrepreneurs.
          </p>

          {error && <div className="error-box">{error}</div>}

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 9,
                  fontWeight: 900,
                  color: "rgba(49,105,78,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={13}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#658C58",
                  }}
                />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Your username"
                  autoComplete="username"
                  className="kacu-input"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <label
                  style={{
                    fontSize: 9,
                    fontWeight: 900,
                    color: "rgba(49,105,78,0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#658C58",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={13}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#658C58",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="kacu-input"
                  style={{ paddingRight: 40 }}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CAE9A",
                    display: "flex",
                    padding: 3,
                  }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? "Verifying..." : "Login to Kacu"}
              {!isLoading && <ArrowRight size={13} />}
            </button>
          </form>

          <div style={{ marginTop: 14 }}>
            <div className="divider-line" style={{ marginBottom: 12 }}>
              <span className="divider-label">Or continue with</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="social-btn">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  style={{ width: 13, height: 13 }}
                  alt="G"
                />
                Google
              </button>
              <button className="social-btn">
                <img
                  src="https://www.svgrepo.com/show/442910/apple-logo.svg"
                  style={{ width: 13, height: 13 }}
                  alt="A"
                />
                Apple
              </button>
            </div>
          </div>

          <p
            style={{
              marginTop: 14,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "#9CAE9A",
            }}
          >
            New here?{" "}
            <a
              href="#"
              style={{
                color: "#31694E",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              Apply for funding →
            </a>
          </p>
        </div>

        {/* ===== MOBILE: TRUST STATS ===== */}
        <div className="mobile-trust">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#BBC863",
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT: DESKTOP PANEL ===== */}
        <div className="right-panel">
          <div className="dot-pattern" />
          <div className="blob1" />
          <div className="blob2" />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                background: "rgba(187,200,99,0.15)",
                border: "1px solid rgba(187,200,99,0.25)",
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#BBC863",
                }}
              />
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 900,
                  color: "#BBC863",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Kacu Financial • Est. 2025
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: 16 }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(22px, 2.2vw, 30px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.15,
                }}
              >
                The First Step
                <br />
                Toward <span style={{ color: "#BBC863" }}>Natural Growth.</span>
              </h2>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 6px",
                    textAlign: "center",
                    borderRight:
                      i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: 15,
                      fontWeight: 900,
                      color: "#BBC863",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginBottom: 14 }}
            >
              {features.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 9,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      background: "rgba(187,200,99,0.15)",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={12} color="#BBC863" />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.4,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Testimonial Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 7,
                }}
              >
                What our clients say
              </div>
              <TestimonialCarousel />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
