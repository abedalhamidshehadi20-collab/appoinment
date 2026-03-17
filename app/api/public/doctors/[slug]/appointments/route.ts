import { NextResponse } from "next/server";
import { nextId, readData, updateData } from "@/lib/cms";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: Params) {
  const { slug } = await context.params;
  const formData = await request.formData();
  const data = await readData();
  const doctor = data.projects.find((item) => item.slug === slug);

  if (!doctor) {
    return NextResponse.redirect(new URL("/doctors", request.url));
  }

  await updateData((store) => {
    store.interests.unshift({
      id: nextId("int"),
      projectId: doctor.id,
      projectTitle: doctor.title,
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      company: formData.get("company")?.toString() ?? "",
      budget: formData.get("budget")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      createdAt: new Date().toISOString(),
    });
  });

  const redirectUrl = new URL(`/doctors/${slug}?sent=1`, request.url);
  return NextResponse.redirect(redirectUrl);
}
