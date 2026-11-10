// Cloudflare Turnstile ("are you a robot?") check for the enquiry form. Off until both keys are set:
// NEXT_PUBLIC_TURNSTILE_SITE_KEY (shown in the browser) and TURNSTILE_SECRET_KEY (server only).

export const TURNSTILE_TOKEN_HEADER = "x-turnstile-token";
/** The widget's action name; the server accepts only tokens issued for it */
export const TURNSTILE_ACTION = "enquiry";
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** The public site key, or null when the check is off. Safe to read in the browser. */
export function turnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
}

/** Server only: the check is required when both the site key and the secret key are configured. */
export function isTurnstileRequired(): boolean {
  return Boolean(turnstileSiteKey() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

/**
 * Server only: asks Cloudflare whether the token from the form is genuine, unused and issued for the enquiry form.
 * Fails closed: if Cloudflare can't be reached, the enquiry is refused and the visitor can try again.
 */
export async function verifyTurnstileToken(token: string | null, remoteIp: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(8000) });
    const result = (await response.json()) as { success?: boolean; action?: string };
    return result.success === true && result.action === TURNSTILE_ACTION;
  } catch {
    return false;
  }
}
