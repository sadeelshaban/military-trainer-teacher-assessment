import { useState } from 'react';
import { ROLES, getCriteriaForRole, getSectionLabel, LEVELS } from '../data/criteria';
import { completionPercent } from '../utils/scoring';
import ProgressBar from './ProgressBar';
import RatingScale from './RatingScale';

export default function Questionnaire({
  roleId,
  scores,
  setScores,
  onComplete,
  onBack,
  saving = false,
  saveError = '',
}) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const role = ROLES[roleId];
  const allCriteria = getCriteriaForRole(roleId);
  const current = allCriteria[questionIndex];
  const totalQuestions = allCriteria.length;
  const currentScore = scores[current.id] ?? 0;
  const sectionTitle = getSectionLabel(roleId, current.level);
  const isDistinguishedQuestion = current.level === 'distinguished';

  function handleRating(value) {
    setScores((prev) => ({ ...prev, [current.id]: value }));
  }

  function goNext() {
    const latestScores = { ...scores, [current.id]: currentScore };

    if (questionIndex === totalQuestions - 1) {
      onComplete({ distinguishedEvaluated: true, finalScores: latestScores });
      return;
    }

    setScores(latestScores);
    setQuestionIndex((i) => i + 1);
  }

  function goPrev() {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      onBack();
    }
  }

  const canProceed = currentScore >= 1 && currentScore <= 5;
  const nextLabel = questionIndex === totalQuestions - 1 ? 'عرض النتائج' : 'التالي';

  return (
    <div className="questionnaire">
      <ProgressBar
        current={questionIndex + 1}
        total={totalQuestions}
        sectionTitle={sectionTitle}
      />

      <div className="question-card">
        <div className="question-header">
          <span
            className="question-level"
            style={{ background: LEVELS[current.level]?.color ?? '#1e3a5f' }}
          >
            {sectionTitle}
          </span>
          <span className="question-num">
            سؤال {questionIndex + 1} من {totalQuestions}
          </span>
        </div>

        <p className={`phase-note ${isDistinguishedQuestion ? 'phase-note-gold' : ''}`}>
          {isDistinguishedQuestion
            ? 'معايير التميز — تُقيَّم مع النجاح في النهاية'
            : 'معايير النجاح — تُقيَّم مع التميز في النهاية'}
        </p>

        <h2 className="criterion-name">{current.name}</h2>
        <p className="question-text">{current.question}</p>

        <details className="indicators-hint">
          <summary>مؤشرات السلوك (مرجع)</summary>
          <ul>
            {current.indicators.map((ind) => (
              <li key={ind}>{ind}</li>
            ))}
          </ul>
        </details>

        <RatingScale value={currentScore} onChange={handleRating} />

        <div className="nav-buttons">
          <button type="button" className="btn-secondary" onClick={goPrev} disabled={saving}>
            {questionIndex === 0 ? 'العودة' : 'السابق'}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={goNext}
            disabled={!canProceed || saving}
          >
            {saving ? 'جاري الحفظ...' : nextLabel}
          </button>
        </div>

        {saveError && <p className="form-error">{saveError}</p>}

        <p className="completion-note">
          نسبة الإكمال: {completionPercent(scores, roleId)}%
        </p>
      </div>
    </div>
  );
}
