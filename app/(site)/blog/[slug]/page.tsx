import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/db";
import { formatPublishedDate } from "@/lib/published-date";
import { normalizeRichTextContent } from "@/lib/rich-text";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container fade-up pb-8">
      <article className="card p-8 md:p-10">
        <p className="text-xs text-[var(--muted)]">
          {formatPublishedDate(post.published_at)} | {post.author}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">{post.title}</h1>
        <div
          className="rich-text mt-5 text-[var(--muted)]"
          dangerouslySetInnerHTML={{
            __html: normalizeRichTextContent(post.content),
          }}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#e4f5fc] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </main>
  );
}
