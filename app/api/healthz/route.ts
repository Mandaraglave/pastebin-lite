import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = getRedis();

    // verify persistence access (safe for Upstash)
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
