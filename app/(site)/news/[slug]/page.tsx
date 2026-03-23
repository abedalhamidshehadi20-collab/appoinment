import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailsPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="container fade-up pb-8">
      <article className="card p-8 md:p-10">
        <p className="text-xs text-[var(--muted)]">{item.published_at} • {item.source}</p>
        <h1 className="mt-2 text-4xl font-extrabold">{item.title}</h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">{item.content}</p>
      </article>
    </main>
  );
}
