import { useState } from 'react';
import { ROLES, getCriteriaForRole, getSectionLabel, LEVELS } from '../data/criteria';
import { completionPercent } from '../utils/scoring';
import ProgressBar from './ProgressBar';
import RatingScale from './RatingScale';

export default function Questionnaire({ roleId, scores, setScores, onComplete, onBack }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const role = ROLES[roleId];
  const sections = role.sections;
  const currentLevel = sections[sectionIndex];
  const sectionCriteria = getCriteriaForRole(roleId).filter((c) => c.level === currentLevel);
  const current = sectionCriteria[questionIndex];

  const allCriteria = getCriteriaForRole(roleId);
  const globalIndex =
    sections.slice(0, sectionIndex).reduce(
      (sum, lvl) => sum + allCriteria.filter((c) => c.level === lvl).length,
      0,
    ) + questionIndex;

  const totalQuestions = allCriteria.length;
  const currentScore = scores[current.id] ?? 0;
  const sectionTitle = getSectionLabel(roleId, currentLevel);

  function handleRating(value) {
    setScores((prev) => ({ ...prev, [current.id]: value }));
  }

  function goNext() {
    if (questionIndex < sectionCriteria.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else if (sectionIndex < sections.length - 1) {
      setSectionIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      onComplete();
    }
  }

  function goPrev() {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (sectionIndex > 0) {
      const prevLevel = sections[sectionIndex - 1];
      const prevSection = allCriteria.filter((c) => c.level === prevLevel);
      setSectionIndex((i) => i - 1);
      setQuestionIndex(prevSection.length - 1);
    } else {
      onBack();
    }
  }

  const canProceed = currentScore >= 1 && currentScore <= 5;
  const isLast =
    sectionIndex === sections.length - 1 &&
    questionIndex === sectionCriteria.length - 1;

  return (
    <div className="questionnaire">
      <ProgressBar
        current={globalIndex + 1}
        total={totalQuestions}
        sectionTitle={sectionTitle}
      />

      <div className="question-card">
        <div className="question-header">
          <span
            className="question-level"
            style={{ background: LEVELS[currentLevel]?.color ?? '#1e3a5f' }}
          >
            {sectionTitle}
          </span>
          <span className="question-num">
            سؤال {globalIndex + 1} من {totalQuestions}
          </span>
        </div>

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
          <button type="button" className="btn-secondary" onClick={goPrev}>
            {globalIndex === 0 ? 'العودة' : 'السابق'}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={goNext}
            disabled={!canProceed}
          >
            {isLast ? 'عرض النتائج' : 'التالي'}
          </button>
        </div>

        <p className="completion-note">
          نسبة الإكمال: {completionPercent(scores, roleId)}%
        </p>
      </div>
    </div>
  );
}
