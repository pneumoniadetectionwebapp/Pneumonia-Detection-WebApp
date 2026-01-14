import { useState } from "react";
import "./PhotoUploadScreen.css";
import { authFetch } from "./api";

export default function PhotoUploadScreen({ onGoHistory, onLogout }) {
  const [preview, setPreview] = useState(null);
  const [fileObj, setFileObj] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setResult(null);

    setFileObj(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!fileObj) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      
      const form = new FormData();
      form.append("File", fileObj);

      
      const res = await authFetch("/api/Prediction/predict", {
        method: "POST",
        body: form,
        
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Analiz başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="layout">
        {/* SOL PANEL */}
        <section className="left-panel">
          <h1 className="upload-title">Dijital Radyolog</h1>

          <p className="upload-desc">
            Yapay zeka destekli sistem ile akciğer görüntülerini güvenli ve hızlı şekilde analiz edin.
          </p>

          <label className="upload-box">
            {loading && <div className="loading">İşleniyor...</div>}

            <div className={`upload-placeholder ${preview ? "hidden" : ""}`}>
              <span className="upload-text">Görüntü Yükle</span>
              <small className="format-text">PNG / JPG</small>
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
              accept="image/png,image/jpeg"
              onChange={handleFile}
            />
          </label>

          <button
            className="analyze-btn"
            disabled={!preview || loading}
            onClick={handleAnalyze}
          >
            {loading ? "Analiz ediliyor..." : "Analizi Başlat"}
          </button>

          {/* NAV BUTONLARI */}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              className="analyze-btn"
              style={{ padding: "10px 14px" }}
              onClick={onGoHistory}
              disabled={loading}
              type="button"
            >
              Analiz Geçmişi
            </button>

            <button
              className="analyze-btn"
              style={{ padding: "10px 14px" }}
              onClick={onLogout}
              disabled={loading}
              type="button"
            >
              Çıkış
            </button>
          </div>

          {error ? (
            <div style={{ marginTop: 10, color: "#b00020", fontSize: 14 }}>
              {error}
            </div>
          ) : null}
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
                  <span>{fileObj?.type?.includes("jpeg") ? "JPG" : "PNG"} Görüntü</span>
                </div>

                <div className="report-section">
                  <h3>Model Çıktısı</h3>
                  <ul>
                    <li><b>Label:</b> {result?.label ?? "-"}</li>
                    <li><b>Confidence:</b> {result?.confidence ?? "-"}</li>
                  </ul>
                </div>

                <div className="report-section">
                  <h3>Bilgilendirme</h3>
                  <p>
                    Bu rapor otomatik sistem tarafından üretilmiştir ve yalnızca bilgilendirme amaçlıdır.
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