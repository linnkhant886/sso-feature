import { useEffect, useState } from "react";

const API = "http://localhost:4000";

function goLogin() {
  const returnTo = encodeURIComponent(window.location.href);
  window.location.href = `${API}/auth/login?returnTo=${returnTo}`;
}

const cards = [
  { name: "App 1", url: "http://localhost:5174" },
  { name: "App 2", url: "http://localhost:5175" },
  { name: "App 3", url: "http://localhost:5176" }
];

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

  if (user === undefined) {
    return <div style={styles.loading}>Loading panel...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>SSO App Panel</h1>
          <p style={styles.subtitle}>Welcome back, {user?.name}</p>
        </div>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>

      <div style={styles.grid}>
        {cards.map((c) => (
          <a key={c.name} href={c.url} style={styles.card}>
            <div style={styles.badge}>Micro Frontend</div>
            <h2 style={styles.cardTitle}>{c.name}</h2>
            <p style={styles.cardText}>Open {c.name} directly with existing SSO session.</p>
          </a>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    fontFamily: "Inter, Segoe UI, sans-serif",
    background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "#e5e7eb"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  title: { margin: 0, fontSize: "32px" },
  subtitle: { margin: "8px 0 0", color: "#94a3b8" },
  logout: {
    background: "#ef4444",
    color: "white",
    border: 0,
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px"
  },
  card: {
    textDecoration: "none",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "20px",
    color: "#e5e7eb"
  },
  badge: {
    display: "inline-block",
    fontSize: "12px",
    color: "#93c5fd",
    marginBottom: "8px"
  },
  cardTitle: { margin: "0 0 8px", fontSize: "24px" },
  cardText: { margin: 0, color: "#cbd5e1" },
  loading: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    fontFamily: "Inter, Segoe UI, sans-serif"
  }
};
