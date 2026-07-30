const STORAGE_KEY = 'opencode_recent_games';
const MAX_ITEMS = 20;

export interface RecentGameEntry {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
  color?: string;
  category?: { name: string; slug: string } | string;
  categorySlug?: string;
  rating?: number;
  totalPlays?: number;
  playedAt: number;
}

export function getRecentGames(): RecentGameEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addRecentGame(game: {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  color?: string;
  category?: any;
  categorySlug?: string;
  rating?: number;
  totalPlays?: number;
}) {
  if (typeof window === 'undefined') return;
  try {
    const list = getRecentGames().filter(g => g.slug !== game.slug);
    list.unshift({
      _id: game._id,
      name: game.name,
      slug: game.slug,
      thumbnail: game.thumbnail || '',
      color: game.color,
      category: game.category,
      categorySlug: game.categorySlug,
      rating: game.rating,
      totalPlays: game.totalPlays,
      playedAt: Date.now(),
    });
    if (list.length > MAX_ITEMS) list.length = MAX_ITEMS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}
