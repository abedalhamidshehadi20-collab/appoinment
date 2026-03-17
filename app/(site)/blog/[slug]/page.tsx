import { notFound } from "next/navigation";
import { readData } from "@/lib/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const data = await readData();
  const post = data.blogs.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container fade-up pb-8">
      <article className="card p-8 md:p-10">
        <p className="text-xs text-[var(--muted)]">{post.publishedAt} • {post.author}</p>
        <h1 className="mt-2 text-4xl font-extrabold">{post.title}</h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">{post.content}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#e4f5fc] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </main>
  );
}
