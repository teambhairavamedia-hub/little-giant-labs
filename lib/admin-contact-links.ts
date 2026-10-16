const EMAIL_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const LINKEDIN_PROFILE_PATH = /^\/in\/[A-Za-z0-9_.-]+\/?$/;

export function normalizeContactEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function normalizeLinkedInProfileUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      !["linkedin.com", "www.linkedin.com"].includes(hostname) ||
      url.port || url.username || url.password || url.search || url.hash ||
      !LINKEDIN_PROFILE_PATH.test(url.pathname)
    ) return null;
    return `https://www.linkedin.com${url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`}`;
  } catch {
    return null;
  }
}
