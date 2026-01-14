import { useState } from "react";
import "./LoginScreen.css";

export default function LoginScreen({ onClose, onLoginSuccess }) {
  // login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register modal state
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const parseErrorMessage = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (isJson) {
      try {
        const data = await res.json();
        return data?.message || data?.error || JSON.stringify(data);
      } catch {
        return `Hata (HTTP ${res.status})`;
      }
    } else {
      try {
        const text = await res.text();
        return text || `Hata (HTTP ${res.status})`;
      } catch {
        return `Hata (HTTP ${res.status})`;
      }
    }
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res));

      const data = await res.json();
      const token = data?.token;

      if (!token) throw new Error("Token alınamadı.");

      localStorage.setItem("token", token);
      onLoginSuccess({ token, user: data?.user });
    } catch (e) {
      setError(e?.message || "Giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegError("");
    setRegLoading(true);

    try {
      const res = await fetch("/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res));

      // Başarılı kayıt
      setShowRegister(false);
      setEmail(regEmail);
      setPassword("");
      setSuccess("Kayıt başarılı. Şimdi giriş yapabilirsin."); 
    } catch (e) {
      setRegError(e?.message || "Kayıt başarısız");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="login-backdrop">
      <h1 className="login-brand">Dijital Radyolog</h1>

      <div className="login-card">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 className="login-title">Giriş Yap</h2>

        <input
          type="email"
          placeholder="E-posta"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <button
          className="login-main-btn"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <button
          className="login-secondary-btn"
          onClick={() => setShowRegister(true)}
          type="button"
        >
          Kayıt Ol
        </button>
      </div>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="register-modal-backdrop" onClick={() => setShowRegister(false)}>
          <div className="register-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRegister(false)}>✕</button>

            <h2 className="login-title">Kayıt Ol</h2>

            <input
              type="text"
              placeholder="Ad Soyad"
              className="login-input"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
            />

            <input
              type="email"
              placeholder="E-posta"
              className="login-input"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Şifre"
              className="login-input"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />

            {regError && <div className="login-error">{regError}</div>}

            <button
              className="login-main-btn"
              onClick={handleRegister}
              disabled={regLoading || !regName || !regEmail || !regPassword}
            >
              {regLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>

            <button
              className="login-secondary-btn"
              onClick={() => setShowRegister(false)}
              type="button"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}