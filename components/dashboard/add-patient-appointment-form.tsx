"use client";

import { useEffect, useState } from "react";
import { addAppointmentAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";

type Props = {
  patientId: string;
  doctors: { id: string; title: string }[];
};

function getNextDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0],
    };
  });
}

export default function AddPatientAppointmentForm({
  patientId,
  doctors,
}: Props) {
  const days = getNextDays();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(days[0]?.fullDate ?? "");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadSlots() {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        setSelectedTime("");
        return;
      }

      try {
        setIsLoadingSlots(true);
        const query = new URLSearchParams({
          doctorId: selectedDoctor,
          date: selectedDate,
        });
        const response = await fetch(
          `/api/public/doctors/available-slots?${query.toString()}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load slots");
        }

        const body = (await response.json()) as { availableSlots?: string[] };
        const slots = body.availableSlots ?? [];

        if (!ignore) {
          setAvailableSlots(slots);
          setSelectedTime((previous) =>
            slots.includes(previous) ? previous : "",
          );
        }
      } catch {
        if (!ignore) {
          setAvailableSlots([]);
          setSelectedTime("");
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
  }, [selectedDoctor, selectedDate]);

  return (
    <form
      action={addAppointmentAction}
      className="grid gap-5 rounded-[24px] border border-[#dce8fb] bg-[#f8fbff] p-5"
    >
      <input type="hidden" name="patientId" value={patientId} />
      <input type="hidden" name="date" value={selectedDate} />
      <input type="hidden" name="time" value={selectedTime} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
          Appointment
        </p>
        <h3 className="mt-1 text-lg font-bold text-[var(--brand-deep)]">
          Add New Appointment
        </h3>
      </div>

      <DoctorFormField label="Select Doctor">
        <select
          name="doctorId"
          required
          value={selectedDoctor}
          onChange={(event) => setSelectedDoctor(event.target.value)}
          className={inputClassName}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.title}
            </option>
          ))}
        </select>
      </DoctorFormField>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-[var(--brand-deep)]">
          Select Date
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day.fullDate}
              type="button"
              onClick={() => setSelectedDate(day.fullDate)}
              className={`flex min-w-[76px] flex-shrink-0 flex-col items-center rounded-full px-4 py-3 text-sm transition ${
                selectedDate === day.fullDate
                  ? "bg-[#5f6fff] text-white"
                  : "border border-[#d8e5fb] bg-white text-[var(--muted)] hover:border-[#5f6fff]"
              }`}
            >
              <span className="text-xs font-medium">{day.day}</span>
              <span className="mt-1 text-lg font-semibold">{day.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-[var(--brand-deep)]">
          Select Time
        </p>
        <div className="flex flex-wrap gap-2">
          {availableSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              className={`rounded-full px-5 py-2 text-sm transition ${
                selectedTime === time
                  ? "bg-[#5f6fff] text-white"
                  : "border border-[#d8e5fb] bg-white text-[var(--muted)] hover:border-[#5f6fff]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)]">
          {!selectedDoctor
            ? "Select doctor first"
            : isLoadingSlots
              ? "Loading available slots..."
              : availableSlots.length === 0
                ? "No available slots for this date"
                : "Pick one of the available slots"}
        </p>
      </div>

      <DoctorFormField label="Appointment Notes">
        <textarea
          name="notes"
          rows={3}
          placeholder="Appointment notes"
          className={textareaClassName}
        />
      </DoctorFormField>

      <div className="flex justify-end">
        <button
          disabled={!selectedDoctor || !selectedDate || !selectedTime || isLoadingSlots}
          className="button button-primary rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Appointment
        </button>
      </div>
    </form>
  );
}
