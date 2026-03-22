"use client";

type Props = {
  patientId: string;
  appointmentId: string;
  currentStatus: string;
  onUpdate: (formData: FormData) => Promise<void>;
};

export default function AppointmentStatusSelector({
  patientId,
  appointmentId,
  currentStatus,
  onUpdate,
}: Props) {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("appointmentId", appointmentId);
    formData.append("status", e.target.value);
    await onUpdate(formData);
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="rounded-lg border border-[var(--line)] px-2 py-1 text-xs"
    >
      <option value="Scheduled">Scheduled</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
