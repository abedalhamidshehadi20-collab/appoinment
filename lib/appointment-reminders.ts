import {
  getAppointmentById,
  createAppointmentReminderLog,
  getAppointmentsForReminderDate,
  hasSentAppointmentReminder,
  isPatientReminderEnabled,
} from "@/lib/db";
import nodemailer from "nodemailer";

type ReminderJobOptions = {
  targetDate?: string;
};

type SingleReminderResult = {
  ok: boolean;
  reason:
    | "sent"
    | "not_found"
    | "missing_email"
    | "not_tomorrow"
    | "opted_out"
    | "already_sent"
    | "invalid_status"
    | "failed";
};

function toISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getTomorrowISODate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toISODate(tomorrow);
}

function isReminderEligibleStatus(status: string) {
  const value = status.toLowerCase();
  return value === "pending" || value === "scheduled" || value === "confirmed";
}

async function sendReminderEmail(input: {
  to: string;
  patientName: string;
  doctorName: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS must be configured");
  }

  const fromEmail = process.env.REMINDER_FROM_EMAIL || smtpUser;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">Appointment Reminder</h2>
      <p>Hello ${input.patientName || "Patient"},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Doctor:</strong> ${input.doctorName}</li>
        <li><strong>Service:</strong> ${input.service || "General Consultation"}</li>
        <li><strong>Date:</strong> ${input.appointmentDate}</li>
        <li><strong>Time:</strong> ${input.appointmentTime}</li>
      </ul>
      <p>Please arrive a few minutes early.</p>
    </div>
  `;

  await transporter.sendMail({
    from: fromEmail,
    to: input.to,
    subject: "Appointment Reminder",
    html,
  });
}

export async function runAppointmentReminderJob(options: ReminderJobOptions = {}) {
  const targetDate = options.targetDate || getTomorrowISODate();
  const appointments = await getAppointmentsForReminderDate(targetDate);

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const appointment of appointments) {
    const email = appointment.email?.trim();
    if (!email) {
      skipped += 1;
      continue;
    }

    const optedIn = await isPatientReminderEnabled(appointment.patient_id, email);
    if (!optedIn) {
      skipped += 1;
      continue;
    }

    const alreadySent = await hasSentAppointmentReminder(appointment.id, targetDate);
    if (alreadySent) {
      skipped += 1;
      continue;
    }

    try {
      await sendReminderEmail({
        to: email,
        patientName: appointment.name || "Patient",
        doctorName: appointment.doctor_name || "General Desk",
        service: appointment.service || "General Consultation",
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time || "-",
      });

      await createAppointmentReminderLog({
        appointmentId: appointment.id,
        reminderDate: targetDate,
        recipientEmail: email,
        status: "sent",
      });

      sent += 1;
    } catch (error) {
      await createAppointmentReminderLog({
        appointmentId: appointment.id,
        reminderDate: targetDate,
        recipientEmail: email,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });

      failed += 1;
    }
  }

  return {
    targetDate,
    totalCandidates: appointments.length,
    sent,
    skipped,
    failed,
  };
}

export async function sendSingleAppointmentReminderById(appointmentId: string): Promise<SingleReminderResult> {
  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) {
    return { ok: false, reason: "not_found" };
  }

  const email = appointment.email?.trim();
  if (!email) {
    return { ok: false, reason: "missing_email" };
  }

  if (!isReminderEligibleStatus(appointment.status || "")) {
    return { ok: false, reason: "invalid_status" };
  }

  const tomorrowDate = getTomorrowISODate();
  if (appointment.appointment_date !== tomorrowDate) {
    return { ok: false, reason: "not_tomorrow" };
  }

  const optedIn = await isPatientReminderEnabled(appointment.patient_id, email);
  if (!optedIn) {
    return { ok: false, reason: "opted_out" };
  }

  const alreadySent = await hasSentAppointmentReminder(appointment.id, appointment.appointment_date);
  if (alreadySent) {
    return { ok: false, reason: "already_sent" };
  }

  try {
    await sendReminderEmail({
      to: email,
      patientName: appointment.name || "Patient",
      doctorName: appointment.doctor_name || "General Desk",
      service: appointment.service || "General Consultation",
      appointmentDate: appointment.appointment_date,
      appointmentTime: appointment.appointment_time || "-",
    });

    await createAppointmentReminderLog({
      appointmentId: appointment.id,
      reminderDate: appointment.appointment_date,
      recipientEmail: email,
      status: "sent",
    });

    return { ok: true, reason: "sent" };
  } catch (error) {
    await createAppointmentReminderLog({
      appointmentId: appointment.id,
      reminderDate: appointment.appointment_date,
      recipientEmail: email,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return { ok: false, reason: "failed" };
  }
}
