"use client";

import { useState } from "react";

type Doctor = {
  id: string;
  title: string;
  sector: string;
};

type Props = {
  doctors: Doctor[];
  showSuccess: boolean;
};

export default function AppointmentForm({ doctors, showSuccess }: Props) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0],
    };
  });

  const timeSlots = [
    "8:00 am",
    "8:30 am",
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
  ];

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
              placeholder="+91"
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
              <option value="General Consultation">General Consultation</option>
              <option value="Dental Checkup">Dental Checkup</option>
              <option value="ENT Care">ENT Care</option>
              <option value="Neurology Visit">Neurology Visit</option>
              <option value="Cardiology Visit">Cardiology Visit</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Preferred Doctor
            <select
              name="doctorId"
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

        {/* Date Selection */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[var(--brand-deep)]">Preferred Date</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day, index) => (
              <button
                key={day.fullDate}
                type="button"
                onClick={() => setSelectedDate(index)}
                className={`flex min-w-[70px] flex-shrink-0 flex-col items-center rounded-full px-4 py-3 text-sm transition ${
                  selectedDate === index
                    ? "bg-[#5f6fff] text-white"
                    : "border border-[var(--line)] text-[#6b7280] hover:border-[#5f6fff]"
                }`}
              >
                <span className="text-xs font-medium">{day.day}</span>
                <span className="mt-1 text-lg font-semibold">{day.date}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="date" value={days[selectedDate].fullDate} />
        </div>

        {/* Time Selection */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[var(--brand-deep)]">Preferred Time</label>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  selectedTime === time
                    ? "bg-[#5f6fff] text-white"
                    : "border border-[var(--line)] text-[#6b7280] hover:border-[#5f6fff]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <input type="hidden" name="time" value={selectedTime} />
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
          Send Message
        </button>
      </form>
    </article>
  );
}
