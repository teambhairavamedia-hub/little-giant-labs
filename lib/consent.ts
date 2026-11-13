// Visitor's choice about analytics cookies (Google Analytics, Meta Pixel). Nothing that sets those cookies loads until
// the visitor accepts. The choice is kept in localStorage and can be changed from the footer's "Cookie settings".

export type ConsentChoice = "accepted" | "rejected";

export const CONSENT_STORAGE_KEY = "lgl-cookie-consent";
const OPEN_EVENT = "lgl-consent-open";
const CHANGE_EVENT = "lgl-consent-change";

export function parseConsent(value: string | null | undefined): ConsentChoice | null {
  return value === "accepted" || value === "rejected" ? value : null;
}

/* Runs in <head> before the first paint (like the theme script): marks <html> when the visitor has already chosen, so
   the cookie banner that is part of the server HTML stays hidden for them instead of flashing until scripts load. */
export const consentInitScript = `(function(){try{var c=localStorage.getItem("${CONSENT_STORAGE_KEY}");if(c==="accepted"||c==="rejected")document.documentElement.dataset.consent="chosen"}catch(e){}})()`;

/** Browser only. The stored choice, or null if the visitor hasn't chosen yet (or storage is unavailable). */
export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* storage unavailable: the choice applies to this page view only */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }));
}

/** Notifies on a change of choice in this tab or another open tab. */
export function subscribeConsent(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => { if (event.key === CONSENT_STORAGE_KEY) onChange(); };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Reopens the cookie banner, e.g. from the footer's "Cookie settings" link. */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeConsentOpen(onOpen: () => void): () => void {
  window.addEventListener(OPEN_EVENT, onOpen);
  return () => window.removeEventListener(OPEN_EVENT, onOpen);
}
