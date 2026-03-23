import { deleteNewsAction, saveNewsAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getAllNews } from "@/lib/db";

function NewsForm({
  item,
}: {
  item?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    source: string;
    published_at: string;
  };
}) {
  return (
    <form action={saveNewsAction} className="grid gap-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input name="title" required defaultValue={item?.title} placeholder="Title" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="slug" defaultValue={item?.slug} placeholder="Slug (optional)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="source" defaultValue={item?.source} placeholder="Source" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="publishedAt" defaultValue={item?.published_at} placeholder="Published date (YYYY-MM-DD)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="excerpt" required defaultValue={item?.excerpt} placeholder="Excerpt" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="content" required defaultValue={item?.content} rows={5} placeholder="Content" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <button className="button button-primary w-fit">{item ? "Save News" : "Add News"}</button>
    </form>
  );
}

export default async function DashboardNewsPage() {
  await requirePermission("news");
  const news = await getAllNews();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create News Item</h1>
        <div className="mt-4"><NewsForm /></div>
      </article>

      {news.map((item) => (
        <article key={item.id} className="card p-6">
          <h2 className="text-lg font-bold">{item.title}</h2>
          <div className="mt-3"><NewsForm item={item} /></div>
          <form action={deleteNewsAction} className="mt-2">
            <input type="hidden" name="id" value={item.id} />
            <button className="button button-secondary text-xs">Delete</button>
          </form>
        </article>
      ))}
    </>
  );
}
