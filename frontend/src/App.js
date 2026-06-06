import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";

/* ─── Shared tokens ─────────────────────────────────────────── */
const ACCENT = "#7c4dff";
const ACCENT_DIM = "rgba(124,77,255,0.18)";
const SURFACE = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const FONT = "'Syne', sans-serif";

/* ─── Nav ────────────────────────────────────────────────────── */
const navStyle = {
  position: "sticky", top: 0, zIndex: 100,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "20px 28px",
  background: "rgba(10,10,15,0.85)",
  backdropFilter: "blur(16px)",
  borderBottom: `0.5px solid ${BORDER}`,
};

const navLinkStyle = (active) => ({
  padding: "8px 20px", borderRadius: "50px",
  fontSize: "14px", fontWeight: 700, cursor: "pointer",
  display: "flex", alignItems: "center", gap: "6px",
  color: active ? "#fff" : "rgba(255,255,255,0.5)",
  background: active ? "rgba(124,77,255,0.85)" : "transparent",
  border: "none", fontFamily: FONT,
  transition: "all 0.2s ease",
});

function NavBar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav style={navStyle}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#fff" }}>
        <span style={{ display: "inline-block", width: 6, height: 8, borderRadius: "50%", background: ACCENT, marginRight: 2 }} />
        GradeOPS
      </div>
      <div style={{ display: "flex", gap: 4, background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 50, padding: 4 }}>
        <button style={navLinkStyle(path === "/home")} onClick={() => navigate("/home")}>Home</button>
        <button style={navLinkStyle(path === "/dashboard")} onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button style={navLinkStyle(path === "/upload")} onClick={() => navigate("/upload")}>Upload</button>
      </div>
      <button
        onClick={onLogout}
        style={{
          fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace",
          background: "none", border: "none", cursor: "pointer",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.target.style.color = "#fff"}
        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
      >
        logout ›
      </button>
    </nav>
  );
}

/* ─── Login Page ─────────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: SURFACE, border: `1px solid ${BORDER}`,
    borderRadius: 10, color: "#fff", fontSize: 14,
    fontFamily: FONT, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // Simulate auth — replace with real logic
    setTimeout(() => {
      setLoading(false);
      if (password.length >= 4) {
        onLogin({ email });
      } else {
        setError("Invalid credentials. Try a longer password.");
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 400, padding: "48px 40px",
        background: "rgba(255,255,255,0.03)",
        border: `0.5px solid ${BORDER}`,
        borderRadius: 20,
        backdropFilter: "blur(20px)",
        position: "relative",
        animation: "fadeUp 0.5s ease both",
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .login-input:focus { border-color: ${ACCENT} !important; }
          .login-btn:hover:not(:disabled) { background: #6a35f0 !important; }
        `}</style>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>GradeOPS by Khush</span>
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#fff" }}>Welcome back</h1>
        <p style={{ margin: "0 0 32px", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>EMAIL</label>
            <input
              className="login-input"
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input
              className="login-input"
              type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#ff5c5c", background: "rgba(255,92,92,0.08)", border: "1px solid rgba(255,92,92,0.2)", borderRadius: 8, padding: "10px 14px" }}>
              {error}
            </div>
          )}

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6, padding: "13px", borderRadius: 10,
              background: ACCENT, border: "none", color: "#fff",
              fontFamily: FONT, fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s, opacity 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          v1.0.0
        </p>
      </div>
    </div>
  );
}

/* ─── Home Page ──────────────────────────────────────────────── */
function HomePage({ user }) {
  const navigate = useNavigate();

  const cards = [
    { label: "Dashboard", desc: "View analytics & metrics", path: "/dashboard", icon: "◈" },
    { label: "Upload", desc: "Add new files & data", path: "/upload", icon: "⊕" },
  ];

  return (
    <div style={{
      minHeight: "calc(100vh - 65px)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "60px 24px",
      fontFamily: FONT, position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 65%)",
        top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .home-card:hover {
          border-color: ${ACCENT} !important;
          background: rgba(124,77,255,0.08) !important;
          transform: translateY(-3px);
        }
      `}</style>

      <div style={{ position: "relative", textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 16px" }}>
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
          What are we<br />working on today?
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 420, margin: "0 auto 52px" }}>
          Jump into a section below or explore your recent activity.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {cards.map((card, i) => (
            <button
              key={card.path}
              className="home-card"
              onClick={() => navigate(card.path)}
              style={{
                width: 200, padding: "28px 24px",
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 16, cursor: "pointer", textAlign: "left",
                transition: "all 0.2s ease",
                animation: `fadeUp 0.5s ease ${0.1 + i * 0.1}s both`,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 12, color: ACCENT }}>{card.icon}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{card.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Route guard ────────────────────────────────────────────── */
function Protected({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

/* ─── App ────────────────────────────────────────────────────── */
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: FONT }}>
        {user && <NavBar onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/home"      element={<Protected isAuth={!!user}><HomePage user={user} /></Protected>} />
          <Route path="/dashboard" element={<Protected isAuth={!!user}><Dashboard /></Protected>} />
          <Route path="/upload"    element={<Protected isAuth={!!user}><Upload /></Protected>} />
          {/* Default redirect */}
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;