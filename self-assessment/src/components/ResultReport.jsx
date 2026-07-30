function LevelLadder({ ladder, currentIndex }) {
  return (
    <div className="level-ladder">
      {ladder.map((step, i) => (
        <div
          key={step.key ?? step.title}
          className={`ladder-step ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'passed' : ''}`}
        >
          <div className="ladder-dot" style={{ background: i <= currentIndex ? step.color : '#dde3ed' }} />
          <span className="ladder-label">{step.title}</span>
        </div>
      ))}
    </div>
  );
}

function GapCard({ gap }) {
  return (
    <div className={`gap-card ${gap.priority}`}>
      <div className="gap-header">
        <h4>{gap.name}</h4>
        <span className="gap-score">{gap.score}/5 — {gap.ratingLabel}</span>
      </div>
      <div className="gap-body">
        <div className="gap-problem">
          <strong>🔴 الخلل:</strong>
          <p>{gap.problem}</p>
        </div>
        <div className="gap-solution">
          <strong>✅ الحل:</strong>
          <pre>{gap.solution}</pre>
        </div>
      </div>
    </div>
  );
}

export default function ResultReport({ result, pdfRef, completedAt }) {
  const {
    meta,
    roleLabel,
    userName,
    ladder,
    currentLadderIndex,
    averages,
    gaps,
    strengths,
    levelBreakdown,
    nextGoal,
    excellentCount,
    levelKey,
    distinguishedEvaluated,
    classificationReasons,
    basePass,
  } = result;

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div ref={pdfRef} className="pdf-content">
      <div className="pdf-header">
        <h2>تقرير التقييم الذاتي</h2>
        <p>
          {userName && <span>{userName} — </span>}
          {roleLabel} — {dateStr}
        </p>
      </div>

      <div className="result-hero" style={{ borderColor: meta.color }}>
        <div className="result-badge" style={{ background: meta.color }}>
          نتيجة التقييم
        </div>
        <h1 style={{ color: meta.color }}>{meta.title}</h1>
        <p className="result-desc">{meta.description}</p>
      </div>

      {!distinguishedEvaluated && !basePass && (
        <div className="skip-notice">
          ⚠️ لم تُقيَّم معايير التميز — يجب اجتياز المعايير الأساسية أولاً.
        </div>
      )}

      {classificationReasons?.length > 0 && (
        <section className="results-section reasons-section">
          <h2>أسباب التصنيف</h2>
          <ul className="reasons-list">
            {classificationReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
      )}

      <LevelLadder ladder={ladder} currentIndex={currentLadderIndex} />

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">متوسط المعايير الأساسية</span>
          <span className="stat-value">{averages.base}</span>
          <span className="stat-hint">من 5 — الحد الأدنى للنجاح: 3.5</span>
        </div>
        {distinguishedEvaluated && averages.distinguished != null && (
          <div className="stat-card">
            <span className="stat-label">متوسط معايير التميز</span>
            <span className="stat-value">{averages.distinguished}</span>
            <span className="stat-hint">من 5 — مطلوب للتميز: 4.0</span>
          </div>
        )}
        {levelKey === 'distinguished' && (
          <div className="stat-card highlight">
            <span className="stat-label">معايير ممتازة (5/5)</span>
            <span className="stat-value">{excellentCount}/12</span>
          </div>
        )}
      </div>

      {nextGoal && (
        <div className="next-goal-banner">
          🎯 الهدف التالي: <strong>{nextGoal}</strong>
        </div>
      )}

      {gaps.length > 0 && (
        <section className="results-section gaps-section">
          <h2>نقاط تحتاج تحسين ({gaps.length})</h2>
          <p className="section-intro">
            بناءً على الإجابات، هذه المعايير تحتاج عملاً — كل بطاقة توضّح الخلل والحل:
          </p>
          <div className="gap-list">
            {gaps.map((gap) => (
              <GapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </section>
      )}

      {gaps.length === 0 && levelKey === 'distinguished' && (
        <section className="results-section">
          <div className="all-good-note">
            ✅ أداء ممتاز في جميع المعايير المُقيَّمة!
          </div>
        </section>
      )}

      {strengths.length > 0 && (
        <section className="results-section strengths">
          <h2>نقاط القوة ({strengths.length})</h2>
          <div className="strength-tags">
            {strengths.map((c) => (
              <span key={c.id} className="strength-tag">
                {c.name} ({c.score}/5)
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="results-section breakdown-section">
        <h2>ملخص المعايير المُقيَّمة</h2>
        {levelBreakdown.map((section) => (
          <div key={section.level} className="breakdown-block">
            <h3 style={{ color: section.color }}>
              {section.title}
              <span className="section-avg"> — متوسط {section.average}/5</span>
            </h3>
            <table className="criteria-table">
              <thead>
                <tr>
                  <th>المعيار</th>
                  <th>الدرجة</th>
                  <th>التقييم</th>
                </tr>
              </thead>
              <tbody>
                {section.criteria.map((c) => (
                  <tr
                    key={c.id}
                    className={c.score < 3 ? 'row-weak' : c.score >= 4 ? 'row-good' : ''}
                  >
                    <td>{c.name}</td>
                    <td>{c.score}/5</td>
                    <td>{c.score >= 4 ? '✅' : c.score === 3 ? '⚠️' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
}
