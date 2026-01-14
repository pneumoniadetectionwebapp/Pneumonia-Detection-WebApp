import { useEffect, useState } from "react";
import "./App.css";
import LoginScreen from "./LoginScreen";
import PhotoUploadScreen from "./PhotoUploadScreen";
import AnalysisHistory from "./AnalysisHistory";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [screen, setScreen] = useState("landing");
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
      setScreen("upload");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    setScreen("landing");
  };

  
  if (screen === "upload") {
    return (
      <PhotoUploadScreen
        onGoHistory={() => setScreen("history")}
        onLogout={handleLogout}
      />
    );
  }

  
  if (screen === "history") {
    return <AnalysisHistory onBack={() => setScreen("upload")} />;
  }


  return (
    <div className="container">
      
      <nav className="navbar">
        <div className="logo-area">
          <h2>Dijital Radyolog</h2>
        </div>

        <button
          className="login-btn"
          onClick={() => (hasToken ? setScreen("upload") : setShowLogin(true))}
        >
          {hasToken ? "Devam Et" : "Giriş Yap"}
        </button>
      </nav>

      
      <main className="content">
        <div className="text-side">
          <h1>Görüntü Analizinde Yeni Nesil Deneyim</h1>

          <p>
            Yapay zeka destekli platformumuz ile görüntü analizi süreçleri çok daha hızlı,
            güvenilir ve erişilebilir.
          </p>

          
        </div>

        <div className="image-side">
          <img
            src="/ai_radiolog.png"
            alt="AI Görüntü Analizi"
            className="image-box"
          />
        </div>
      </main>

      {/* LOGIN */}
      {showLogin && (
        <LoginScreen
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            setHasToken(true);
            setScreen("upload");
          }}
        />
      )}
    </div>
  );
}