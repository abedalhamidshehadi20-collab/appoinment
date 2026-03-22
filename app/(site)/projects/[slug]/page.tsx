import Image from "next/image";
import { redirect } from "next/navigation";
import { readData } from "@/lib/cms";
import BookingSlots from "@/components/BookingSlots";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const data = await readData();
  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    redirect("/doctors");
  }

  const yearsOfExperience = new Date().getFullYear() - 2008;

  return (
    <main className="container fade-up pb-10">
      <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Doctor Image */}
        <div className="flex-shrink-0">
          <div className="overflow-hidden rounded-xl bg-[#5f6fff]">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={320}
              height={320}
              className="h-72 w-full object-cover lg:h-80 lg:w-72"
            />
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="flex-1 rounded-xl border border-[#e4e9ef] bg-white p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1f2937]">{project.title}</h1>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3b82f6]">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#6b7280]">
            <span>{project.sector}</span>
            <span className="rounded-full border border-[#e5e7eb] px-2 py-0.5 text-xs">
              {yearsOfExperience} Years
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-1">
              <h2 className="font-medium text-[#1f2937]">About</h2>
              <svg className="h-4 w-4 text-[#9ca3af]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              {project.description} {project.details.join(" ")} With a patient-first approach, every treatment
              plan is customized to the patient&apos;s symptoms, history, and lifestyle.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[#4b5563]">
              Appointment fee: <span className="font-semibold text-[#1f2937]">$50</span>
            </p>
          </div>
        </div>
      </section>

      {/* Booking Slots Section */}
      <BookingSlots doctorSlug={slug} />
    </main>
  );
}
