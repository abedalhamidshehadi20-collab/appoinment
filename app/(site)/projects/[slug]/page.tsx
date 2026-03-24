import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDoctorBySlug, getAllDoctors } from "@/lib/db";
import BookingSlots from "@/components/BookingSlots";
import { getPatientSession } from "@/lib/patient-auth";
import { getSafeDoctorImageSrc } from "@/lib/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const [doctor, allDoctors] = await Promise.all([
    getDoctorBySlug(slug),
    getAllDoctors()
  ]);
  const patient = await getPatientSession();

  if (!doctor) {
    redirect("/doctors");
  }

  const yearsOfExperience = doctor.years_experience || (new Date().getFullYear() - 2008);
  const appointmentFee = doctor.appointment_fee || 50;
  const relatedDoctors = allDoctors.filter((item) => item.slug !== slug).slice(0, 5);

  return (
    <main className="container fade-up pb-10">
      <section className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Doctor Image */}
        <div className="flex-shrink-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 lg:w-80">
            <Image
              src={getSafeDoctorImageSrc(doctor.cover_image)}
              alt={doctor.title}
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="flex-1 rounded-xl border border-[#e4e9ef] bg-white p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1f2937]">{doctor.title}</h1>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3b82f6]">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#6b7280]">
            <span>{doctor.sector}</span>
            <span className="rounded-full border border-[#e5e7eb] px-2 py-0.5 text-xs">
              {yearsOfExperience} Years
            </span>
          </div>

          {/* Availability Badge */}
          {doctor.status && (
            <div className="mt-3">
              <p className="flex items-center gap-1 text-sm font-medium">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  doctor.status.toLowerCase() === 'available'
                    ? 'bg-[#10b981]'
                    : doctor.status.toLowerCase() === 'unavailable'
                    ? 'bg-[#ef4444]'
                    : doctor.status.toLowerCase() === 'on leave'
                    ? 'bg-[#f59e0b]'
                    : 'bg-[#6b7280]'
                }`}></span>
                <span className={
                  doctor.status.toLowerCase() === 'available'
                    ? 'text-[#10b981]'
                    : doctor.status.toLowerCase() === 'unavailable'
                    ? 'text-[#ef4444]'
                    : doctor.status.toLowerCase() === 'on leave'
                    ? 'text-[#f59e0b]'
                    : 'text-[#6b7280]'
                }>
                  {doctor.status}
                </span>
              </p>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center gap-1">
              <h2 className="font-medium text-[#1f2937]">About</h2>
              <svg className="h-4 w-4 text-[#9ca3af]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              {doctor.description} {doctor.details?.join(" ")} With a patient-first approach, every treatment
              plan is customized to the patient&apos;s symptoms, history, and lifestyle.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[#4b5563]">
              Appointment fee: <span className="font-semibold text-[#1f2937]">${appointmentFee}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Booking Slots Section */}
      <BookingSlots
        doctorSlug={slug}
        isPatientLoggedIn={Boolean(patient)}
        availableTimes={doctor.available_times}
      />

      {/* Related Doctors Section */}
      <section className="mt-16">
        <h2 className="text-center text-xl font-medium text-[#1f2937]">Related Doctors</h2>
        <p className="mt-2 text-center text-sm text-[#6b7280]">Simply browse through our extensive list of trusted doctors.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {relatedDoctors.map((doc) => (
            <Link
              key={doc.id}
              href={`/doctors/${doc.slug}`}
              className="group overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition hover:translate-y-[-10px]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                <Image
                  src={getSafeDoctorImageSrc(doc.cover_image)}
                  alt={doc.title}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="flex items-center gap-1 text-sm font-medium">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    doc.status?.toLowerCase() === 'available'
                      ? 'bg-[#10b981]'
                      : doc.status?.toLowerCase() === 'unavailable'
                      ? 'bg-[#ef4444]'
                      : doc.status?.toLowerCase() === 'on leave'
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#6b7280]'
                  }`}></span>
                  <span className={
                    doc.status?.toLowerCase() === 'available'
                      ? 'text-[#10b981]'
                      : doc.status?.toLowerCase() === 'unavailable'
                      ? 'text-[#ef4444]'
                      : doc.status?.toLowerCase() === 'on leave'
                      ? 'text-[#f59e0b]'
                      : 'text-[#6b7280]'
                  }>
                    {doc.status || 'Available'}
                  </span>
                </p>
                <p className="mt-2 font-medium text-[#1f2937]">{doc.title}</p>
                <p className="text-xs text-[#6b7280]">{doc.sector}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
