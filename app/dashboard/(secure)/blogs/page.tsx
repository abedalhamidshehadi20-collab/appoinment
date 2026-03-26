import { BlogsManagementClient } from "@/components/dashboard/BlogsManagementClient";
import { requirePermission } from "@/lib/auth";
import { getAllBlogs } from "@/lib/db";

export default async function DashboardBlogsPage() {
  await requirePermission("blogs");
  const blogs = await getAllBlogs();

  return <BlogsManagementClient blogs={blogs} />;
}
