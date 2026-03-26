import { z } from "zod";

export const appointmentRangeSchema = z.enum(["all", "day", "week", "month"]).default("all");
export const appointmentStatusFilterSchema = z
  .enum(["all", "Pending", "Completed", "Cancelled"])
  .default("all");

export const appointmentFiltersSchema = z.object({
  range: appointmentRangeSchema.optional(),
  status: appointmentStatusFilterSchema.optional(),
  q: z.string().trim().max(100).optional(),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().trim().min(1),
  status: z.enum(["Pending", "Completed", "Cancelled"]),
});

export const patientFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  history: z.enum(["all", "with-records", "without-records"]).default("all").optional(),
});

export const medicalRecordSchema = z.object({
  patientId: z.string().trim().min(1),
  diagnosis: z.string().trim().min(2).max(200),
  notes: z.string().trim().max(4000).optional().default(""),
  attachments: z.array(z.string().trim().url()).default([]),
});

export const prescriptionSchema = z.object({
  patientId: z.string().trim().min(1),
  medication: z.string().trim().min(2).max(160),
  dosage: z.string().trim().min(2).max(160),
  duration: z.string().trim().min(2).max(120),
  instructions: z.string().trim().max(2000).optional().default(""),
});

export const notificationsPatchSchema = z.object({
  ids: z.array(z.string().trim().min(1)).default([]),
  markAll: z.boolean().default(false),
});

export const doctorProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(120),
  profileImage: z.string().trim().url().or(z.literal("")),
  location: z.string().trim().max(160).optional().default(""),
  password: z.string().max(120).optional().default(""),
});

export function splitTextareaLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
