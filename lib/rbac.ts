import type { CustomRole, Permission } from './db';

export type RolePreset = {
  label: string;
  permissions: Permission[];
};

export type RoleOption = {
  value: string;
  label: string;
  permissions: Permission[];
  isCustom?: boolean;
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

export const PERMISSION_OPTIONS: Array<{
  value: Permission;
  label: string;
  description: string;
}> = [
  { value: 'all', label: 'Full Access', description: 'Can access every dashboard section.' },
  { value: 'home', label: 'Home', description: 'Can manage homepage content.' },
  { value: 'about', label: 'About', description: 'Can edit the about page content.' },
  { value: 'services', label: 'Services', description: 'Can manage services content.' },
  { value: 'projects', label: 'Doctors', description: 'Can manage doctor profiles.' },
  { value: 'blogs', label: 'Blogs', description: 'Can create, edit, and delete blog content.' },
  { value: 'news', label: 'News', description: 'Can create, edit, and delete news content.' },
  { value: 'contacts', label: 'Messages', description: 'Can access contact messages.' },
  { value: 'interests', label: 'Appointments', description: 'Can access appointment requests.' },
  { value: 'patients', label: 'Patients', description: 'Can manage patient records.' },
  { value: 'employees', label: 'Employees', description: 'Can manage employee accounts and roles.' },
];

function toTitleCase(value: string) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeRoleValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_+/g, '_');
}

function getRoleMap(customRoles: CustomRole[] = []) {
  const builtInRoles: RoleOption[] = Object.entries(ROLE_PRESETS).map(([value, preset]) => ({
    value,
    label: preset.label,
    permissions: preset.permissions,
    isCustom: false,
  }));

  const customRoleEntries: RoleOption[] = customRoles
    .filter((role) => role.value && role.label && role.permissions.length > 0)
    .filter((role) => !(role.value in ROLE_PRESETS))
    .map((role) => ({
      value: role.value,
      label: role.label,
      permissions: role.permissions,
      isCustom: true,
    }));

  return new Map(
    [...builtInRoles, ...customRoleEntries].map((role) => [role.value, role]),
  );
}

export function getRolePermissions(role: string, customRoles: CustomRole[] = []): Permission[] {
  const match = getRoleMap(customRoles).get(role);
  return match?.permissions ?? [];
}

export function getRoleLabel(role: string, customRoles: CustomRole[] = []): string {
  const match = getRoleMap(customRoles).get(role);
  if (match) {
    return match.label;
  }

  return toTitleCase(role);
}

export function getAllRoles(customRoles: CustomRole[] = []): RoleOption[] {
  return Array.from(getRoleMap(customRoles).values());
}
