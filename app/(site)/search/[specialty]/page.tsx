import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ specialty: string }>;
  searchParams: Promise<{ q?: string }>;
};

function decodeSpecialty(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function SpecialtySearchPage({ params, searchParams }: Props) {
  const { specialty } = await params;
  const rawQuery = (await searchParams).q?.trim() ?? "";
  const paramsForRedirect = new URLSearchParams({
    specialty: decodeSpecialty(specialty),
  });

  if (rawQuery) {
    paramsForRedirect.set("q", rawQuery);
  }

  redirect(`/doctors?${paramsForRedirect.toString()}`);
}
