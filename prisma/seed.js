/* eslint-disable no-console */
const demoDoctorId = "prj_2";
const demoPatients = [
  {
    id: "pat_demo_1",
    name: "Maya Rahal",
    email: "maya.rahal@example.com",
    phone: "+96170111222",
    address: "Saida, Lebanon",
    date_of_birth: "1991-04-12",
    gender: "Female",
    medical_history: "Seasonal allergies and migraines.",
  },
  {
    id: "pat_demo_2",
    name: "Karim Haddad",
    email: "karim.haddad@example.com",
    phone: "+96170111333",
    address: "Tyre, Lebanon",
    date_of_birth: "1986-11-03",
    gender: "Male",
    medical_history: "Type 2 diabetes under monitoring.",
  },
];

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const existingDoctor = await prisma.doctor.findFirst({
    where: { id: demoDoctorId },
    select: { id: true },
  });

  if (!existingDoctor) {
    console.log("Seed skipped: doctor prj_2 was not found.");
    await prisma.$disconnect();
    return;
  }

  for (const patient of demoPatients) {
    await prisma.patient.upsert({
      where: { id: patient.id },
      update: patient,
      create: {
        ...patient,
        password: "patient123",
        reminderOptIn: true,
      },
    });
  }

  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  await prisma.appointment.upsert({
    where: { id: "apt_doc_demo_1" },
    update: {
      doctorId: demoDoctorId,
      doctorName: "Dr. Khan Adel",
      patientId: "pat_demo_1",
      name: "Maya Rahal",
      email: "maya.rahal@example.com",
      phone: "+96170111222",
      appointmentDate: isoDate,
      appointmentTime: "10:00 AM",
      service: "Follow-up Consultation",
      status: "Pending",
      location: "North Branch",
      message: "Reviewing skin treatment progress.",
    },
    create: {
      id: "apt_doc_demo_1",
      doctorId: demoDoctorId,
      doctorName: "Dr. Khan Adel",
      patientId: "pat_demo_1",
      name: "Maya Rahal",
      email: "maya.rahal@example.com",
      phone: "+96170111222",
      appointmentDate: isoDate,
      appointmentTime: "10:00 AM",
      service: "Follow-up Consultation",
      status: "Pending",
      location: "North Branch",
      message: "Reviewing skin treatment progress.",
      notes: "",
    },
  });

  await prisma.appointment.upsert({
    where: { id: "apt_doc_demo_2" },
    update: {
      doctorId: demoDoctorId,
      doctorName: "Dr. Khan Adel",
      patientId: "pat_demo_2",
      name: "Karim Haddad",
      email: "karim.haddad@example.com",
      phone: "+96170111333",
      appointmentDate: tomorrowDate,
      appointmentTime: "01:30 PM",
      service: "Dermatology Review",
      status: "Completed",
      location: "North Branch",
      message: "Post-treatment follow up.",
    },
    create: {
      id: "apt_doc_demo_2",
      doctorId: demoDoctorId,
      doctorName: "Dr. Khan Adel",
      patientId: "pat_demo_2",
      name: "Karim Haddad",
      email: "karim.haddad@example.com",
      phone: "+96170111333",
      appointmentDate: tomorrowDate,
      appointmentTime: "01:30 PM",
      service: "Dermatology Review",
      status: "Completed",
      location: "North Branch",
      message: "Post-treatment follow up.",
      notes: "",
    },
  });

  await prisma.medicalRecord.upsert({
    where: { id: "rec_demo_1" },
    update: {
      doctorId: demoDoctorId,
      patientId: "pat_demo_1",
      diagnosis: "Mild eczema flare-up",
      notes: "Recommended hydration routine and topical cream.",
      attachments: ["https://example.com/records/eczema-plan.pdf"],
    },
    create: {
      id: "rec_demo_1",
      doctorId: demoDoctorId,
      patientId: "pat_demo_1",
      diagnosis: "Mild eczema flare-up",
      notes: "Recommended hydration routine and topical cream.",
      attachments: ["https://example.com/records/eczema-plan.pdf"],
    },
  });

  await prisma.prescription.upsert({
    where: { id: "prx_demo_1" },
    update: {
      doctorId: demoDoctorId,
      patientId: "pat_demo_1",
      medication: "Hydrocortisone Cream",
      dosage: "Apply twice daily",
      duration: "14 days",
      instructions: "Apply after cleansing and avoid eye area.",
    },
    create: {
      id: "prx_demo_1",
      doctorId: demoDoctorId,
      patientId: "pat_demo_1",
      medication: "Hydrocortisone Cream",
      dosage: "Apply twice daily",
      duration: "14 days",
      instructions: "Apply after cleansing and avoid eye area.",
    },
  });

  await prisma.notification.upsert({
    where: { id: "ntf_demo_1" },
    update: {
      doctorId: demoDoctorId,
      appointmentId: "apt_doc_demo_1",
      title: "Upcoming appointment",
      message: "Maya Rahal has a follow-up consultation today at 10:00 AM.",
      type: "appointment",
      isRead: false,
      readAt: null,
    },
    create: {
      id: "ntf_demo_1",
      doctorId: demoDoctorId,
      appointmentId: "apt_doc_demo_1",
      title: "Upcoming appointment",
      message: "Maya Rahal has a follow-up consultation today at 10:00 AM.",
      type: "appointment",
      isRead: false,
    },
  });

  console.log("Doctor dashboard seed complete.");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
