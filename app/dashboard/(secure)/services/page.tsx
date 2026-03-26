import { ServicesManagementClient } from "@/components/dashboard/ServicesManagementClient";
import { requirePermission } from "@/lib/auth";
import { getAllServices } from "@/lib/db";

export default async function DashboardServicesPage() {
  await requirePermission("services");
  const services = await getAllServices();

  return <ServicesManagementClient services={services} />;
}
