import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/pastes/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function PastePage({ params }: { params: { id: string } }) {
  const data = await getPaste(params.id);
  if (!data) {
    notFound();
  }
  const html = escapeHtml(data.content);
  return (
    <div>
      <p><Link href="/">Create another</Link></p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{html}</pre>
    </div>
  );
}
