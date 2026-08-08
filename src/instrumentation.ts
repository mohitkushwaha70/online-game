export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const INTERVAL_MS = 10 * 60 * 1000;
  const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/ping` : '';

  if (!url || baseUrl?.includes('localhost')) return;

  const ping = async () => {
    try {
      await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
    } catch {}
  };

  await ping();
  const id = setInterval(ping, INTERVAL_MS);
  if (typeof id === 'object' && 'unref' in id) id.unref();
}
