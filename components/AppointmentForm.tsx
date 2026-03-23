"use client";

import { useEffect, useMemo, useState } from "react";

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
  errorCode?: string;
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

function getErrorMessage(errorCode?: string) {
  if (errorCode === "slot_unavailable") {
    return "The selected time is no longer available. Please choose another slot.";
  }

  if (errorCode === "doctor_not_found") {
    return "The selected doctor was not found. Please choose another doctor.";
  }

  if (errorCode === "missing_fields") {
    return "Please select a doctor, date, and available time before booking.";
  }

  if (errorCode === "booking_failed") {
    return "We could not create your appointment right now. Please try again.";
  }

  return "";
}

export default function AppointmentForm({
  doctors,
  services,
  showSuccess,
  errorCode,
  preselectedDoctor,
  preselectedDate,
  preselectedTime
}: Props) {
  const days = getNextDays();
  const serviceList = services.length > 0 ? services : defaultServices;
  const [selectedDate, setSelectedDate] = useState(preselectedDate || days[0].value);
  const [selectedTime, setSelectedTime] = useState(preselectedTime || "");
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor || "");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const visibleError = useMemo(() => getErrorMessage(errorCode) || slotsError, [errorCode, slotsError]);

  useEffect(() => {
    let ignore = false;

    async function loadSlots() {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        setSelectedTime("");
        setSlotsError("");
        return;
      }

      try {
        setIsLoadingSlots(true);
        setSlotsError("");

        const params = new URLSearchParams({
          doctorId: selectedDoctor,
          date: selectedDate,
        });

        const response = await fetch(`/api/public/doctors/available-slots?${params.toString()}`, {
          cache: "no-store",
        });

        const data = await response.json() as { availableSlots?: string[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load available slots");
        }

        const slots = data.availableSlots ?? [];

        if (!ignore) {
          setAvailableSlots(slots);
          setSelectedTime((previous) => (slots.includes(previous) ? previous : ""));
        }
      } catch {
        if (!ignore) {
          setAvailableSlots([]);
          setSelectedTime("");
          setSlotsError("Could not load available slots right now. Try again in a moment.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      ignore = true;
    };
  }, [selectedDate, selectedDoctor]);

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

      {visibleError ? (
        <p className="mt-6 rounded-2xl border border-[#f2c7c7] bg-[#fff1f1] p-4 text-sm font-medium text-[#8f1d1d]">
          {visibleError}
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
              required
              name="doctorId"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              <option value="">Choose doctor</option>
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
              disabled={!selectedDoctor || isLoadingSlots}
              className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
            >
              <option value="">
                {!selectedDoctor
                  ? "Choose a doctor first"
                  : isLoadingSlots
                    ? "Loading available slots..."
                    : availableSlots.length === 0
                      ? "No available slots for this date"
                      : "Select a time"}
              </option>
              {availableSlots.map((time) => (
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
          disabled={!selectedDoctor || !selectedTime || isLoadingSlots}
          className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
        >
          {isLoadingSlots ? "Loading slots..." : "Book Appointment"}
        </button>
      </form>
    </article>
  );
}
