'use client';

import { useState } from 'react';

interface AvatarProps {
  avatar?: string | null;
  username?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ avatar, username, size = 32, className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = avatar && !imgError;

  if (showImage) {
    return (
      <img
        src={avatar as string}
        alt=""
        onError={() => setImgError(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-brand-500 to-brand-400 flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.4)) }}
    >
      {username?.[0]?.toUpperCase() || 'U'}
    </div>
  );
}
