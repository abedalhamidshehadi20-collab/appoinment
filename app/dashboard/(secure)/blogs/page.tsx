import { deleteBlogAction, saveBlogAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getAllBlogs } from "@/lib/db";

function BlogForm({
  item,
}: {
  item?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    published_at: string;
    tags: string[];
  };
}) {
  return (
    <form action={saveBlogAction} className="grid gap-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input name="title" required defaultValue={item?.title} placeholder="Title" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="slug" defaultValue={item?.slug} placeholder="Slug (optional)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="author" defaultValue={item?.author} placeholder="Author" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="publishedAt" defaultValue={item?.published_at} placeholder="Published date (YYYY-MM-DD)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="excerpt" required defaultValue={item?.excerpt} placeholder="Excerpt" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="content" required defaultValue={item?.content} rows={5} placeholder="Content" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="tags" defaultValue={item?.tags?.join("\n")} rows={3} placeholder="Tags (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <button className="button button-primary w-fit">{item ? "Save Blog" : "Add Blog"}</button>
    </form>
  );
}

export default async function DashboardBlogsPage() {
  await requirePermission("blogs");
  const blogs = await getAllBlogs();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create Blog Post</h1>
        <div className="mt-4"><BlogForm /></div>
      </article>

      {blogs.map((post) => (
        <article key={post.id} className="card p-6">
          <h2 className="text-lg font-bold">{post.title}</h2>
          <div className="mt-3"><BlogForm item={post} /></div>
          <form action={deleteBlogAction} className="mt-2">
            <input type="hidden" name="id" value={post.id} />
            <button className="button button-secondary text-xs">Delete</button>
          </form>
        </article>
      ))}
    </>
  );
}
