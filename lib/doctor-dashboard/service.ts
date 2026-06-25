import { nextId, type Appointment, type Doctor } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";

type DbClient = typeof supabase;

export type DoctorDashboardSummary = {
  totalPatients: number;
  todaysAppointments: number;
  completedAppointments: number;
};

export type DoctorNotificationRecord = {
  id: string;
  doctor_id: string;
  appointment_id: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type MedicalRecordEntry = {
  id: string;
  doctor_id: string;
  patient_id: string;
  diagnosis: string;
  notes: string | null;
  attachments: string[];
  created_at: string;
  updated_at: string;
};

export type PrescriptionEntry = {
  id: string;
  doctor_id: string;
  patient_id: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string | null;
  created_at: string;
  updated_at: string;
};

export type DoctorPatientSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  appointmentsCount: number;
  recordsCount: number;
  lastAppointmentAt: string | null;
};

export type DoctorPatientDetail = DoctorPatientSummary & {
  appointments: Appointment[];
  medicalRecords: MedicalRecordEntry[];
  prescriptions: PrescriptionEntry[];
};

function getClient(): DbClient {
  return (supabaseAdmin ?? supabase) as DbClient;
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("medical_records") ||
    message.includes("prescriptions") ||
    message.includes("notifications")
  );
}

function normalizeAppointmentStatus(status: string) {
  const value = status.trim().toLowerCase();
  if (value === "done") return "completed";
  if (value === "confirmed") return "pending";
  if (value === "scheduled") return "pending";
  if (value === "canceled") return "cancelled";
  return value;
}

function isSameDay(date: Date, compare: Date) {
  return (
    date.getFullYear() === compare.getFullYear() &&
    date.getMonth() === compare.getMonth() &&
    date.getDate() === compare.getDate()
  );
}

function parseDateValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function uniquePatientKey(item: { patient_id: string | null; email: string }) {
  return item.patient_id || item.email.toLowerCase();
}

function normalizeAttachmentList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

function buildFallbackNotifications(appointments: Appointment[]): DoctorNotificationRecord[] {
  return appointments.slice(0, 5).map((appointment) => ({
    id: `fallback-${appointment.id}`,
    doctor_id: appointment.doctor_id,
    appointment_id: appointment.id,
    title: "Appointment activity",
    message: `${appointment.name} has an appointment ${appointment.appointment_date || "soon"} at ${appointment.appointment_time || "-"}.`,
    type: "appointment",
    is_read: false,
    read_at: null,
    created_at: appointment.created_at,
  }));
}

export async function getDoctorBySessionId(doctorId: string) {
  const client = getClient();
  const { data, error } = await client
    .from("doctors")
    .select("*")
    .eq("id", doctorId)
    .single();

  if (error) {
    return null;
  }

  return data as Doctor;
}

export async function getDoctorAppointments(doctorId: string) {
  const client = getClient();
  const { data, error } = await client
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Appointment[];
}

export async function getDoctorNotifications(doctorId: string) {
  const client = getClient();
  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (isMissingTableError(error)) {
    const appointments = await getDoctorAppointments(doctorId);
    return buildFallbackNotifications(appointments);
  }

  if (error) {
    throw error;
  }

  return (data ?? []) as DoctorNotificationRecord[];
}

export async function getDoctorDashboardSummary(doctorId: string): Promise<DoctorDashboardSummary> {
  const [appointments, patients] = await Promise.all([
    getDoctorAppointments(doctorId),
    getDoctorPatients(doctorId),
  ]);
  const today = new Date();

  const totalPatients = patients.length || new Set(appointments.map(uniquePatientKey)).size;
  const todaysAppointments = appointments.filter((appointment) => {
    const appointmentDate = parseDateValue(appointment.appointment_date);
    return appointmentDate ? isSameDay(appointmentDate, today) : false;
  }).length;
  const completedAppointments = appointments.filter(
    (appointment) => normalizeAppointmentStatus(appointment.status || "") === "completed",
  ).length;

  return {
    totalPatients,
    todaysAppointments,
    completedAppointments,
  };
}

export async function getDoctorTodayAppointments(doctorId: string) {
  const appointments = await getDoctorAppointments(doctorId);
  const today = new Date();

  return appointments.filter((appointment) => {
    const appointmentDate = parseDateValue(appointment.appointment_date);
    return appointmentDate ? isSameDay(appointmentDate, today) : false;
  });
}

async function getRecordCountsByPatient(doctorId: string) {
  const client = getClient();
  const { data, error } = await client
    .from("medical_records")
    .select("patient_id")
    .eq("doctor_id", doctorId);

  if (isMissingTableError(error)) {
    return new Map<string, number>();
  }

  if (error) {
    throw error;
  }

  return (data ?? []).reduce((map, item) => {
    const patientId = String(item.patient_id);
    map.set(patientId, (map.get(patientId) ?? 0) + 1);
    return map;
  }, new Map<string, number>());
}

export async function getDoctorPatients(doctorId: string) {
  const appointments = (await getDoctorAppointments(doctorId)).filter(
    (appointment) => Boolean(appointment.patient_id),
  );
  const recordCountMap = await getRecordCountsByPatient(doctorId);

  const patientIds = Array.from(
    new Set(appointments.map((item) => item.patient_id).filter(Boolean)),
  ) as string[];

  const patientsMap = new Map<string, Record<string, unknown>>();
  if (patientIds.length > 0) {
    const client = getClient();
    const { data, error } = await client
      .from("patients")
      .select("*")
      .in("id", patientIds);

    if (error) {
      throw error;
    }

    for (const patient of data ?? []) {
      patientsMap.set(String(patient.id), patient as Record<string, unknown>);
    }
  }

  const patientSummaryMap = new Map<string, DoctorPatientSummary>();

  for (const appointment of appointments) {
    const key = appointment.patient_id!;
    const patientRecord = patientsMap.get(key);
    if (!patientRecord) {
      continue;
    }

    const existing = patientSummaryMap.get(key);

    if (existing) {
      existing.appointmentsCount += 1;
      if (
        appointment.created_at &&
        (!existing.lastAppointmentAt || appointment.created_at > existing.lastAppointmentAt)
      ) {
        existing.lastAppointmentAt = appointment.created_at;
      }
      continue;
    }

    patientSummaryMap.set(key, {
      id: key,
      name: String(patientRecord?.name ?? appointment.name ?? "Patient"),
      email: String(patientRecord?.email ?? appointment.email ?? ""),
      phone: String(patientRecord?.phone ?? appointment.phone ?? ""),
      address: String(patientRecord?.address ?? ""),
      date_of_birth: String(patientRecord?.date_of_birth ?? ""),
      gender: String(patientRecord?.gender ?? ""),
      medical_history: String(patientRecord?.medical_history ?? ""),
      appointmentsCount: 1,
      recordsCount: recordCountMap.get(key) ?? 0,
      lastAppointmentAt: appointment.created_at || null,
    });
  }

  return Array.from(patientSummaryMap.values()).sort((left, right) => {
    const leftTime = left.lastAppointmentAt ? new Date(left.lastAppointmentAt).getTime() : 0;
    const rightTime = right.lastAppointmentAt ? new Date(right.lastAppointmentAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

export async function getDoctorMedicalRecords(doctorId: string, patientId?: string) {
  const client = getClient();
  let query = client
    .from("medical_records")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;

  if (isMissingTableError(error)) {
    return [] as MedicalRecordEntry[];
  }

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...(item as MedicalRecordEntry),
    attachments: normalizeAttachmentList(item.attachments),
  }));
}

export async function getDoctorPrescriptions(doctorId: string, patientId?: string) {
  const client = getClient();
  let query = client
    .from("prescriptions")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;

  if (isMissingTableError(error)) {
    return [] as PrescriptionEntry[];
  }

  if (error) {
    throw error;
  }

  return (data ?? []) as PrescriptionEntry[];
}

export async function getDoctorPatientDetail(doctorId: string, patientId: string) {
  const [patients, records, prescriptions, appointments] = await Promise.all([
    getDoctorPatients(doctorId),
    getDoctorMedicalRecords(doctorId, patientId),
    getDoctorPrescriptions(doctorId, patientId),
    getDoctorAppointments(doctorId),
  ]);

  const patient = patients.find((item) => item.id === patientId);
  if (!patient) {
    return null;
  }

  return {
    ...patient,
    appointments: appointments.filter((appointment) => appointment.patient_id === patientId),
    medicalRecords: records,
    prescriptions,
  } satisfies DoctorPatientDetail;
}

export async function getDoctorReports(doctorId: string) {
  const [summary, appointments] = await Promise.all([
    getDoctorDashboardSummary(doctorId),
    getDoctorAppointments(doctorId),
  ]);

  const monthlyMap = new Map<string, { month: string; appointments: number; completed: number }>();
  for (const appointment of appointments) {
    const date = parseDateValue(appointment.appointment_date);
    if (!date) {
      continue;
    }

    const month = date.toLocaleString("en-US", { month: "short", year: "numeric" });
    const current = monthlyMap.get(month) ?? { month, appointments: 0, completed: 0 };
    current.appointments += 1;
    if (normalizeAppointmentStatus(appointment.status || "") === "completed") {
      current.completed += 1;
    }
    monthlyMap.set(month, current);
  }

  return {
    summary,
    monthlyAppointments: Array.from(monthlyMap.values()).slice(-6),
    statusBreakdown: {
      pending: appointments.filter((item) => normalizeAppointmentStatus(item.status || "") === "pending").length,
      completed: appointments.filter((item) => normalizeAppointmentStatus(item.status || "") === "completed").length,
      cancelled: appointments.filter((item) => normalizeAppointmentStatus(item.status || "") === "cancelled").length,
    },
  };
}

export async function updateDoctorAppointmentStatus(doctorId: string, appointmentId: string, status: string) {
  const client = getClient();
  const { error } = await client
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("doctor_id", doctorId);

  if (error) {
    throw error;
  }
}

export async function createDoctorMedicalRecord(input: {
  doctorId: string;
  patientId: string;
  diagnosis: string;
  notes: string;
  attachments: string[];
}) {
  const client = getClient();
  const payload = {
    id: nextId("mrd"),
    doctor_id: input.doctorId,
    patient_id: input.patientId,
    diagnosis: input.diagnosis,
    notes: input.notes || null,
    attachments: input.attachments,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from("medical_records").insert(payload);
  if (error) {
    throw error;
  }
}

export async function createDoctorPrescription(input: {
  doctorId: string;
  patientId: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
}) {
  const client = getClient();
  const payload = {
    id: nextId("prs"),
    doctor_id: input.doctorId,
    patient_id: input.patientId,
    medication: input.medication,
    dosage: input.dosage,
    duration: input.duration,
    instructions: input.instructions || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from("prescriptions").insert(payload);
  if (error) {
    throw error;
  }
}

export async function markDoctorNotificationsAsRead(doctorId: string, notificationIds?: string[]) {
  const client = getClient();
  let query = client
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("doctor_id", doctorId)
    .eq("is_read", false);

  if (notificationIds && notificationIds.length > 0) {
    query = query.in("id", notificationIds);
  }

  const { error } = await query;

  if (isMissingTableError(error)) {
    return;
  }

  if (error) {
    throw error;
  }
}

export async function updateDoctorProfile(input: {
  doctorId: string;
  name: string;
  specialty: string;
  profileImage: string;
  location: string;
  password?: string;
}) {
  const client = getClient();
  const { error } = await client
    .from("doctors")
    .update({
      title: input.name,
      sector: input.specialty,
      cover_image: input.profileImage || null,
      location: input.location || "",
    })
    .eq("id", input.doctorId);

  if (error) {
    throw error;
  }

  if (input.password) {
    const { error: credentialError } = await client
      .from("doctor_credentials")
      .update({
        password: input.password,
        updated_at: new Date().toISOString(),
      })
      .eq("doctor_id", input.doctorId);

    if (credentialError) {
      throw credentialError;
    }
  }
}
