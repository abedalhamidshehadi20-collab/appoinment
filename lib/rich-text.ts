const probableHtmlPattern = /<\/?[a-z][\s\S]*>/i;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function decodeEntities(value: string) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

export function isRichTextHtml(value: string) {
  return probableHtmlPattern.test(value.trim());
}

export function normalizeRichTextContent(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (isRichTextHtml(trimmedValue)) {
    return trimmedValue;
  }

  return trimmedValue
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function stripRichTextToPlainText(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (!isRichTextHtml(trimmedValue)) {
    return trimmedValue;
  }

  const normalizedBreaks = trimmedValue
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|blockquote)>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "- ");

  const withoutTags = normalizedBreaks.replace(/<[^>]+>/g, "");

  return decodeEntities(withoutTags).replace(/\n{3,}/g, "\n\n").trim();
}

export function normalizeLineListContent(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (isRichTextHtml(trimmedValue)) {
    return trimmedValue;
  }

  return trimmedValue
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line.trim())}</p>`)
    .join("");
}

export function stripRichTextToLineListText(value: string) {
  return stripRichTextToPlainText(value)
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^\d+\.\s+/, "")
        .replace(/^[-*]\s+/, "")
        .trim(),
    )
    .filter(Boolean)
    .join("\n");
}

export function toStoredRichTextContent(value: string) {
  const normalizedHtml = normalizeRichTextContent(value);

  return stripRichTextToPlainText(normalizedHtml) ? normalizedHtml : "";
}
