import { supabase, supabaseAdmin } from './supabase';

export type Permission =
  | 'all'
  | 'home'
  | 'about'
  | 'services'
  | 'projects'
  | 'blogs'
  | 'news'
  | 'contacts'
  | 'interests'
  | 'patients';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: Permission[];
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  password?: string;
  reminder_opt_in?: boolean;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  created_at: string;
};

export type Doctor = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  sector: string;
  location: string;
  status: string;
  cover_image: string;
  gallery: string[];
  details: string[];
  appointment_fee: number;
  years_experience: number;
  available_times: string[];
  created_at: string;
};

export type Specialty = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Appointment = {
  id: string;
  patient_id: string | null;
  doctor_id: string;
  doctor_name: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
  status: string;
  notes: string;
  created_at: string;
};

export type AppointmentReminder = {
  id: string;
  appointment_id: string;
  reminder_date: string;
  recipient_email: string;
  status: 'sent' | 'failed';
  error_message: string | null;
  sent_at: string;
  created_at: string;
};

const DEFAULT_DOCTOR_TIME_SLOTS = [
  "8:00 am",
  "8:30 am",
  "9:00 am",
  "9:30 am",
  "10:00 am",
  "10:30 am",
  "11:00 am",
  "11:30 am",
  "2:00 pm",
  "2:30 pm",
  "3:00 pm",
  "3:30 pm",
  "4:00 pm",
  "4:30 pm",
  "5:00 pm",
];

export type Service = {
  id: string;
  title: string;
  summary: string;
  features: string[];
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  tags: string[];
};

export type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  source: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

export type SiteSettings = {
  home: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: { label: string; value: string }[];
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
  };
  contact: {
    address: string;
    city: string;
    phone: string;
    email: string;
    mapUrl: string;
    workingHours: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
  };
};

// ============================================
// Helper Functions
// ============================================

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export function nextId(prefix: string) {
  return createId(prefix);
}

export function toList(value: FormDataEntryValue | null) {
  return (value?.toString() ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

// ============================================
// Site Settings
// ============================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) throw error;

  const settings: Record<string, unknown> = {};
  data?.forEach((row) => {
    settings[row.key] = row.value;
  });

  return settings as SiteSettings;
}

export async function updateSiteSettings(key: 'home' | 'about', value: unknown) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
}

// ============================================
// Users (Admin/Staff)
// ============================================

export async function findUser(identifier: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .eq('password', password)
    .single();

  if (error) return null;
  return data as User;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as User[];
}

export async function createUser(user: Omit<User, 'id'>) {
  const newUser = { ...user, id: nextId('usr') };
  const { error } = await supabase.from('users').insert(newUser);

  if (error) throw error;
  return newUser;
}

// ============================================
// Patients
// ============================================

export async function findPatientByEmail(email: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .ilike('email', email)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .ilike('email', email)
      .single();

    if (adminError) {
      return null;
    }

    return adminData as Patient;
  }

  if (error) return null;
  return data as Patient;
}

export async function findPatientByCredentials(email: string, password: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .ilike('email', email)
    .eq('password', password)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .ilike('email', email)
      .eq('password', password)
      .single();

    if (adminError) {
      return null;
    }

    return adminData as Patient;
  }

  if (error) return null;
  return data as Patient;
}

export async function getAllPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Patient[];
}

export async function createPatient(patient: Omit<Patient, 'id' | 'created_at'>) {
  const newPatient = {
    ...patient,
    id: nextId('pat'),
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('patients').insert(newPatient);

  if (error?.code === '42501' && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin.from('patients').insert(newPatient);
    if (adminError) throw adminError;
    return newPatient;
  }

  if (error) throw error;
  return newPatient;
}

export async function updatePatientReminderPreference(patientId: string, enabled: boolean) {
  const { error } = await supabase
    .from('patients')
    .update({ reminder_opt_in: enabled })
    .eq('id', patientId);

  if (error?.code === '42501' && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from('patients')
      .update({ reminder_opt_in: enabled })
      .eq('id', patientId);

    if (adminError) throw adminError;
    return;
  }

  if (error) throw error;
}

export async function isPatientReminderEnabled(patientId: string | null, email: string) {
  if (patientId) {
    const { data, error } = await supabase
      .from('patients')
      .select('reminder_opt_in')
      .eq('id', patientId)
      .single();

    if (error?.code === '42501' && supabaseAdmin) {
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('patients')
        .select('reminder_opt_in')
        .eq('id', patientId)
        .single();

      if (adminError) {
        return true;
      }

      return adminData?.reminder_opt_in ?? true;
    }

    if (!error) {
      return data?.reminder_opt_in ?? true;
    }
  }

  if (!email) {
    return true;
  }

  const { data, error } = await supabase
    .from('patients')
    .select('reminder_opt_in')
    .ilike('email', email)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('patients')
      .select('reminder_opt_in')
      .ilike('email', email)
      .single();

    if (adminError) {
      return true;
    }

    return adminData?.reminder_opt_in ?? true;
  }

  if (error) {
    return true;
  }

  return data?.reminder_opt_in ?? true;
}

// ============================================
// Doctors (previously Projects)
// ============================================

export async function getAllDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) throw adminError;
    return adminData as Doctor[];
  }

  if (error) throw error;
  return data as Doctor[];
}

export async function getDoctorBySlug(slug: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (adminError) return null;
    return adminData as Doctor;
  }

  if (error) return null;
  return data as Doctor;
}

export async function getDoctorById(id: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (adminError) return null;
    return adminData as Doctor;
  }

  if (error) return null;
  return data as Doctor;
}

export async function searchDoctorsBySpecialty(specialty: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .ilike('sector', `%${specialty}%`)
    .order('created_at', { ascending: false });

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .ilike('sector', `%${specialty}%`)
      .order('created_at', { ascending: false });

    if (adminError) throw adminError;
    return adminData as Doctor[];
  }

  if (error) throw error;
  return data as Doctor[];
}

export async function createDoctor(doctor: Omit<Doctor, 'id' | 'created_at'>) {
  const newDoctor = {
    ...doctor,
    id: nextId('prj'),
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('doctors').insert(newDoctor);

  if (error) throw error;
  return newDoctor;
}

export async function updateDoctor(id: string, updates: Partial<Doctor>) {
  const { error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteDoctor(id: string) {
  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Appointments (previously Interests)
// ============================================

export async function getAllAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentsByDoctorId(doctorId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentsByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentById(id: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (adminError) return null;
    return adminData as Appointment;
  }

  if (error) return null;
  return data as Appointment;
}

function normalizeSlotValue(value: string) {
  return value.trim().toLowerCase();
}

function normalizeAppointmentStatus(status: string) {
  const value = status.toLowerCase();
  if (value === 'canceled') {
    return 'cancelled';
  }
  if (value === 'confirmed') {
    return 'scheduled';
  }
  if (value === 'done') {
    return 'completed';
  }
  return value;
}

function isBlockedStatus(status: string) {
  const normalized = normalizeAppointmentStatus(status);
  return normalized !== 'cancelled';
}

export async function getDoctorAvailableTimeSlots(doctorId: string) {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    return [] as string[];
  }

  const doctorTimes = doctor.available_times?.map((slot) => slot.trim()).filter(Boolean) ?? [];
  if (doctorTimes.length > 0) {
    return doctorTimes;
  }

  return DEFAULT_DOCTOR_TIME_SLOTS;
}

export async function getDoctorBookedTimeSlots(doctorId: string, appointmentDate: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time,status')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', appointmentDate);

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('appointments')
      .select('appointment_time,status')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', appointmentDate);

    if (adminError) throw adminError;

    return (adminData ?? [])
      .filter((item) => isBlockedStatus(item.status ?? ''))
      .map((item) => normalizeSlotValue(item.appointment_time ?? ''))
      .filter(Boolean);
  }

  if (error) throw error;

  return (data ?? [])
    .filter((item) => isBlockedStatus(item.status ?? ''))
    .map((item) => normalizeSlotValue(item.appointment_time ?? ''))
    .filter(Boolean);
}

export async function getAvailableDoctorTimeSlots(doctorId: string, appointmentDate: string) {
  const [availableSlots, bookedSlots] = await Promise.all([
    getDoctorAvailableTimeSlots(doctorId),
    getDoctorBookedTimeSlots(doctorId, appointmentDate),
  ]);

  if (availableSlots.length === 0) {
    return [] as string[];
  }

  const bookedSet = new Set(bookedSlots);
  return availableSlots.filter((slot) => !bookedSet.has(normalizeSlotValue(slot)));
}

export async function isDoctorTimeSlotAvailable(doctorId: string, appointmentDate: string, appointmentTime: string) {
  const [availableSlots, bookedSlots] = await Promise.all([
    getDoctorAvailableTimeSlots(doctorId),
    getDoctorBookedTimeSlots(doctorId, appointmentDate),
  ]);

  const normalizedSelected = normalizeSlotValue(appointmentTime);
  const normalizedAvailable = new Set(availableSlots.map(normalizeSlotValue));
  const normalizedBooked = new Set(bookedSlots);

  const isWithinDoctorSchedule = normalizedAvailable.has(normalizedSelected);
  const isAlreadyBooked = normalizedBooked.has(normalizedSelected);

  return isWithinDoctorSchedule && !isAlreadyBooked;
}

export async function getAppointmentsForPatient(patientId: string, email: string) {
  const { data: byPatientId, error: byPatientIdError } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  const { data: byEmail, error: byEmailError } = await supabase
    .from('appointments')
    .select('*')
    .ilike('email', email)
    .order('created_at', { ascending: false });

  const canUseAdmin = byPatientIdError?.code === '42501' || byEmailError?.code === '42501';
  if (canUseAdmin && supabaseAdmin) {
    const { data: adminByPatientId, error: adminByPatientIdError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    const { data: adminByEmail, error: adminByEmailError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false });

    if (adminByPatientIdError && adminByEmailError) {
      throw adminByPatientIdError;
    }

    const mergedAdmin = [
      ...(adminByPatientId ?? []),
      ...(adminByEmail ?? []),
    ];

    const dedupedAdmin = Array.from(
      new Map(mergedAdmin.map((item) => [item.id, item])).values(),
    );

    return dedupedAdmin as Appointment[];
  }

  if (byPatientIdError && byEmailError) {
    throw byPatientIdError;
  }

  const merged = [
    ...(byPatientId ?? []),
    ...(byEmail ?? []),
  ];

  const deduped = Array.from(
    new Map(merged.map((item) => [item.id, item])).values(),
  );

  return deduped as Appointment[];
}

export async function getAppointmentsForReminderDate(appointmentDate: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('id,patient_id,name,email,doctor_name,service,appointment_date,appointment_time,status')
    .in('status', ['pending', 'scheduled', 'confirmed'])
    .eq('appointment_date', appointmentDate)
    .order('appointment_time', { ascending: true });

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('appointments')
      .select('id,patient_id,name,email,doctor_name,service,appointment_date,appointment_time,status')
      .in('status', ['pending', 'scheduled', 'confirmed'])
      .eq('appointment_date', appointmentDate)
      .order('appointment_time', { ascending: true });

    if (adminError) throw adminError;

    return adminData ?? [];
  }

  if (error) throw error;

  return data ?? [];
}

export async function hasSentAppointmentReminder(appointmentId: string, reminderDate: string) {
  const { data, error } = await supabase
    .from('appointment_reminders')
    .select('id')
    .eq('appointment_id', appointmentId)
    .eq('reminder_date', reminderDate)
    .eq('status', 'sent')
    .limit(1);

  if (error?.code === '42501' && supabaseAdmin) {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('appointment_reminders')
      .select('id')
      .eq('appointment_id', appointmentId)
      .eq('reminder_date', reminderDate)
      .eq('status', 'sent')
      .limit(1);

    if (adminError) throw adminError;

    return (adminData?.length ?? 0) > 0;
  }

  if (error) throw error;

  return (data?.length ?? 0) > 0;
}

export async function createAppointmentReminderLog(input: {
  appointmentId: string;
  reminderDate: string;
  recipientEmail: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
}) {
  const payload = {
    id: nextId('rmd'),
    appointment_id: input.appointmentId,
    reminder_date: input.reminderDate,
    recipient_email: input.recipientEmail,
    status: input.status,
    error_message: input.errorMessage ?? null,
    sent_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('appointment_reminders').insert(payload);

  if (error?.code === '42501' && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from('appointment_reminders')
      .insert(payload);

    if (adminError) throw adminError;
    return;
  }

  if (error) throw error;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>) {
  const newAppointment = {
    ...appointment,
    id: nextId('int'),
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('appointments').insert(newAppointment);

  if (error?.code === '42501' && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin.from('appointments').insert(newAppointment);
    if (adminError) throw adminError;
    return newAppointment;
  }

  if (error) throw error;
  return newAppointment;
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const { error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Services
// ============================================

export async function getAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
}

export async function createService(service: Omit<Service, 'id'>) {
  const newService = { ...service, id: nextId('svc') };
  const { error } = await supabase.from('services').insert(newService);

  if (error) throw error;
  return newService;
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Blogs
// ============================================

export async function getAllBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as Blog[];
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Blog;
}

export async function createBlog(blog: Omit<Blog, 'id'>) {
  const newBlog = { ...blog, id: nextId('blg') };
  const { error } = await supabase.from('blogs').insert(newBlog);

  if (error) throw error;
  return newBlog;
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
  const { error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteBlog(id: string) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// News
// ============================================

export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as News;
}

export async function createNews(news: Omit<News, 'id'>) {
  const newNews = { ...news, id: nextId('nws') };
  const { error } = await supabase.from('news').insert(newNews);

  if (error) throw error;
  return newNews;
}

export async function updateNews(id: string, updates: Partial<News>) {
  const { error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Contacts
// ============================================

export async function getAllContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Contact[];
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at'>) {
  const newContact = {
    ...contact,
    id: nextId('cnt'),
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('contacts').insert(newContact);

  if (error) throw error;
  return newContact;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// Specialties
// ============================================

export async function getAllSpecialties() {
  const { data, error } = await supabase
    .from('specialties')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Specialty[];
}

export async function getFeaturedSpecialties() {
  const { data, error } = await supabase
    .from('specialties')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Specialty[];
}

export async function getSpecialtyBySlug(slug: string) {
  const { data, error } = await supabase
    .from('specialties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Specialty;
}

export async function createSpecialty(specialty: Omit<Specialty, 'id' | 'created_at'>) {
  const newSpecialty = {
    ...specialty,
    id: nextId('spc'),
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('specialties').insert(newSpecialty);

  if (error) throw error;
  return newSpecialty;
}

export async function updateSpecialty(id: string, updates: Partial<Specialty>) {
  const { error } = await supabase
    .from('specialties')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteSpecialty(id: string) {
  const { error } = await supabase
    .from('specialties')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
