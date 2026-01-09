import { useState } from "react";
import "./PhotoUploadScreen.css";

export default function PhotoUploadScreen({ onShowHistory }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult(false);

    setTimeout(() => {
      setPreview(URL.createObjectURL(file));
      setLoading(false);
    }, 800);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="upload-page">
      <div className="layout">

        {/* SOL PANEL */}
        <section className="left-panel">
          <h1 className="upload-title">Dijital Radyolog</h1>

          <p className="upload-desc">
            Yapay zeka destekli sistem ile akciğer görüntülerini
            güvenli ve hızlı şekilde analiz edin.
          </p>

          <label className="upload-box">
            {loading && <div className="loading">İşleniyor...</div>}

            <div className={`upload-placeholder ${preview ? "hidden" : ""}`}>
              <span className="upload-text">Görüntü Yükle</span>
              <small className="format-text">PNG</small>
            </div>

            {preview && (
              <img
                src={preview}
                className="preview-img"
                alt="Yüklenen görüntü"
              />
            )}

            <input
              type="file"
              hidden
              accept="image/png"
              onChange={handleFile}
            />
          </label>

          {/* ANALİZ BUTONU */}
          <button
            className="analyze-btn"
            disabled={!preview || loading}
            onClick={handleAnalyze}
          >
            Analizi Başlat
          </button>

          {/* 👇 GEÇMİŞ ANALİZLER – TAM OLARAK BURADA */}
          <button
            className="history-btn"
            onClick={onShowHistory}
          >
            Geçmiş Analizler
          </button>
        </section>

        {/* SAĞ PANEL */}
        <section className="right-panel">
          <div className="right-content">

            {!result && !loading && (
              <div className="report-empty">
                <h2>Analiz Sonucu</h2>
                <p>Henüz analiz yapılmadı.</p>
              </div>
            )}

            {loading && (
              <div className="report-empty">
                <p>Yapay zeka görüntüyü analiz ediyor…</p>
              </div>
            )}

            {result && (
              <div className="report-card">
                <div className="report-header">
                  <h2>Analiz Raporu</h2>
                  <span>PNG Görüntü</span>
                </div>

                <div className="report-section">
                  <h3>Özet</h3>
                  <p>
                    Yüklenen akciğer görüntüsü yapay zeka destekli sistem
                    tarafından değerlendirilmiştir.
                  </p>
                </div>

                <div className="report-section">
                  <h3>İnceleme Detayları</h3>
                  <ul>
                    <li>Görüntü kontrast seviyesi analiz edildi</li>
                    <li>Genel doku yapısı değerlendirildi</li>
                    <li>Çözünürlük ve netlik kontrol edildi</li>
                  </ul>
                </div>

                <div className="report-section">
                  <h3>Bilgilendirme</h3>
                  <p>
                    Bu rapor otomatik sistem tarafından üretilmiştir ve
                    yalnızca bilgilendirme amaçlıdır.
                  </p>
                </div>
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}
