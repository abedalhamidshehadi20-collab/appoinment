import { requirePermission } from "@/lib/auth";
import { getAllUsers } from "@/lib/db";
import { EmployeesPageClient } from "@/components/dashboard/EmployeesPageClient";

function getSuccessMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "1") return "Employee saved successfully.";
  return "";
}

function getErrorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "password_required") return "Password is required for new employees.";
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
  const employees = await getAllUsers();

  const successMessage = getSuccessMessage(query.success) || getDeleteMessage(query.deleted);
  const errorMessage = getErrorMessage(query.error);

  return (
    <EmployeesPageClient
      employees={employees}
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
}
