import { redirect } from "next/navigation";
import { DoctorsManagementClient } from "@/components/dashboard/DoctorsManagementClient";
import { requirePermission } from "@/lib/auth";
import { getAllDoctorCredentials, getAllDoctors } from "@/lib/db";

function getCredentialSuccessMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "1") return "Doctor login saved successfully.";
  return "";
}

function getCredentialErrorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "password_required") return "Password is required when creating a doctor email.";
  if (code === "email_taken") return "This email is already being used by another doctor.";
  if (code === "missing_fields") return "Doctor email and doctor selection are required.";
  if (code === "doctor_credentials_missing") return "Run the doctor credentials SQL file first, then try again.";
  if (code === "doctor_credentials_access_denied") return "Doctor credentials table exists, but this app cannot write to it yet. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the server.";
  if (code === "doctor_scope") return "Doctor accounts can only access their own profile.";
  return "Unable to save the doctor email right now.";
}

function getDoctorSaveErrorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "slug_taken") return "This doctor slug is already being used. Change the slug or the doctor title and try again.";
  return "Unable to save the doctor profile right now.";
}

type Props = {
  searchParams: Promise<{
    credential_success?: string;
    credential_error?: string;
    save_error?: string;
  }>;
};

export default async function DashboardProjectsPage({ searchParams }: Props) {
  const user = await requirePermission("projects");

  const query = await searchParams;
  const [doctors, credentials] = await Promise.all([
    getAllDoctors(),
    getAllDoctorCredentials(),
  ]);

  if (user.role === "doctor" && !user.doctorId) {
    redirect("/doctor-login?error=1");
  }

  const visibleDoctors =
    user.role === "doctor"
      ? doctors.filter((doctor) => doctor.id === user.doctorId)
      : doctors;
  const visibleCredentials =
    user.role === "doctor"
      ? credentials.filter((credential) => credential.doctor_id === user.doctorId)
      : credentials;

  return (
    <DoctorsManagementClient
      doctors={visibleDoctors}
      credentials={visibleCredentials}
      successMessage={getCredentialSuccessMessage(query.credential_success)}
      errorMessage={
        getCredentialErrorMessage(query.credential_error) ||
        getDoctorSaveErrorMessage(query.save_error)
      }
      allowCreate={user.role !== "doctor"}
      allowDelete={user.role !== "doctor"}
    />
  );
}
