import "./AnalysisHistory.css";

const mockAnalyses = [
  { id: 1, name: "Akciğer Analizi", date: "12 Eylül 2025" },
  { id: 2, name: "Kontrol Analizi", date: "08 Eylül 2025" },
  { id: 3, name: "Rutin Tarama", date: "01 Eylül 2025" },
  { id: 4, name: "Akciğer Analizi", date: "25 Ağustos 2025" },
];

export default function AnalysisHistory({ onBack }) {
  return (
    <div className="history-page">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>
          ← Geri
        </button>
        <h1>Analiz Geçmişi</h1>
      </div>

      <div className="history-list">
        {mockAnalyses.map((item) => (
          <div key={item.id} className="history-card">
            <div>
              <h3>{item.name}</h3>
              <span>{item.date}</span>
            </div>

            <button className="detail-btn">Görüntüle</button>
          </div>
        ))}
      </div>
    </div>
  );
}
