import React, { useState, useEffect } from 'react';

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  avatarInitial?: string;
  avatarColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  avatarInitial,
  avatarColor = 'bg-teal-600',
  size = 'md',
  shape = 'rounded',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const initial = avatarInitial || (name ? name.charAt(0).toUpperCase() : '?');

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28 text-3xl sm:text-4xl',
  }[size];

  const shapeClass = shape === 'circle'
    ? 'rounded-full'
    : (size === '2xl' || size === 'xl' ? 'rounded-3xl' : 'rounded-2xl');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden font-bold select-none text-white ${avatarColor} ${shapeClass} ${sizeClasses} ${className}`}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};
