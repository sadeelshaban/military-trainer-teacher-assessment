import { STORAGE_KEY } from '../config';

export function loadAssessments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAssessment(record) {
  const list = loadAssessments();
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return record;
}

export function getAssessmentById(id) {
  return loadAssessments().find((a) => a.id === id) ?? null;
}

export function getDashboardStats() {
  const list = loadAssessments();

  const levelCounts = {
    needs_development: 0,
    success: 0,
    distinguished: 0,
  };

  const roleCounts = { trainer: 0, teacher: 0 };
  let totalBase = 0;
  let totalDist = 0;

  for (const item of list) {
    levelCounts[item.result.levelKey] = (levelCounts[item.result.levelKey] ?? 0) + 1;
    roleCounts[item.roleId] = (roleCounts[item.roleId] ?? 0) + 1;
    totalBase += item.result.averages.base;
    totalDist += item.result.averages.distinguished;
  }

  const count = list.length;

  return {
    total: count,
    levelCounts,
    roleCounts,
    avgBase: count ? Math.round((totalBase / count) * 10) / 10 : 0,
    avgDist: count ? Math.round((totalDist / count) * 10) / 10 : 0,
    levelPercentages: {
      needs_development: count ? Math.round((levelCounts.needs_development / count) * 100) : 0,
      success: count ? Math.round((levelCounts.success / count) * 100) : 0,
      distinguished: count ? Math.round((levelCounts.distinguished / count) * 100) : 0,
    },
    rolePercentages: {
      trainer: count ? Math.round((roleCounts.trainer / count) * 100) : 0,
      teacher: count ? Math.round((roleCounts.teacher / count) * 100) : 0,
    },
    recent: list.slice(0, 5),
  };
}

export function createAssessmentRecord(name, roleId, scores, result) {
  return {
    id: crypto.randomUUID(),
    name,
    roleId,
    scores,
    result,
    createdAt: new Date().toISOString(),
  };
}
