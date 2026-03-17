import Link from "next/link";
import { readData } from "@/lib/cms";

export default async function NewsPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">News</h1>
        <p className="mt-3 text-[var(--muted)]">Latest company updates and announcements.</p>
      </section>
      <section className="mt-6 grid gap-4">
        {data.news.map((item) => (
          <article key={item.id} className="card p-5">
            <p className="text-xs text-[var(--muted)]">{item.publishedAt} • {item.source}</p>
            <h2 className="mt-2 text-2xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.excerpt}</p>
            <Link href={`/news/${item.slug}`} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">Read details</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
