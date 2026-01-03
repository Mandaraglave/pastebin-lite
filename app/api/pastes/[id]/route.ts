import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

async function getAndCountView(id: string, now: number) {
  const dataKey = `paste:data:${id}`;
  const viewsKey = `paste:views:${id}`;
  const expKey = `paste:exp:${id}`;

  const script = `
local data = redis.call('GET', KEYS[1])
if not data then return {"ERR","NOTFOUND"} end
local exp = redis.call('GET', KEYS[3])
if exp then
  local now = tonumber(ARGV[1])
  local expn = tonumber(exp)
  if now >= expn then return {"ERR","EXPIRED"} end
end
local remaining
local exists = redis.call('EXISTS', KEYS[2])
if exists == 1 then
  remaining = tonumber(redis.call('GET', KEYS[2]))
  if not remaining then return {"ERR","NOTFOUND"} end
  if remaining <= 0 then return {"ERR","MAXVIEWS"} end
  remaining = tonumber(redis.call('DECR', KEYS[2]))
  if remaining < 0 then
    redis.call('SET', KEYS[2], 0)
    return {"ERR","MAXVIEWS"}
  end
else
  remaining = -1
end
return {"OK", data, tostring(remaining), exp or ""}
`;

  const res = await redis.eval(script, [dataKey, viewsKey, expKey], [now.toString()]);
  return res as any;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const now = getNowMs(req);
  const result = await getAndCountView(id, now);

  if (!Array.isArray(result)) {
    return NextResponse.json({ error: "unavailable" }, { status: 404 });
  }
  const tag = result[0];
  if (tag !== "OK") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const content: string = result[1];
  const remainingRaw: string = result[2];
  const expRaw: string = result[3];

  const remaining = remainingRaw === "-1" ? null : Math.max(0, Number(remainingRaw));
  const expiresAt = expRaw ? new Date(Number(expRaw)).toISOString() : null;

  return NextResponse.json({ content, remaining_views: remaining, expires_at: expiresAt }, { status: 200 });
}
