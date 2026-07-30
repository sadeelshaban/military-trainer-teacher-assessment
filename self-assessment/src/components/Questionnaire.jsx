import { useState } from 'react';
import { ROLES, getCriteriaForRole, getSectionLabel, LEVELS } from '../data/criteria';
import { completionPercent, evaluateBaseLevel } from '../utils/scoring';
import ProgressBar from './ProgressBar';
import RatingScale from './RatingScale';

export default function Questionnaire({ roleId, scores, setScores, onComplete, onBack }) {
  const [phase, setPhase] = useState('base');
  const [questionIndex, setQuestionIndex] = useState(0);

  const role = ROLES[roleId];
  const baseLevel = role.baseLevel;
  const currentLevel = phase === 'distinguished' ? 'distinguished' : baseLevel;
  const sectionCriteria = getCriteriaForRole(roleId).filter((c) => c.level === currentLevel);
  const current = sectionCriteria[questionIndex];

  const baseCount = getCriteriaForRole(roleId).filter((c) => c.level === baseLevel).length;
  const distCount = getCriteriaForRole(roleId).filter((c) => c.level === 'distinguished').length;

  const globalIndex =
    phase === 'distinguished' ? baseCount + questionIndex : questionIndex;

  const totalQuestions = phase === 'distinguished' ? baseCount + distCount : baseCount;
  const currentScore = scores[current.id] ?? 0;
  const sectionTitle = getSectionLabel(roleId, currentLevel);

  function handleRating(value) {
    setScores((prev) => ({ ...prev, [current.id]: value }));
  }

  function goNext() {
    const isLastInPhase = questionIndex === sectionCriteria.length - 1;

    if (phase === 'base' && isLastInPhase) {
      const latestScores = { ...scores, [current.id]: currentScore };
      const baseEval = evaluateBaseLevel(latestScores, roleId);
      if (!baseEval.basePass) {
        onComplete({ distinguishedEvaluated: false, finalScores: latestScores });
        return;
      }
      setPhase('dist_intro');
      return;
    }

    if (phase === 'distinguished' && isLastInPhase) {
      onComplete({
        distinguishedEvaluated: true,
        finalScores: { ...scores, [current.id]: currentScore },
      });
      return;
    }

    setQuestionIndex((i) => i + 1);
  }

  function goPrev() {
    if (phase === 'dist_intro') {
      setPhase('base');
      setQuestionIndex(baseCount - 1);
      return;
    }
    if (phase === 'distinguished' && questionIndex === 0) {
      setPhase('dist_intro');
      return;
    }
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      onBack();
    }
  }

  function startDistinguished() {
    setPhase('distinguished');
    setQuestionIndex(0);
  }

  const canProceed = currentScore >= 1 && currentScore <= 5;

  if (phase === 'dist_intro') {
    return (
      <div className="questionnaire">
        <div className="phase-gate">
          <div className="phase-gate-icon">✅</div>
          <h2>أحسنت! اجتزت المعايير الأساسية</h2>
          <p>
            بناءً على إجاباتك، أنت مؤهل لتقييم <strong>معايير التميز</strong>
            {' '}({distCount} أسئلة) لتحديد إن كنت «{role.levels.distinguished.title}».
          </p>
          <div className="nav-buttons">
            <button type="button" className="btn-secondary" onClick={goPrev}>
              مراجعة الإجابات
            </button>
            <button type="button" className="btn-primary" onClick={startDistinguished}>
              متابعة — معايير التميز
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nextLabel =
    phase === 'base' && questionIndex === sectionCriteria.length - 1
      ? 'تقييم المرحلة الأساسية'
      : phase === 'distinguished' && questionIndex === sectionCriteria.length - 1
        ? 'عرض النتائج'
        : 'التالي';

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

        {phase === 'base' && (
          <p className="phase-note">المرحلة 1: المعايير الأساسية — يجب اجتيازها للانتقال للتميز</p>
        )}
        {phase === 'distinguished' && (
          <p className="phase-note phase-note-gold">المرحلة 2: معايير التميز</p>
        )}

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
            {nextLabel}
          </button>
        </div>

        <p className="completion-note">
          نسبة الإكمال:{' '}
          {completionPercent(scores, roleId, {
            includeDistinguished: phase === 'distinguished',
          })}
          %
        </p>
      </div>
    </div>
  );
}
