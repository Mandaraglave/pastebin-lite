import { NextRequest } from "next/server";

export function getNowMs(req: NextRequest): number {
  const testMode = process.env.TEST_MODE === "1";
  if (testMode) {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const v = Number(header);
      if (!Number.isNaN(v) && Number.isFinite(v) && v >= 0) return Math.floor(v);
    }
  }
  return Date.now();
}
