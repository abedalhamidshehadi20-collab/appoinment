import { requirePermission } from "@/lib/auth";
import { getAllUsers, getCustomRoles } from "@/lib/db";
import { EmployeesPageClient } from "@/components/dashboard/EmployeesPageClient";

function getSuccessMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "1") return "Employee saved successfully.";
  return "";
}

function getErrorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "password_required") return "Password is required for new employees.";
  if (code === "invalid_role") return "The selected role is no longer available. Choose another role.";
  return "An error occurred. Please try again.";
}

function getDeleteMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "1") return "Employee deleted successfully.";
  return "";
}

type Props = {
  searchParams: Promise<{ success?: string; error?: string; deleted?: string }>;
};

export default async function EmployeesPage({ searchParams }: Props) {
  await requirePermission("employees");
  const query = await searchParams;
  const [employees, customRoles] = await Promise.all([
    getAllUsers(),
    getCustomRoles(),
  ]);

  const successMessage = getSuccessMessage(query.success) || getDeleteMessage(query.deleted);
  const errorMessage = getErrorMessage(query.error);

  return (
    <EmployeesPageClient
      employees={employees}
      customRoles={customRoles}
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
}
