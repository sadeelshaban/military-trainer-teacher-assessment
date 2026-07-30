import {
  ROLES,
  getCriteriaForRole,
  getSectionLabel,
  LEVELS,
} from '../data/criteria';
import { analyzeAllGaps } from './gapAnalysis';

const TRAINER_CRITICAL = ['t2', 't3', 't6', 't12'];
const TEACHER_CRITICAL = ['te1', 'te3', 'te8'];

function average(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function criticalPass(scores, criticalIds, min = 3) {
  return criticalIds.every((id) => (scores[id] ?? 0) >= min);
}

function findStrengths(criteriaWithScores, threshold = 4) {
  return criteriaWithScores
    .filter((c) => c.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

export function classify(scores, roleId, userName = '') {
  const role = ROLES[roleId];
  const baseLevel = role.baseLevel;
  const relevantCriteria = getCriteriaForRole(roleId);

  const baseCriteria = relevantCriteria.filter((c) => c.level === baseLevel);
  const distCriteria = relevantCriteria.filter((c) => c.level === 'distinguished');

  const baseScores = baseCriteria.map((c) => scores[c.id] ?? 0);
  const distScores = distCriteria.map((c) => scores[c.id] ?? 0);

  const baseAvg = average(baseScores);
  const distAvg = average(distScores);

  const criticalIds = roleId === 'trainer' ? TRAINER_CRITICAL : TEACHER_CRITICAL;
  const basePass = baseAvg >= 3.5 && criticalPass(scores, criticalIds, 3);

  const excellentCount = distScores.filter((s) => s === 5).length;
  const distPass = distAvg >= 4.0 && excellentCount >= 8;

  let levelKey = 'needs_development';
  if (basePass && distPass) levelKey = 'distinguished';
  else if (basePass) levelKey = 'success';

  const meta = role.levels[levelKey];

  const criteriaWithScores = relevantCriteria.map((c) => ({
    ...c,
    score: scores[c.id] ?? 0,
  }));

  const gaps = analyzeAllGaps(criteriaWithScores);
  const strengths = findStrengths(criteriaWithScores);

  const levelBreakdown = role.sections.map((lvl) => ({
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
      base: Math.round(baseAvg * 10) / 10,
      distinguished: Math.round(distAvg * 10) / 10,
    },
    excellentCount,
    basePass,
    distPass,
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

export function completionPercent(scores, roleId) {
  const criteria = getCriteriaForRole(roleId);
  const answered = criteria.filter(
    (c) => scores[c.id] >= 1 && scores[c.id] <= 5,
  ).length;
  return Math.round((answered / criteria.length) * 100);
}
