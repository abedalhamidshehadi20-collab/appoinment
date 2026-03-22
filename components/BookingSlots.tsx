"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  doctorSlug: string;
  isPatientLoggedIn: boolean;
};

export default function BookingSlots({ doctorSlug, isPatientLoggedIn }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
  ];

  const handleBooking = () => {
    if (selectedTime) {
      if (!isPatientLoggedIn) {
        router.push(`/login?next=${encodeURIComponent(`/appointments?doctor=${doctorSlug}&date=${days[selectedDate].fullDate}&time=${encodeURIComponent(selectedTime)}`)}`);
        return;
      }

      router.push(`/appointments?doctor=${doctorSlug}&date=${days[selectedDate].fullDate}&time=${encodeURIComponent(selectedTime)}`);
    }
  };

  return (
    <section className="mt-6">
      <h3 className="font-medium text-[#4b5563]">Booking slots</h3>

      {/* Date Selection */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {days.map((day, index) => (
          <button
            key={day.fullDate}
            onClick={() => setSelectedDate(index)}
            className={`flex min-w-[70px] flex-col items-center rounded-full px-4 py-3 text-sm transition ${
              selectedDate === index
                ? "bg-[#5f6fff] text-white"
                : "border border-[#e5e7eb] text-[#6b7280] hover:border-[#5f6fff]"
            }`}
          >
            <span className="text-xs font-medium">{day.day}</span>
            <span className="mt-1 text-lg font-semibold">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Time Selection */}
      <div className="mt-4 flex flex-wrap gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`rounded-full px-5 py-2 text-sm transition ${
              selectedTime === time
                ? "bg-[#5f6fff] text-white"
                : "border border-[#e5e7eb] text-[#6b7280] hover:border-[#5f6fff]"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={!selectedTime}
        className="mt-6 rounded-full bg-[#5f6fff] px-14 py-3 text-sm font-medium text-white transition hover:bg-[#4f5de6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Book an appointment
      </button>
    </section>
  );
}
