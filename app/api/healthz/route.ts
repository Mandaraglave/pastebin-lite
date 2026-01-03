import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// 🔴 FORCE NODE RUNTIME
export const runtime = "nodejs";

export async function GET() {
  try {
    const redis = getRedis();

    await redis.set("healthz", "1", { ex: 5 });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("healthz error:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
