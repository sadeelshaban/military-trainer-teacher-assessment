import {
  ROLES,
  getCriteriaForRole,
  getSectionLabel,
  LEVELS,
} from '../data/criteria';
import { analyzeAllGaps } from './gapAnalysis';

const TRAINER_CRITICAL = ['t2', 't3', 't6', 't12'];
const TEACHER_CRITICAL = ['te1', 'te3', 'te8'];

const CRITICAL_NAMES = {
  t2: 'التخطيط للتدريب',
  t3: 'التواصل الفعال',
  t6: 'القدرة والكفاءة المهنية',
  t12: 'الأمان والانضباط التدريبي',
  te1: 'المعرفة والإلمام بالمادة',
  te3: 'الكفاءة في التدريس',
  te8: 'التغذية الراجعة',
};

function average(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function getBaseCriteria(roleId) {
  const role = ROLES[roleId];
  return getCriteriaForRole(roleId).filter((c) => c.level === role.baseLevel);
}

function getDistCriteria(roleId) {
  return getCriteriaForRole(roleId).filter((c) => c.level === 'distinguished');
}

function getCriticalIds(roleId) {
  return roleId === 'trainer' ? TRAINER_CRITICAL : TEACHER_CRITICAL;
}

export function evaluateBaseLevel(scores, roleId) {
  const baseCriteria = getBaseCriteria(roleId);
  const criticalIds = getCriticalIds(roleId);
  const baseScores = baseCriteria.map((c) => scores[c.id] ?? 0);

  const baseAvg = average(baseScores);
  const failReasons = [];

  if (baseAvg < 3.5) {
    failReasons.push(`متوسط المعايير الأساسية (${baseAvg.toFixed(1)}) أقل من الحد المطلوب (3.5)`);
  }

  for (const id of criticalIds) {
    const s = scores[id] ?? 0;
    if (s < 3) {
      failReasons.push(`معيار أساسي دون المطلوب: «${CRITICAL_NAMES[id]}» (${s}/5)`);
    }
  }

  const belowTwo = baseCriteria.filter((c) => (scores[c.id] ?? 0) < 2);
  if (belowTwo.length > 0) {
    failReasons.push(
      `يوجد ${belowTwo.length} معيار/معايير بدرجة أقل من 2 — يجب تحسينها أولاً`,
    );
  }

  const belowThree = baseCriteria.filter(
    (c) => !criticalIds.includes(c.id) && (scores[c.id] ?? 0) < 3,
  );
  if (belowThree.length > 1) {
    failReasons.push(
      `أكثر من معيار واحد دون المستوى المقبول (3): ${belowThree.map((c) => c.name).join('، ')}`,
    );
  }

  const basePass = failReasons.length === 0;

  return {
    baseAvg: Math.round(baseAvg * 10) / 10,
    basePass,
    failReasons,
    weakCriteria: baseCriteria
      .filter((c) => (scores[c.id] ?? 0) < 3)
      .map((c) => ({ ...c, score: scores[c.id] ?? 0 })),
  };
}

export function evaluateDistinguishedLevel(scores, roleId) {
  const distCriteria = getDistCriteria(roleId);
  const distScores = distCriteria.map((c) => scores[c.id] ?? 0);
  const distAvg = average(distScores);
  const failReasons = [];

  const unanswered = distCriteria.filter((c) => !(scores[c.id] >= 1 && scores[c.id] <= 5));
  if (unanswered.length > 0) {
    failReasons.push('لم تُكمل جميع معايير التميز');
  }

  if (distAvg < 4.0) {
    failReasons.push(`متوسط معايير التميز (${distAvg.toFixed(1)}) أقل من المطلوب (4.0)`);
  }

  const countAtLeast4 = distScores.filter((s) => s >= 4).length;
  if (countAtLeast4 < 9) {
    failReasons.push(`يجب أن يكون 9 معايير تميز على الأقل بدرجة 4+ (حالياً: ${countAtLeast4})`);
  }

  const excellentCount = distScores.filter((s) => s === 5).length;
  if (excellentCount < 5) {
    failReasons.push(`يجب 5 معايير تميز على الأقل بدرجة 5 (حالياً: ${excellentCount})`);
  }

  const belowThree = distCriteria.filter((c) => (scores[c.id] ?? 0) < 3);
  if (belowThree.length > 0) {
    failReasons.push(`معيار/معايير تميز دون المستوى المقبول: ${belowThree.map((c) => c.name).join('، ')}`);
  }

  const distPass = failReasons.length === 0;

  return {
    distAvg: Math.round(distAvg * 10) / 10,
    distPass,
    failReasons,
    excellentCount,
  };
}

function findStrengths(criteriaWithScores, threshold = 4) {
  return criteriaWithScores
    .filter((c) => c.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

export function classify(scores, roleId, userName = '', { distinguishedEvaluated = true } = {}) {
  const role = ROLES[roleId];
  const baseLevel = role.baseLevel;

  const baseEval = evaluateBaseLevel(scores, roleId);
  const { baseAvg, basePass, failReasons: baseFailReasons } = baseEval;

  let distEval = null;
  let levelKey = 'needs_development';
  let classificationReasons = [...baseFailReasons];

  if (!basePass) {
    levelKey = 'needs_development';
    distinguishedEvaluated = false;
  } else if (!distinguishedEvaluated) {
    levelKey = 'success';
  } else {
    distEval = evaluateDistinguishedLevel(scores, roleId);
    if (distEval.distPass) {
      levelKey = 'distinguished';
    } else {
      levelKey = 'success';
      classificationReasons = [
        'حققت مستوى النجاح الأساسي، لكن معايير التميز تحتاج تعزيزاً:',
        ...distEval.failReasons,
      ];
    }
  }

  const meta = { ...role.levels[levelKey] };
  if (levelKey === 'needs_development' && baseFailReasons.length > 0) {
    meta.description =
      'لم تستوفِ معايير النجاح الأساسية. راجع أسباب التصنيف ونقاط الضعف أدناه.';
  }

  const evaluatedCriteria = getCriteriaForRole(roleId).filter((c) => {
    if (c.level === baseLevel) return true;
    return distinguishedEvaluated && c.level === 'distinguished';
  });

  const criteriaWithScores = evaluatedCriteria.map((c) => ({
    ...c,
    score: scores[c.id] ?? 0,
  }));

  const gaps = analyzeAllGaps(criteriaWithScores);
  const strengths = findStrengths(criteriaWithScores);

  const sectionsToShow = distinguishedEvaluated ? role.sections : [baseLevel];
  const levelBreakdown = sectionsToShow.map((lvl) => ({
    level: lvl,
    title: getSectionLabel(roleId, lvl),
    color: LEVELS[lvl]?.color ?? '#1e3a5f',
    average: Math.round(
      average(criteriaWithScores.filter((c) => c.level === lvl).map((c) => c.score)) * 10,
    ) / 10,
    criteria: criteriaWithScores.filter((c) => c.level === lvl),
  }));

  const ladder = [
    { key: 'needs_development', ...role.levels.needs_development },
    { key: 'success', ...role.levels.success },
    { key: 'distinguished', ...role.levels.distinguished },
  ];

  return {
    roleId,
    roleLabel: role.label,
    userName,
    levelKey,
    meta,
    ladder,
    currentLadderIndex: levelKey === 'needs_development' ? 0 : levelKey === 'success' ? 1 : 2,
    averages: {
      base: baseAvg,
      distinguished: distinguishedEvaluated && distEval ? distEval.distAvg : null,
    },
    excellentCount: distEval?.excellentCount ?? 0,
    basePass,
    distPass: distEval?.distPass ?? false,
    distinguishedEvaluated,
    classificationReasons,
    gaps,
    strengths,
    criteriaWithScores,
    levelBreakdown,
    nextGoal:
      levelKey === 'needs_development'
        ? role.levels.success.title
        : levelKey === 'success'
          ? role.levels.distinguished.title
          : null,
  };
}

export function completionPercent(scores, roleId, { includeDistinguished = true } = {}) {
  const role = ROLES[roleId];
  const levels = includeDistinguished ? role.sections : [role.baseLevel];
  const criteria = getCriteriaForRole(roleId).filter((c) => levels.includes(c.level));
  const answered = criteria.filter((c) => scores[c.id] >= 1 && scores[c.id] <= 5).length;
  return Math.round((answered / criteria.length) * 100);
}

export function isDistinguishedEligible(scores, roleId) {
  return evaluateBaseLevel(scores, roleId).basePass;
}
