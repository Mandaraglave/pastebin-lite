import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const pong = await redis.ping();
    return NextResponse.json({ ok: true, redis: pong === "PONG" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
