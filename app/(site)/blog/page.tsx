import Link from "next/link";
import { readData } from "@/lib/cms";

export default async function BlogPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">Blog</h1>
        <p className="mt-3 text-[var(--muted)]">Insights from healthcare operations, strategy, and technology teams.</p>
      </section>
      <section className="mt-6 grid gap-4">
        {data.blogs.map((post) => (
          <article key={post.id} className="card p-5">
            <p className="text-xs text-[var(--muted)]">{post.publishedAt} • {post.author}</p>
            <h2 className="mt-2 text-2xl font-bold">{post.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">Read details</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
