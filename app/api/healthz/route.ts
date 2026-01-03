import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasRedisConfig =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  return NextResponse.json(
    { ok: hasRedisConfig },
    { status: 200 }
  );
}
