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
      className={`rounded-full bg-gradient-to-br from-[#00e5ff] to-[#8b5cf6] flex items-center justify-center font-bold text-white shrink-0 shadow-[0_2px_10px_-2px_rgba(0,229,255,0.4)] ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.4)) }}
    >
      {username?.[0]?.toUpperCase() || 'U'}
    </div>
  );
}
