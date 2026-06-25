"use client";

import { useEffect, useState } from "react";
import { savePatientWithAppointmentAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";

type Props = {
  doctors: { id: string; title: string }[];
  onCancel?: () => void;
};

export default function PatientWithAppointmentForm({
  doctors,
  onCancel,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [includeAppointment, setIncludeAppointment] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0],
    };
  });
  const selectedDateValue = days[selectedDate]?.fullDate ?? "";

  useEffect(() => {
    let ignore = false;

    async function loadSlots() {
      if (!includeAppointment || !selectedDoctor) {
        setAvailableSlots([]);
        setSelectedTime("");
        return;
      }

      if (!selectedDateValue) {
        setAvailableSlots([]);
        setSelectedTime("");
        return;
      }

      try {
        setIsLoadingSlots(true);
        const query = new URLSearchParams({
          doctorId: selectedDoctor,
          date: selectedDateValue,
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
  }, [includeAppointment, selectedDoctor, selectedDateValue]);

  return (
    <form action={savePatientWithAppointmentAction} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DoctorFormField label="Full Name">
          <input
            name="name"
            required
            placeholder="Full Name"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Email Address">
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className={inputClassName}
          />
        </DoctorFormField>

        <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
          <DoctorFormField label="Phone Number">
            <input
              name="phone"
              required
              placeholder="Phone Number"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Date of Birth">
            <input
              type="date"
              name="dateOfBirth"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Gender">
            <select name="gender" className={inputClassName}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </DoctorFormField>
        </div>

        <div className="md:col-span-2">
          <DoctorFormField label="Address">
            <input
              name="address"
              placeholder="Address"
              className={inputClassName}
            />
          </DoctorFormField>
        </div>

        <div className="md:col-span-2">
          <DoctorFormField label="Medical History / Notes">
            <textarea
              name="medicalHistory"
              rows={4}
              placeholder="Medical History / Notes"
              className={textareaClassName}
            />
          </DoctorFormField>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#dce8fb] bg-[#f8fbff] p-5">
        <label className="flex items-center gap-3 text-sm font-semibold text-[var(--brand-deep)]">
          <input
            type="checkbox"
            id="includeAppointment"
            checked={includeAppointment}
            onChange={(event) => setIncludeAppointment(event.target.checked)}
            className="h-4 w-4 rounded border-[#bfd5ff]"
          />
          Book appointment now
        </label>

        {includeAppointment ? (
          <div className="mt-5 grid gap-5">
            <div className="grid gap-6 md:grid-cols-2">
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
            </div>

            <div className="grid gap-3">
              <p className="text-sm font-semibold text-[var(--brand-deep)]">
                Select Date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((day, index) => (
                  <button
                    key={day.fullDate}
                    type="button"
                    onClick={() => setSelectedDate(index)}
                    className={`flex min-w-[76px] flex-shrink-0 flex-col items-center rounded-full px-4 py-3 text-sm transition ${
                      selectedDate === index
                        ? "bg-[#5f6fff] text-white"
                        : "border border-[#d8e5fb] bg-white text-[var(--muted)] hover:border-[#5f6fff]"
                    }`}
                  >
                    <span className="text-xs font-medium">{day.day}</span>
                    <span className="mt-1 text-lg font-semibold">{day.date}</span>
                  </button>
                ))}
              </div>
              <input
                type="hidden"
                name="appointmentDate"
                value={selectedDateValue}
              />
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
              <input type="hidden" name="appointmentTime" value={selectedTime} />
            </div>

            <DoctorFormField label="Appointment Notes">
              <textarea
                name="appointmentNotes"
                rows={3}
                placeholder="Appointment notes (optional)"
                className={textareaClassName}
              />
            </DoctorFormField>
          </div>
        ) : null}
      </div>

      <input
        type="hidden"
        name="includeAppointment"
        value={includeAppointment ? "true" : "false"}
      />

      <div className="border-t border-[#edf2fb] pt-2">
        <div className="flex flex-wrap justify-end gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#d8e5fb] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="submit"
            disabled={
              includeAppointment &&
              (!selectedDoctor || !selectedTime || isLoadingSlots)
            }
            className="button button-primary rounded-xl px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {includeAppointment ? "Add Patient & Book Appointment" : "Add Patient"}
          </button>
        </div>
      </div>
    </form>
  );
}
