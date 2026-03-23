import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/lib/db";

function formatPublishedDate(dateValue: string) {
  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const news = await getAllNews();

  return (
    <main className="container fade-up pb-16">
      <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"
              alt="Healthcare news"
              width={600}
              height={500}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-[#1f2937]">Latest News & Updates</h1>
            <p className="text-[#4b5563] leading-relaxed">
              Stay up to date with the latest announcements, clinic updates, and healthcare industry news from Sh-Med.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-[#1f2937]">RECENT ANNOUNCEMENTS</h2>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            Important updates and news from our healthcare network
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#d97706]">
                      {item.source}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#1f2937] group-hover:text-[#5f6fff]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-[#9ca3af]">{formatPublishedDate(item.published_at)}</p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm font-semibold text-[#5f6fff] hover:underline"
                    >
                      Read more {"->"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
