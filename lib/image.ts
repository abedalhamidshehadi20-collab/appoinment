const FALLBACK_DOCTOR_IMAGE = "/doctor-placeholder.svg";

export function getSafeImageSrc(value: string | null | undefined, fallback = FALLBACK_DOCTOR_IMAGE) {
  const src = (value ?? "").trim();

  if (!src) {
    return fallback;
  }

  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:image/")) {
    return src;
  }

  return fallback;
}

export function getSafeDoctorImageSrc(value: string | null | undefined) {
  return getSafeImageSrc(value, FALLBACK_DOCTOR_IMAGE);
}
