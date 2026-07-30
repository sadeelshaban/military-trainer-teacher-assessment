export default function ProgressBar({ current, total, sectionTitle }) {
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
    </div>
  );
}
