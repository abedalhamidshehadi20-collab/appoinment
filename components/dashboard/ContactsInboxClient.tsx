"use client";

import { useState } from "react";
import type { Contact } from "@/lib/db";
import {
  ArrowUpDown,
  ChevronDown,
  Clock3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Search,
  X,
} from "lucide-react";

type ContactsInboxClientProps = {
  contacts: Contact[];
};

type TabFilter = "all" | "phone" | "recent";
type DateFilter = "all" | "today" | "week" | "month";
type SortOrder = "newest" | "oldest";

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function isWithinDateFilter(value: string, filter: DateFilter) {
  if (filter === "all") {
    return true;
  }

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) {
    return false;
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  if (filter === "today") {
    return createdAt >= todayStart;
  }

  if (filter === "week") {
    return createdAt >= weekStart;
  }

  return createdAt >= monthStart;
}

export function ContactsInboxClient({
  contacts,
}: ContactsInboxClientProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const filteredContacts = contacts
    .filter((contact) => {
      if (activeTab === "phone" && !contact.phone?.trim()) {
        return false;
      }

      if (activeTab === "recent") {
        const createdAt = new Date(contact.created_at);
        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }

        const recentThreshold = new Date();
        recentThreshold.setDate(recentThreshold.getDate() - 7);

        if (createdAt < recentThreshold) {
          return false;
        }
      }

      if (!isWithinDateFilter(contact.created_at, dateFilter)) {
        return false;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return true;
      }

      const haystack = [
        contact.name,
        contact.email,
        contact.phone,
        contact.message,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((left, right) => {
      const leftTime = new Date(left.created_at).getTime();
      const rightTime = new Date(right.created_at).getTime();

      const safeLeftTime = Number.isNaN(leftTime) ? 0 : leftTime;
      const safeRightTime = Number.isNaN(rightTime) ? 0 : rightTime;

      return sortOrder === "newest"
        ? safeRightTime - safeLeftTime
        : safeLeftTime - safeRightTime;
    });

  const selectedContact =
    contacts.find((contact) => contact.id === selectedContactId) ?? null;

  const tabButtonClassName = (value: TabFilter) =>
    `inline-flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-semibold transition ${
      activeTab === value
        ? "border-[#f0b44d] text-[#c78818]"
        : "border-transparent text-[#7b8797] hover:text-[#425066]"
    }`;

  return (
    <div className="space-y-6">
      <article className="card overflow-hidden rounded-[30px] border border-[#e8edf5] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#96a0af]">
                Contact Form Inbox
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                Contact Form Submissions
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Incoming messages from the public contact page.
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
                {filteredContacts.length} message{filteredContacts.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSortOrder((current) =>
                  current === "newest" ? "oldest" : "newest",
                )
              }
              className="inline-flex items-center gap-2 rounded-2xl border border-[#e7ebf3] bg-white px-4 py-3 text-sm font-semibold text-[#64748b] shadow-sm transition hover:border-[#f0d49f] hover:text-[#b7791f]"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-b border-[#edf1f6]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={tabButtonClassName("all")}
            >
              <MessageSquare className="h-4 w-4" />
              All Messages
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("phone")}
              className={tabButtonClassName("phone")}
            >
              <Phone className="h-4 w-4" />
              With Phone
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={tabButtonClassName("recent")}
            >
              <Clock3 className="h-4 w-4" />
              Recent
            </button>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3b3]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search messages, email, phone"
                className="h-12 w-full rounded-2xl border border-[#e7ebf3] bg-white pl-11 pr-4 text-sm text-[var(--brand-deep)] shadow-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#f0d49f] focus:ring-4 focus:ring-[#fff3dc]"
              />
            </label>

            <label className="relative block">
              <select
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value as DateFilter)}
                className="h-12 w-full appearance-none rounded-2xl border border-[#e7ebf3] bg-white px-4 pr-11 text-sm text-[#526072] shadow-sm outline-none transition focus:border-[#f0d49f] focus:ring-4 focus:ring-[#fff3dc]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3b3]" />
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {filteredContacts.length === 0 ? (
              <article className="rounded-[24px] border border-dashed border-[#e3e8f0] bg-[#fcfdff] px-6 py-10 text-center">
                <p className="text-sm font-medium text-[#64748b]">
                  No messages match the current search or filter.
                </p>
              </article>
            ) : (
              filteredContacts.map((contact) => (
                <article
                  key={contact.id}
                  className="flex gap-4 rounded-[24px] border border-[#f1e7d7] bg-white px-4 py-4 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.35)] transition hover:border-[#edc47d] hover:shadow-[0_18px_34px_-26px_rgba(15,23,42,0.28)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#eef7ff] text-[var(--brand)]">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-[#1f2937]">
                            {contact.name}
                          </p>
                          <span className="rounded-full bg-[#eaf4ff] px-2.5 py-1 text-xs font-semibold text-[var(--brand)]">
                            Message
                          </span>
                          {contact.phone?.trim() ? (
                            <span className="rounded-full bg-[#fff3dc] px-2.5 py-1 text-xs font-semibold text-[#c78818]">
                              Phone
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#728093]">
                          <span>{contact.email}</span>
                          {contact.phone?.trim() ? <span>{contact.phone}</span> : null}
                        </div>
                      </div>

                      <p className="text-sm text-[#8c97a6]">
                        {formatTimestamp(contact.created_at)}
                      </p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#526072]">
                      {contact.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedContactId(contact.id)}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#eef1f5] bg-white text-[#98a3b3] transition hover:border-[#edc47d] hover:text-[#c78818]"
                    title="View message"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      </article>

      {selectedContact ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close message details"
            onClick={() => setSelectedContactId(null)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-[#ece3d3] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#f3ede2] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#fff3dc] p-3 text-[#c78818]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c78818]">
                    Message Details
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    {selectedContact.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Full contact submission details from the public message inbox.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContactId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ece3d3] bg-white text-[var(--brand-deep)] transition hover:bg-[#fffaf1]"
                title="Close message details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Email
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedContact.email}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Phone
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedContact.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                    Submitted
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                    {formatTimestamp(selectedContact.created_at)}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                    Message
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#445164]">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
