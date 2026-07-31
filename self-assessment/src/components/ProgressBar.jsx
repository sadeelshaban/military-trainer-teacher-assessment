export default function ProgressBar({ current, total, sectionTitle, completionNote }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span className="progress-section">{sectionTitle}</span>
        <span className="progress-count">
          {current} / {total} ({pct}%)
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {completionNote != null && (
        <p className="progress-completion">{completionNote}</p>
      )}
    </div>
  );
}
