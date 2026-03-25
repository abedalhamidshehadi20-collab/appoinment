"use client";

import { Modal } from "@/components/ui/Modal";
import { saveEmployeeAction } from "@/app/dashboard/actions";
import { getAllRoles } from "@/lib/rbac";
import { User } from "@/lib/db";

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  employee?: User | null;
};

export function EmployeeFormModal({
  isOpen,
  onClose,
  employee,
}: EmployeeFormModalProps) {
  const roles = getAllRoles();
  const isEditing = !!employee;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Employee" : "Add Employee"}
    >
      <form action={saveEmployeeAction} className="grid gap-4">
        {employee && <input type="hidden" name="id" value={employee.id} />}

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
            Password {isEditing && "(leave blank to keep current)"}
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
            defaultValue={employee?.role || "blog_manager"}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
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
  );
}
