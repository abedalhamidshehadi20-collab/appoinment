"use client";

import { useState } from "react";
import { User } from "@/lib/db";
import { getRoleLabel } from "@/lib/rbac";
import { EmployeeFormModal } from "@/components/dashboard/EmployeeFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteEmployeeAction } from "@/app/dashboard/actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

type EmployeesPageClientProps = {
  employees: User[];
  successMessage?: string;
  errorMessage?: string;
};

export function EmployeesPageClient({
  employees,
  successMessage,
  errorMessage,
}: EmployeesPageClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: User) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteClick = (employee: User) => {
    setDeleteTarget(employee);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", deleteTarget.id);
    await deleteEmployeeAction(formData);
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <article className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Employees</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage employee accounts and their access permissions
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f68cb]"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        {successMessage && (
          <p className="mb-4 rounded-lg border border-[#bde5cb] bg-[#ecfff3] px-4 py-3 text-sm font-medium text-[#145f39]">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#991b1b]">
            {errorMessage}
          </p>
        )}

        {employees.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No employees yet. Click &quot;Add Employee&quot; to create one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Username
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {employee.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {employee.username}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          employee.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {getRoleLabel(employee.role)}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {employee.created_at
                        ? new Date(employee.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[var(--brand)]"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(employee)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        employee={selectedEmployee}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
