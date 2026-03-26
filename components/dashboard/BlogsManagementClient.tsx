"use client";

import { useState } from "react";
import { deleteBlogAction } from "@/app/dashboard/actions";
import { BlogForm } from "@/components/dashboard/BlogForm";
import type { Blog } from "@/lib/db";
import { formatPublishedDate } from "@/lib/published-date";
import { FileText, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type BlogsManagementClientProps = {
  blogs: Blog[];
};

export function BlogsManagementClient({
  blogs,
}: BlogsManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const haystack = [
      blog.title,
      blog.slug,
      blog.author,
      blog.excerpt,
      blog.content,
      blog.published_at,
      ...(blog.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const selectedBlog = blogs.find((blog) => blog.id === selectedBlogId) ?? null;

  return (
    <div className="space-y-6">
      <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Blogs
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
              Blog Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage blog posts with the same structured layout and editing flow used in the doctor section.
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
              {blogs.length} blog post{blogs.length === 1 ? "" : "s"} in library
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-16 lg:pt-20">
            <button
              type="button"
              onClick={() => {
                setSelectedBlogId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              <Plus className="h-4 w-4" />
              Add Blog
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                Blog Directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Search the post list and open any blog entry for editing.
              </p>
            </div>

            <div className="lg:w-[360px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search blogs"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[22px] border border-[#edf2fb]">
            <table className="min-w-[1100px] w-full border-collapse">
              <thead>
                <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <th className="px-5 py-4">Post</th>
                  <th className="px-4 py-4">Author</th>
                  <th className="px-4 py-4">Published</th>
                  <th className="px-4 py-4">Tags</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No blog posts match this search.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => {
                    const isSelected = blog.id === selectedBlogId;
                    const tagPreview = blog.tags?.slice(0, 3) ?? [];

                    return (
                      <tr
                        key={blog.id}
                        className={`border-t border-[#eef2f7] align-top transition ${
                          isSelected ? "bg-[#f8fbff]" : "bg-white hover:bg-[#fbfdff]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="max-w-[420px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {blog.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {blog.slug || "-"}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                              {blog.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {blog.author || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {formatPublishedDate(blog.published_at)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-[240px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {blog.tags?.length ?? 0} tag{blog.tags?.length === 1 ? "" : "s"}
                            </p>
                            {tagPreview.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {tagPreview.map((tag, index) => (
                                  <span
                                    key={`${blog.id}-${index}`}
                                    className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-medium text-[var(--brand-deep)]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {(blog.tags?.length ?? 0) > tagPreview.length ? (
                                  <span className="rounded-full bg-[#f3f6fb] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                                    +{(blog.tags?.length ?? 0) - tagPreview.length} more
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-[var(--muted)]">No tags listed.</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateForm(false);
                                setSelectedBlogId(blog.id);
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isSelected
                                  ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
                                  : "border-[#e5e7eb] bg-white text-[var(--muted)] hover:border-[#bfd5ff] hover:text-[var(--brand)]"
                              }`}
                              title="Edit Blog"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <form action={deleteBlogAction}>
                              <input type="hidden" name="id" value={blog.id} />
                              <button
                                type="submit"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[var(--muted)] transition hover:border-[#fecaca] hover:text-[#dc2626]"
                                title="Delete Blog"
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
            aria-label="Close create blog form"
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
                    Create Blog Post
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Add a blog post with the same full-screen editing flow used for doctor profiles.
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
              <BlogForm
                submitLabel="Add Blog"
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </section>
        </div>
      ) : null}

      {selectedBlog ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close update blog form"
            onClick={() => setSelectedBlogId(null)}
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
                    Update Blog Post
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Edit {selectedBlog.title} without changing the blog content structure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlogId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <BlogForm
                blog={selectedBlog}
                submitLabel="Save Blog"
                onCancel={() => setSelectedBlogId(null)}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
