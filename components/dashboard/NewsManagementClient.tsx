"use client";

import { useState } from "react";
import { deleteNewsAction } from "@/app/dashboard/actions";
import { NewsForm } from "@/components/dashboard/NewsForm";
import type { News } from "@/lib/db";
import { formatPublishedDate } from "@/lib/published-date";
import { FileText, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type NewsManagementClientProps = {
  news: News[];
};

export function NewsManagementClient({
  news,
}: NewsManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const filteredNews = news.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const haystack = [
      item.title,
      item.slug,
      item.source,
      item.excerpt,
      item.content,
      item.published_at,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const selectedNews = news.find((item) => item.id === selectedNewsId) ?? null;

  return (
    <div className="space-y-6">
      <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              News
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
              News Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage news items with the same structured layout and editing flow used in the doctor section.
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
              {news.length} news item{news.length === 1 ? "" : "s"} in library
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-16 lg:pt-20">
            <button
              type="button"
              onClick={() => {
                setSelectedNewsId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              <Plus className="h-4 w-4" />
              Add News
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                News Directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Search the news list and open any item for editing.
              </p>
            </div>

            <div className="lg:w-[360px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search news"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[22px] border border-[#edf2fb]">
            <table className="min-w-[1080px] w-full border-collapse">
              <thead>
                <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <th className="px-5 py-4">Item</th>
                  <th className="px-4 py-4">Source</th>
                  <th className="px-4 py-4">Published</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No news items match this search.
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => {
                    const isSelected = item.id === selectedNewsId;

                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-[#eef2f7] align-top transition ${
                          isSelected ? "bg-[#f8fbff]" : "bg-white hover:bg-[#fbfdff]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="max-w-[500px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {item.slug || "-"}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                              {item.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {item.source || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {formatPublishedDate(item.published_at)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateForm(false);
                                setSelectedNewsId(item.id);
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isSelected
                                  ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
                                  : "border-[#e5e7eb] bg-white text-[var(--muted)] hover:border-[#bfd5ff] hover:text-[var(--brand)]"
                              }`}
                              title="Edit News"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <form action={deleteNewsAction}>
                              <input type="hidden" name="id" value={item.id} />
                              <button
                                type="submit"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[var(--muted)] transition hover:border-[#fecaca] hover:text-[#dc2626]"
                                title="Delete News"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      {showCreateForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close create news form"
            onClick={() => setShowCreateForm(false)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Create Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Create News Item
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Add a news item with the same full-screen editing flow used for doctor profiles.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <NewsForm
                submitLabel="Add News"
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </section>
        </div>
      ) : null}

      {selectedNews ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close update news form"
            onClick={() => setSelectedNewsId(null)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Update Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Update News Item
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Edit {selectedNews.title} without changing the news content structure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNewsId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <NewsForm
                news={selectedNews}
                submitLabel="Save News"
                onCancel={() => setSelectedNewsId(null)}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
