"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const body: any = { content };
      if (ttl.trim() !== "") body.ttl_seconds = Number(ttl);
      if (maxViews.trim() !== "") body.max_views = Number(maxViews);
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to create paste");
      } else {
        setResult(data.url);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Pastebin Lite</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste content" rows={8} required />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input type="number" min={1} value={ttl} onChange={(e) => setTtl(e.target.value)} placeholder="ttl_seconds (optional)" />
          <input type="number" min={1} value={maxViews} onChange={(e) => setMaxViews(e.target.value)} placeholder="max_views (optional)" />
        </div>
        <button disabled={loading} type="submit">{loading ? 'Creating…' : 'Create paste'}</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {result && (
        <p>
          Share URL: <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}
