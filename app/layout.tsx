export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Pastebin Lite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial' }}>
        <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>{children}</main>
      </body>
    </html>
  );
}
