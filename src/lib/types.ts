export interface Game {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category?: { _id: string; name: string; slug: string; color?: string } | string;
  categorySlug?: string;
  tags: string[];
  thumbnail: string;
  cover?: string;
  embedUrl: string;
  labels?: string[];
  isOriginal?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  mobileFriendly?: boolean;
  status?: string;
  totalPlays?: number;
  totalLikes?: number;
  totalComments?: number;
  rating: number;
  color?: string;
  controls?: string;
  difficulty?: string;
  duration?: string;
  comments?: { username: string; text: string; date?: string }[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  avatar?: string;
  coins?: number;
  xp?: number;
  level?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  gameCount?: number;
  totalPlays?: number;
}
