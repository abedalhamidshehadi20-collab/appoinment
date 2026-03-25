import { Permission } from './db';

export type RolePreset = {
  label: string;
  permissions: Permission[];
};

export const ROLE_PRESETS: Record<string, RolePreset> = {
  admin: {
    label: 'Admin',
    permissions: ['all'],
  },
  blog_manager: {
    label: 'Blog Manager',
    permissions: ['blogs'],
  },
  news_manager: {
    label: 'News Manager',
    permissions: ['news'],
  },
  content_manager: {
    label: 'Content Manager',
    permissions: ['blogs', 'news'],
  },
  patient_manager: {
    label: 'Patient Manager',
    permissions: ['patients', 'interests'],
  },
  doctor_manager: {
    label: 'Doctor Manager',
    permissions: ['projects'],
  },
  receptionist: {
    label: 'Receptionist',
    permissions: ['patients', 'interests', 'contacts'],
  },
};

export function getRolePermissions(role: string): Permission[] {
  const preset = ROLE_PRESETS[role];
  if (preset) {
    return preset.permissions;
  }
  return [];
}

export function getRoleLabel(role: string): string {
  const preset = ROLE_PRESETS[role];
  if (preset) {
    return preset.label;
  }
  return role;
}

export function getAllRoles(): { value: string; label: string }[] {
  return Object.entries(ROLE_PRESETS).map(([value, preset]) => ({
    value,
    label: preset.label,
  }));
}
