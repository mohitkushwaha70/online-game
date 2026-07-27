'use client';

const COLORS = ['#FF6B35','#4ECDC4','#9B5DE5','#00BBF9','#F15BB5','#FEE440','#00F5D4','#7B2FF7','#FF006E','#3A86FF','#FF9F1C','#2EC4B6','#E71D36','#FF4365','#70D6FF','#C77DFF'];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function adjColor(hex: string, amt: number) {
  let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function GameThumbnail({ name, color, width = 273, height = 153, className = '' }: {
  name: string; color?: string; width?: number; height?: number; className?: string;
}) {
  const c = color || hashStr(name);
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c}"/><stop offset="100%" style="stop-color:${adjColor(c, -40)}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)" rx="8"/><text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle" font-family="Rajdhani,Arial" font-size="36" font-weight="900" fill="rgba(255,255,255,.25)">${initials}</text><text x="50%" y="68%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial" font-size="12" font-weight="700" fill="rgba(255,255,255,.8)">${name.length > 20 ? name.slice(0, 18) + '...' : name}</text></svg>`;
  return <img src={`data:image/svg+xml,${encodeURIComponent(svg)}`} alt={name} width={width} height={height} className={className} loading="lazy" />;
}

export function UserAvatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  if (src) return <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover" />;
  const c = hashStr(name);
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${c}, ${adjColor(c, -30)})`, fontSize: size * 0.4 }}>
      {name[0].toUpperCase()}
    </div>
  );
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

export function timeAgo(date: string | Date): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 2592000) return Math.floor(s / 86400) + 'd ago';
  return Math.floor(s / 2592000) + 'mo ago';
}

export function Badge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    hot: { label: '🔥 Hot', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
    new: { label: '✨ New', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    top: { label: '⭐ Top', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    originals: { label: '💎 OG', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    updated: { label: '🔄 Up', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  };
  const b = map[type];
  if (!b) return null;
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${b.cls}`}>{b.label}</span>;
}
