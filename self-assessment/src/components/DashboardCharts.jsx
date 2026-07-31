function DonutChart({ segments, size = 140 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  const r = 16;
  const c = 2 * Math.PI * r;

  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className="donut-chart">
      {segments.map((seg) => {
        const pct = seg.value / total;
        const dash = pct * c;
        const el = (
          <circle
            key={seg.label}
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="4"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 18 18)"
          />
        );
        offset += dash;
        return el;
      })}
      <text x="18" y="18.5" textAnchor="middle" className="donut-center">
        {total}
      </text>
    </svg>
  );
}

function BarChart({ items }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div key={item.label} className="bar-row">
          <span className="bar-label">{item.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
          <span className="bar-value">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardCharts({ stats }) {
  if (stats.total === 0) {
    return (
      <section className="dashboard-section empty-dashboard">
        <h2>📊 ملخص التقييمات</h2>
        <p>لا توجد تقييمات مسجّلة بعد — ستظهر الإحصائيات هنا بعد إكمال أول تقييم.</p>
      </section>
    );
  }

  const levelSegments = [
    { label: 'في مسار التطوير', value: stats.levelCounts.needs_development, color: '#6b7c93' },
    { label: 'ناجح', value: stats.levelCounts.success, color: '#1e3a5f' },
    { label: 'متميز', value: stats.levelCounts.distinguished, color: '#c9a227' },
  ];

  const roleBars = [
    { label: 'مدرب', value: stats.rolePercentages.trainer, color: '#1e3a5f' },
    { label: 'معلم', value: stats.rolePercentages.teacher, color: '#2d5a3d' },
  ];

  const levelBars = [
    { label: 'في مسار التطوير', value: stats.levelPercentages.needs_development, color: '#6b7c93' },
    { label: 'ناجح', value: stats.levelPercentages.success, color: '#1e3a5f' },
    { label: 'متميز', value: stats.levelPercentages.distinguished, color: '#c9a227' },
  ];

  return (
    <section className="dashboard-section">
      <h2>📊 ملخص التقييمات</h2>

      <div className="dashboard-stats-row">
        <div className="dash-stat">
          <span className="dash-stat-num">{stats.total}</span>
          <span className="dash-stat-label">إجمالي التقييمات</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">{stats.avgBase}</span>
          <span className="dash-stat-label">متوسط المعايير الأساسية</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">{stats.avgDist}</span>
          <span className="dash-stat-label">متوسط معايير التميز</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>توزيع المستويات</h3>
          <div className="chart-body donut-wrap">
            <DonutChart segments={levelSegments} />
            <ul className="chart-legend">
              {levelSegments.map((s) => (
                <li key={s.label}>
                  <span className="legend-dot" style={{ background: s.color }} />
                  {s.label}: {s.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chart-card">
          <h3>نسبة المدرب / المعلم</h3>
          <BarChart items={roleBars} />
        </div>

        <div className="chart-card chart-wide">
          <h3>نسبة كل مستوى (%)</h3>
          <BarChart items={levelBars} />
        </div>
      </div>
    </section>
  );
}
