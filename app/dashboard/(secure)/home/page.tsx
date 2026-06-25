import { HomeSettingsClient } from "@/components/dashboard/HomeSettingsClient";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings, normalizeContactSettings } from "@/lib/db";

export default async function DashboardHomePage() {
  await requirePermission("home");
  const settings = await getSiteSettings();
  const data = {
    home: settings.home,
    contact: normalizeContactSettings(settings.contact),
  };

  return (
    <HomeSettingsClient home={data.home} contact={data.contact} />
  );
}
