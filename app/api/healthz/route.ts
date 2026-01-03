import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = getRedis();

    // Verify real persistence access (Upstash-safe)
    await redis.set("healthz", "1", { ex: 5 });

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 200 }
    );
  }
}
