import { readData } from "@/lib/cms";

type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const query = await searchParams;
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">Contact</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Tell us about your clinic or healthcare project and our consulting team will contact you.
        </p>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-[1.15fr_1fr]">
        <article className="card p-6">
          {query.sent === "1" ? (
            <p className="rounded-lg bg-[#e8fff2] p-3 text-sm text-[#145f39]">
              Your message has been sent successfully.
            </p>
          ) : null}
          <form action="/api/public/contact" method="post" className="mt-4 grid gap-3">
            <input required name="name" placeholder="Full name" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input name="phone" placeholder="Phone" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <textarea required name="message" rows={5} placeholder="How can we help?" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <button className="button button-primary">Send message</button>
          </form>
        </article>

        <article className="card p-6">
          <h2 className="text-2xl font-bold">Quick Facts</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">Our services are shaped around practical outcomes.</p>
          <div className="mt-4 grid gap-3">
            {data.home.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-[#f4fbff] p-3">
                <p className="text-xl font-extrabold text-[var(--brand-deep)]">{stat.value}</p>
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
