import { NewsManagementClient } from "@/components/dashboard/NewsManagementClient";
import { requirePermission } from "@/lib/auth";
import { getAllNews } from "@/lib/db";

export default async function DashboardNewsPage() {
  await requirePermission("news");
  const news = await getAllNews();

  return <NewsManagementClient news={news} />;
}
