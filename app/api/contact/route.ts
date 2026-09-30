import { NextResponse } from "next/server";
import { getContactProvider } from "@/lib/contact/providers";
import { validateContact } from "@/lib/contact/validation";

const MAX_BODY_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per-instance rate limit. Good enough to stop casual abuse of a
// personal contact form without adding infrastructure.
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function GET() {
  return NextResponse.json({ enabled: getContactProvider() !== null });
}

export async function POST(request: Request) {
  const provider = getContactProvider();
  if (!provider) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success.
  if (payload && typeof payload === "object" && (payload as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(payload);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "invalid", fields: result.errors }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    await provider.send(result.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[contact] ${provider.id} delivery failed`, error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
