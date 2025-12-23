import "./LoginScreen.css";

export default function LoginScreen({ onClose, onLoginSuccess }) {
  const handleLogin = () => {
    // ŞİMDİLİK BACKEND YOK
    onLoginSuccess();
  };

  return (
    <div className="login-backdrop">
    
      <h1 className="login-brand">Dijital Radyolog</h1>

      <div className="login-card">
        {/* KAPAT */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="login-title">Giriş Yap</h2>

        <input
          type="email"
          placeholder="E-posta"
          className="login-input"
        />

        <input
          type="password"
          placeholder="Şifre"
          className="login-input"
        />

        {/* GİRİŞ */}
        <button
          className="login-main-btn"
          onClick={handleLogin}
        >
          Giriş Yap
        </button>

        {/* KAYIT */}
        <button className="login-secondary-btn">
          Kayıt Ol
        </button>

        {/* 🔥 MİSAFİR BUTON */}
        <button
          className="login-guest-btn"
          onClick={onLoginSuccess}
        >
          Misafir Olarak Giriş Yap
        </button>
      </div>
    </div>
  );
}

