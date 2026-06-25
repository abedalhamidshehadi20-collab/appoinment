import { ContactsInboxClient } from "@/components/dashboard/ContactsInboxClient";
import { requirePermission } from "@/lib/auth";
import { getAllContacts } from "@/lib/db";

export default async function DashboardContactsPage() {
  await requirePermission("contacts");
  const contacts = await getAllContacts();

  return <ContactsInboxClient contacts={contacts} />;
}
