"use client";

import { useState } from "react";

type Doctor = {
  id: string;
  title: string;
  sector: string;
};

type Service = {
  id: string;
  title: string;
};

type Props = {
  doctors: Doctor[];
  services: Service[];
  showSuccess: boolean;
  preselectedDoctor?: string;
  preselectedDate?: string;
  preselectedTime?: string;
};

// Default services as fallback
const defaultServices = [
  { id: "general", title: "General Consultation" },
  { id: "dental", title: "Dental Checkup" },
  { id: "ent", title: "ENT Care" },
  { id: "neuro", title: "Neurology Visit" },
  { id: "cardio", title: "Cardiology Visit" },
];

// Generate next 7 days
function getNextDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      value: date.toISOString().split("T")[0],
    };
  });
}

// Time slots
const timeSlots = [
  "8:00 am", "8:30 am", "9:00 am", "9:30 am",
  "10:00 am", "10:30 am", "11:00 am", "11:30 am",
  "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm",
  "4:00 pm", "4:30 pm", "5:00 pm"
];

export default function AppointmentForm({
  doctors,
  services,
  showSuccess,
  preselectedDoctor,
  preselectedDate,
  preselectedTime
}: Props) {
  const days = getNextDays();
  const serviceList = services.length > 0 ? services : defaultServices;
  const [selectedDate, setSelectedDate] = useState(preselectedDate || days[0].value);
  const [selectedTime, setSelectedTime] = useState(preselectedTime || "");
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor || "");

  return (
    <article className="card rounded-[28px] p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Appointment Form</p>
        <h2 className="mt-3 text-3xl font-extrabold">Book An Appointment</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Share your concern and preferred time. Our care coordinator will confirm your visit.
        </p>
      </div>

      {showSuccess ? (
        <p className="mt-6 rounded-2xl border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
          Appointment request sent successfully.
        </p>
      ) : null}

      <form action="/api/public/appointments" method="post" className="mt-8 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Full Name
            <input
              required
              name="name"
              placeholder="Enter your full name"
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Phone
            <input
              name="phone"
              placeholder="+1 (555) 123-4567"
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Email Address
            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Location
            <input
              name="location"
              placeholder="City or area"
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Required Service
            <select
              name="service"
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              {serviceList.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Preferred Doctor
            <select
              name="doctorId"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              <option value="">Choose doctor (optional)</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Appointment Date
            <select
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              {days.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Appointment Time
            <select
              required
              name="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              <option value="">Select a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
          Message
          <textarea
            name="message"
            rows={5}
            placeholder="Briefly describe your symptoms or request"
            className="rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
          />
        </label>

        <p className="text-center text-xs text-[var(--muted)]">* These fields are required.</p>
        <button
          type="submit"
          className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
        >
          Book Appointment
        </button>
      </form>
    </article>
  );
}
