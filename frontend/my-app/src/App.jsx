import "./App.css";

export default function App() {
  return (
    <div className="container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-area">
          <h2>Dijital Radyolog</h2>
        </div>
        <button className="login-btn">Giriş Yap</button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="content">
        <div className="text-side">
          <h1>Görüntü Analizinde Yeni Nesil Deneyim</h1>

          <p>
            Yapay zeka destekli platformumuz ile görüntü analizi süreçleri
            çok daha hızlı, güvenilir ve erişilebilir.
          </p>

          <button className="primary-btn">Hemen Başla</button>
        </div>

        <div className="image-side">
          <img
            src="/ai_radiolog.png"
            alt="AI Görüntü Analizi"
            className="image-box"
          />
        </div>
      </main>
    </div>
  );
}
