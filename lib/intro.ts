export const INTRO_STORAGE_KEY = "bhairava-intro-played";
export const INTRO_COMPLETE_EVENT = "landing-intro-complete";

export function hasIntroPlayed(): boolean {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(INTRO_STORAGE_KEY) === "true" ||
    sessionStorage.getItem("intro-played") === "true"
  );
}

export function markIntroPlayed() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
}

export function dispatchIntroComplete() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
}
