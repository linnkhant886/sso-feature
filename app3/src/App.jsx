import { useEffect, useState } from "react";

const API = "http://localhost:4000";

function goLogin() {
  const returnTo = encodeURIComponent(window.location.href);
  window.location.href = `${API}/auth/login?returnTo=${returnTo}`;
}

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch(`${API}/api/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) goLogin();
        setUser(u);
      })
      .catch(() => goLogin());
  }, []);

  const logout = () => {
    window.location.href = `${API}/auth/logout`;
  };

  if (user === undefined) return <div style={styles.loading}>Loading App 3...</div>;

  return (
    <div style={{ ...styles.page, ...styles.bg3 }}>
      <TopNav user={user} onLogout={logout} />
      <h1 style={styles.h1}>You are in App 3 ✅</h1>
      <p style={styles.p}>One login, then user can freely jump across all apps.</p>
    </div>
  );
}

function TopNav({ user, onLogout }) {
  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <a href="http://localhost:5173" style={styles.link}>Panel</a>
        <a href="http://localhost:5174" style={styles.link}>App1</a>
        <a href="http://localhost:5175" style={styles.link}>App2</a>
        <a href="http://localhost:5176" style={styles.link}>App3</a>
      </div>
      <div>
        <span style={styles.user}>{user.name}</span>
        <button style={styles.logout} onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: 28, color: "#fff", fontFamily: "Inter, Segoe UI, sans-serif" },
  bg3: { background: "linear-gradient(140deg,#7c3aed,#0f172a)" },
  nav: { display: "flex", justifyContent: "space-between", marginBottom: 32, alignItems: "center" },
  left: { display: "flex", gap: 12 },
  link: { color: "#e2e8f0", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", padding: "6px 10px", borderRadius: 10 },
  user: { marginRight: 10, color: "#ddd6fe" },
  logout: { background: "#ef4444", color: "#fff", border: 0, borderRadius: 10, padding: "8px 12px", cursor: "pointer" },
  h1: { margin: 0, fontSize: 40 },
  p: { color: "#ede9fe", fontSize: 18 },
  loading: { minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, Segoe UI, sans-serif" }
};
