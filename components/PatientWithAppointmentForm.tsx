"use client";

import { useState } from "react";
import { savePatientWithAppointmentAction } from "@/app/dashboard/actions";

type Props = {
  doctors: { id: string; title: string }[];
};

export default function PatientWithAppointmentForm({ doctors }: Props) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [includeAppointment, setIncludeAppointment] = useState(false);

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
    <form action={savePatientWithAppointmentAction} className="grid gap-4">
      {/* Patient Information */}
      <div className="grid gap-3">
        <h3 className="font-semibold text-[var(--brand-deep)]">Patient Information</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="name"
            required
            placeholder="Full Name"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="phone"
            required
            placeholder="Phone Number"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <select
            name="gender"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <input
          name="address"
          placeholder="Address"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />

        <textarea
          name="medicalHistory"
          rows={2}
          placeholder="Medical History / Notes"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </div>

      {/* Appointment Checkbox */}
      <div className="flex items-center gap-2 border-t border-[var(--line)] pt-4">
        <input
          type="checkbox"
          id="includeAppointment"
          checked={includeAppointment}
          onChange={(e) => setIncludeAppointment(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="includeAppointment" className="text-sm font-semibold text-[var(--brand-deep)]">
          Book appointment now
        </label>
      </div>

      {/* Appointment Details */}
      {includeAppointment && (
        <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-[#f9fafb] p-4">
          <h3 className="font-semibold text-[var(--brand-deep)]">Appointment Details</h3>

          {/* Doctor Selection */}
          <select
            name="doctorId"
            required={includeAppointment}
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.title}
              </option>
            ))}
          </select>

          {/* Date Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--brand-deep)]">Select Date</label>
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
            <input type="hidden" name="appointmentDate" value={days[selectedDate].fullDate} />
          </div>

          {/* Time Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--brand-deep)]">Select Time</label>
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
            <input type="hidden" name="appointmentTime" value={selectedTime} />
          </div>

          {/* Appointment Notes */}
          <textarea
            name="appointmentNotes"
            rows={2}
            placeholder="Appointment notes (optional)"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </div>
      )}

      <input type="hidden" name="includeAppointment" value={includeAppointment ? "true" : "false"} />

      <button type="submit" className="button button-primary w-fit">
        {includeAppointment ? "Add Patient & Book Appointment" : "Add Patient"}
      </button>
    </form>
  );
}
