"use client";

import { useMemo, useState } from "react";
import type { DoctorNotificationRecord } from "@/lib/doctor-dashboard/service";
import { FormSubmitButton } from "@/components/doctor-dashboard/form-submit-button";

type NotificationsPageClientProps = {
  notifications: DoctorNotificationRecord[];
  markReadAction: (formData: FormData) => void | Promise<void>;
  markAllAction: () => void | Promise<void>;
};

export function NotificationsPageClient({
  notifications,
  markReadAction,
  markAllAction,
}: NotificationsPageClientProps) {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const filtered = useMemo(
    () => notifications.filter((item) => (tab === "unread" ? !item.is_read : true)),
    [notifications, tab],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
              Alerts
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
              Notifications
            </h2>
            <p className="mt-2 text-sm text-[#6d7f95]">
              Track clinical reminders, appointment activity, and follow-up prompts.
            </p>
          </div>

          <form action={markAllAction}>
            <FormSubmitButton
              label="Mark all as read"
              pendingLabel="Updating..."
              className="rounded-2xl border border-[#dce7f6] bg-white px-4 py-2.5 text-sm font-semibold text-[#24476e] transition hover:bg-[#f8fbff] disabled:opacity-60"
            />
          </form>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              tab === "all" ? "bg-[#2377e7] text-white" : "bg-[#eef5ff] text-[#2b63b8]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              tab === "unread" ? "bg-[#2377e7] text-white" : "bg-[#eef5ff] text-[#2b63b8]"
            }`}
          >
            Unread
          </button>
        </div>
      </section>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d7e4f5] bg-white px-6 py-12 text-center text-sm text-[#7f8da0]">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-[24px] border p-5 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.16)] ${
                notification.is_read
                  ? "border-[#e7edf5] bg-white"
                  : "border-[#d5e6ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)]"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#153a6b]">{notification.title}</h3>
                    {!notification.is_read ? (
                      <span className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2b63b8]">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d7f95]">
                    {notification.message}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[#94a0b0]">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                {!notification.is_read ? (
                  <form action={markReadAction}>
                    <input type="hidden" name="notificationId" value={notification.id} />
                    <FormSubmitButton
                      label="Mark as read"
                      pendingLabel="Saving..."
                      className="rounded-2xl bg-[#2377e7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b67cb] disabled:opacity-60"
                    />
                  </form>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
