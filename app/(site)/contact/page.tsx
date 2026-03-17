type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const query = await searchParams;

  return (
    <main className="container fade-up pb-10">
      <section className="overflow-hidden rounded-sm border border-[#d8dee8] bg-[#f3f5f8]">
        <div className="grid md:grid-cols-2">
          <article className="border-b border-[#d8dee8] px-8 py-8 md:border-b-0 md:border-r md:px-10 md:py-10">
            <h1 className="text-3xl font-black text-[#1f5ca8]">Get In Touch With Us</h1>
            <p className="mt-6 max-w-lg text-sm leading-6 text-[#6b7280]">
              At MedAxis, your health and wellbeing are our top priorities. Whether you are seeking
              treatment for an ear, nose, or throat condition, our dedicated team is here to provide
              you with the highest standards of care.
            </p>

            <h2 className="mt-6 text-lg font-extrabold text-[#1f5ca8]">Stay connected</h2>
            <div className="mt-3 flex gap-8 text-[#1f5ca8]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#b7c8de] text-sm font-bold">f</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#b7c8de] text-sm font-bold">ig</span>
            </div>
          </article>

          <article className="px-8 py-8 md:px-10 md:py-10">
            <h2 className="text-3xl font-black text-[#1f5ca8]">Leave Us Your Info</h2>
            <p className="mt-1 text-xs font-semibold text-[#8b95a7]">and We will get back to you.</p>

            {query.sent === "1" ? (
              <p className="mt-4 rounded-md bg-[#e8fff2] p-3 text-sm text-[#145f39]">
                Your message has been sent successfully.
              </p>
            ) : null}

            <form action="/api/public/contact" method="post" className="mt-4 grid gap-2 text-sm">
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  required
                  name="name"
                  placeholder="Full Name *"
                  className="h-9 rounded border border-[#dbe3ee] bg-white px-3 text-xs"
                />
                <input
                  name="phone"
                  placeholder="+1"
                  className="h-9 rounded border border-[#dbe3ee] bg-white px-3 text-xs"
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email *"
                  className="h-9 rounded border border-[#dbe3ee] bg-white px-3 text-xs"
                />
                <input
                  name="subject"
                  placeholder="Subject *"
                  className="h-9 rounded border border-[#dbe3ee] bg-white px-3 text-xs"
                />
              </div>

              <textarea
                required
                name="message"
                rows={4}
                placeholder="Message *"
                className="rounded border border-[#dbe3ee] bg-white px-3 py-2 text-xs"
              />

              <p className="text-center text-[11px] text-[#9aa3b2]">* These fields are required</p>
              <div className="flex justify-center">
                <button className="rounded bg-[#24a148] px-5 py-2 text-xs font-bold text-white hover:bg-[#1f8d3f]">
                  Submit Now
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  );
}
