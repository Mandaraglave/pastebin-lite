import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { getNowMs } from "@/lib/time";
import { buildPublicUrl } from "@/lib/url";
export const runtime = "nodejs";

function isValidInt(v: any): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1;
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const content = body?.content;
  const ttlSeconds = body?.ttl_seconds;
  const maxViews = body?.max_views;

  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "content_required" }, { status: 400 });
  }
  if (ttlSeconds !== undefined && !isValidInt(ttlSeconds)) {
    return NextResponse.json({ error: "invalid_ttl_seconds" }, { status: 400 });
  }
  if (maxViews !== undefined && !isValidInt(maxViews)) {
    return NextResponse.json({ error: "invalid_max_views" }, { status: 400 });
  }

  const id = nanoid(12);
  const now = getNowMs(req);
  const expiresAtMs = ttlSeconds ? now + ttlSeconds * 1000 : null;

  const dataKey = `paste:data:${id}`;
  const viewsKey = `paste:views:${id}`;
  const expKey = `paste:exp:${id}`;

  const redis = getRedis();
  const ops: Promise<any>[] = [redis.set(dataKey, content)];
  if (maxViews !== undefined) ops.push(redis.set(viewsKey, String(maxViews)));
  if (expiresAtMs !== null) ops.push(redis.set(expKey, String(expiresAtMs)));
  await Promise.all(ops);

  const base = buildPublicUrl(req);
  const url = `${base}/p/${id}`;
  return NextResponse.json({ id, url }, { status: 201 });
}
