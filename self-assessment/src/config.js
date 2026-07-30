export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
export const STORAGE_KEY = 'military_assessments_v3';
export const LEGACY_STORAGE_KEY = 'military_assessments_v1';

export function isAdminConfigured() {
  return Boolean(ADMIN_PASSWORD);
}

export function isRemoteStorageConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
