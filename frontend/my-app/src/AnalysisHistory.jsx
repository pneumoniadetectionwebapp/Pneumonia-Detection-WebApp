import { useEffect, useMemo, useState } from "react";
import "./AnalysisHistory.css";
import { authFetch } from "./api";

export default function AnalysisHistory({ onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  
  const [selected, setSelected] = useState(null);

  
  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");

  const loadHistory = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await authFetch("/api/Prediction/history");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Geçmiş alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  
  const getTitle = (x) =>
    x?.label ? `Sonuç: ${x.label}` : x?.name || x?.analysisName || x?.result || "Analiz";

  const getDate = (x) => x?.createdAt || x?.date || x?.created_at || "";

  const getConfidence = (x) => x?.confidence ?? x?.score ?? x?.probability ?? null;

  
  const getImageUrl = (x) =>
    x?.imageUrl || x?.sasUrl || x?.blobUrl || x?.url || x?.image || x?.blob_url || null;

  const modalImageUrl = useMemo(() => {
    if (!selected) return null;
    return getImageUrl(selected);
  }, [selected]);

  const getCacheBustedUrl = (url) =>
    !url ? "" : url.includes("?") ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;

  // Modal açılınca image state reset
  useEffect(() => {
    if (!selected) return;
    setImgErr("");
    setImgLoading(!!modalImageUrl);
  }, [selected, modalImageUrl]);

  return (
    <div className="history-page">
      <div className="history-header">
        <button className="back-btn" onClick={onBack} type="button">
          ← Geri
        </button>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <h1 style={{ margin: 0 }}>Analiz Geçmişi</h1>
          <button className="detail-btn" onClick={loadHistory} disabled={loading} type="button">
            {loading ? "Yükleniyor..." : "Yenile"}
          </button>
        </div>
      </div>

      {err ? <div className="history-error">{err}</div> : null}

      <div className="history-list">
        {!loading && items.length === 0 ? (
          <div className="history-empty">Henüz analiz geçmişi yok.</div>
        ) : null}

        {items.map((item, idx) => (
          <div key={item?.id ?? idx} className="history-card">
            <div>
              <h3>{getTitle(item)}</h3>
              <span>{getDate(item)}</span>

              {getConfidence(item) !== null ? (
                <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>
                  <b>Confidence:</b>{" "}
                  {typeof getConfidence(item) === "number"
                    ? Number(getConfidence(item)).toFixed(4)
                    : String(getConfidence(item))}
                </div>
              ) : null}
            </div>

            <button className="detail-btn" onClick={() => setSelected(item)} type="button">
              Görüntüle
            </button>
          </div>
        ))}
      </div>

      
      {selected && (
        <div
          className="history-modal-backdrop"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            className="history-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18 }}>Analiz Detayı</div>
              <button className="back-btn" onClick={() => setSelected(null)} type="button">
                Kapat ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              
              {modalImageUrl ? (
                <div style={{ width: "100%" }}>
                  {imgLoading ? (
                    <div style={{ fontSize: 14, opacity: 0.8 }}>Görsel yükleniyor…</div>
                  ) : null}

                  {imgErr ? (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: "#b00020",
                        lineHeight: 1.4,
                      }}
                    >
                      {imgErr}
                      <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          className="detail-btn"
                          type="button"
                          onClick={() => window.open(modalImageUrl, "_blank")}
                        >
                          Yeni Sekmede Aç
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getCacheBustedUrl(modalImageUrl)}
                      alt="Analiz görüntüsü"
                      style={{
                        width: "100%",
                        maxHeight: "70vh",
                        objectFit: "contain",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                      }}
                      onLoad={() => {
                        setImgLoading(false);
                        setImgErr("");
                      }}
                      onError={() => {
                        setImgLoading(false);
                        setImgErr(
                          "Görsel sayfada gösterilemedi. (Genelde Storage/CORS/CORP politikası) " +
                            "Ama SAS linki çalışıyorsa yeni sekmede açınca görünür."
                        );
                      }}
                    />
                  )}

                  <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                    <div>
                      <b>URL:</b>{" "}
                      <span style={{ wordBreak: "break-all" }}>{modalImageUrl}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "#b00020" }}>
                  Bu kayıtta görüntü URL’i bulunamadı (imageUrl/sasUrl/blocUrl gelmiyor).
                </div>
              )}

              
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                }}
              >
                <div>
                  <b>Label:</b> {selected?.label ?? "-"}
                </div>
                <div>
                  <b>Confidence:</b>{" "}
                  {getConfidence(selected) !== null ? getConfidence(selected) : "-"}
                </div>
                <div>
                  <b>Tarih:</b> {getDate(selected) || "-"}
                </div>
                {selected?.blobName ? (
                  <div>
                    <b>BlobName:</b>{" "}
                    <span style={{ wordBreak: "break-all" }}>{selected.blobName}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}