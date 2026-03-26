"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  createCustomRoleAction,
  saveEmployeeAction,
} from "@/app/dashboard/actions";
import { Modal } from "@/components/ui/Modal";
import { CustomRole, Permission, User } from "@/lib/db";
import {
  PERMISSION_OPTIONS,
  getAllRoles,
  getRoleLabel,
} from "@/lib/rbac";

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  employee?: User | null;
  customRoles: CustomRole[];
  onCustomRoleCreated: (role: CustomRole) => void;
};

const CREATE_ROLE_VALUE = "__create_role__";

export function EmployeeFormModal({
  isOpen,
  onClose,
  employee,
  customRoles,
  onCustomRoleCreated,
}: EmployeeFormModalProps) {
  const isEditing = !!employee;
  const [roleValue, setRoleValue] = useState(employee?.role || "blog_manager");
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [roleError, setRoleError] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);

  const availableRoles = useMemo(() => {
    const roles = getAllRoles(customRoles);

    if (roleValue && !roles.some((role) => role.value === roleValue)) {
      return [
        ...roles,
        {
          value: roleValue,
          label: getRoleLabel(roleValue, customRoles),
          permissions: [],
          isCustom: true,
        },
      ];
    }

    return roles;
  }, [customRoles, roleValue]);

  const handleClose = () => {
    setIsCreateRoleOpen(false);
    setRoleError("");
    onClose();
  };

  const handleRoleChange = (value: string) => {
    if (value === CREATE_ROLE_VALUE) {
      setRoleError("");
      setRoleName("");
      setSelectedPermissions([]);
      setIsCreateRoleOpen(true);
      return;
    }

    setRoleValue(value);
  };

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((current) => {
      if (permission === "all") {
        return current.includes("all") ? [] : ["all"];
      }

      const next = current.filter((item) => item !== "all");
      if (next.includes(permission)) {
        return next.filter((item) => item !== permission);
      }

      return [...next, permission];
    });
  };

  const handleCreateRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingRole(true);
    setRoleError("");

    const result = await createCustomRoleAction({
      label: roleName,
      permissions: selectedPermissions,
    });

    setIsSavingRole(false);

    if (!result.ok) {
      setRoleError(result.error);
      return;
    }

    onCustomRoleCreated(result.role);
    setRoleValue(result.role.value);
    setRoleName("");
    setSelectedPermissions([]);
    setIsCreateRoleOpen(false);
  };

  const isAllPermissionsSelected = selectedPermissions.includes("all");

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditing ? "Edit Employee" : "Add Employee"}
      >
        <form action={saveEmployeeAction} className="grid gap-4">
          {employee ? <input type="hidden" name="id" value={employee.id} /> : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              required
              defaultValue={employee?.name}
              placeholder="Full name"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={employee?.email}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              required
              defaultValue={employee?.username}
              placeholder="username"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password {isEditing ? "(leave blank to keep current)" : ""}
            </label>
            <input
              type="password"
              name="password"
              required={!isEditing}
              placeholder={isEditing ? "Enter new password" : "Password"}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              required
              value={roleValue}
              onChange={(event) => handleRoleChange(event.target.value)}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
              <option value={CREATE_ROLE_VALUE}>+ Create Role</option>
            </select>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Choose an existing role or create a custom one with specific permissions.
            </p>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f68cb]"
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCreateRoleOpen}
        onClose={() => {
          setIsCreateRoleOpen(false);
          setRoleError("");
        }}
        title="Create Role"
      >
        <form onSubmit={handleCreateRole} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              placeholder="e.g. Blogger"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="grid max-h-[280px] gap-2 overflow-y-auto rounded-xl border border-[var(--line)] p-3">
              {PERMISSION_OPTIONS.map((permission) => {
                const checked = selectedPermissions.includes(permission.value);
                const disabled =
                  permission.value !== "all" && isAllPermissionsSelected;

                return (
                  <label
                    key={permission.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition ${
                      checked
                        ? "border-[#bfd5ff] bg-[#eef4ff]"
                        : "border-[#eef2f7] bg-white hover:border-[#d8e5fb]"
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => handlePermissionToggle(permission.value)}
                      className="mt-1"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[var(--brand-deep)]">
                        {permission.label}
                      </span>
                      <span className="block text-xs text-[var(--muted)]">
                        {permission.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {roleError ? (
            <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
              {roleError}
            </p>
          ) : null}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsCreateRoleOpen(false);
                setRoleError("");
              }}
              className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingRole}
              className="flex-1 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f68cb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingRole ? "Saving..." : "Create Role"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
