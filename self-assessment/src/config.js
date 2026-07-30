export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
export const STORAGE_KEY = 'military_assessments_v3';
export const LEGACY_STORAGE_KEY = 'military_assessments_v1';

export function isAdminConfigured() {
  return Boolean(ADMIN_PASSWORD);
}
