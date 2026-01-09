import { useState } from "react";
import "./App.css";
import LoginScreen from "./LoginScreen";
import PhotoUploadScreen from "./PhotoUploadScreen";
import AnalysisHistory from "./AnalysisHistory";



export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 📌 ANALYSIS HISTORY EKRANI
  if (showHistory) {
    return (
      <AnalysisHistory
        onBack={() => setShowHistory(false)}
      />
    );
  }

  // 📌 FOTO YÜKLEME / ANALİZ EKRANI
  if (showUpload) {
    return (
      <PhotoUploadScreen
        onShowHistory={() => setShowHistory(true)}
      />
    );
  }

  // 📌 LANDING PAGE
  return (
    <div className="container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-area">
          <h2>Dijital Radyolog</h2>
        </div>

        <button
          className="login-btn"
          onClick={() => setShowLogin(true)}
        >
          Giriş Yap
        </button>
      </nav>

      {/* LANDING */}
      <main className="content">
        <div className="text-side">
          <h1>Görüntü Analizinde Yeni Nesil Deneyim</h1>

          <p>
            Yapay zeka destekli platformumuz ile görüntü analizi süreçleri
            çok daha hızlı, güvenilir ve erişilebilir.
          </p>

          <div
            className="start-text"
            onClick={() => setShowLogin(true)}
          >
            Hemen Başla
          </div>
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
            setShowUpload(true);
          }}
        />
      )}
    </div>
  );
}
