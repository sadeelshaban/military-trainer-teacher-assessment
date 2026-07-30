import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '../config';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

function rowToRecord(row) {
  return {
    id: row.id,
    name: row.name,
    roleId: row.role_id,
    scores: row.scores,
    result: row.result,
    createdAt: row.created_at,
  };
}

function recordToRow(record) {
  return {
    id: record.id,
    name: record.name,
    role_id: record.roleId,
    scores: record.scores,
    result: record.result,
    created_at: record.createdAt,
  };
}

export function migrateStorage() {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem('military_assessments_v2');
}

function loadAssessmentsLocal() {
  migrateStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAssessmentLocal(record) {
  const list = loadAssessmentsLocal();
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return record;
}

export async function loadAssessments() {
  if (!isSupabaseConfigured()) {
    return loadAssessmentsLocal();
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(rowToRecord);
}

export async function saveAssessment(record) {
  if (!isSupabaseConfigured()) {
    return saveAssessmentLocal(record);
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assessments')
    .insert(recordToRow(record))
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToRecord(data);
}

export async function clearAllAssessments() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);

  if (!isSupabaseConfigured()) {
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAssessmentById(id) {
  const list = await loadAssessments();
  return list.find((a) => a.id === id) ?? null;
}

export function getDashboardStats(list) {
  const levelCounts = {
    needs_development: 0,
    success: 0,
    distinguished: 0,
  };

  const roleCounts = { trainer: 0, teacher: 0 };
  let totalBase = 0;
  let totalDist = 0;
  let distCount = 0;

  for (const item of list) {
    levelCounts[item.result.levelKey] = (levelCounts[item.result.levelKey] ?? 0) + 1;
    roleCounts[item.roleId] = (roleCounts[item.roleId] ?? 0) + 1;
    totalBase += item.result.averages.base;
    if (item.result.distinguishedEvaluated && item.result.averages.distinguished != null) {
      totalDist += item.result.averages.distinguished;
      distCount += 1;
    }
  }

  const count = list.length;

  return {
    total: count,
    levelCounts,
    roleCounts,
    avgBase: count ? Math.round((totalBase / count) * 10) / 10 : 0,
    avgDist: distCount ? Math.round((totalDist / distCount) * 10) / 10 : 0,
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

migrateStorage();
