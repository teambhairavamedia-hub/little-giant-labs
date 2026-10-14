import { NextResponse } from "next/server";

// No application persistence provider is configured in this repository yet.
// Keep submissions explicitly unsuccessful until a real backend is connected.
export async function POST() {
  return NextResponse.json(
    { error: "Application submission is temporarily unavailable because secure application storage is not configured. Your answers have not been submitted." },
    { status: 503 },
  );
}
