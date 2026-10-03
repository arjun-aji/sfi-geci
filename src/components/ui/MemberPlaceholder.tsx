import React from 'react';

interface MemberPlaceholderProps {
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

export default function MemberPlaceholder({
  className = '',
  size = 'md',
}: MemberPlaceholderProps) {
  // Dimension tokens if not overridden by className
  const sizeClasses = {
    lg: 'w-44 h-44 sm:w-48 sm:h-48',
    md: 'w-32 h-32 sm:w-36 sm:h-36',
    sm: 'w-20 h-20 sm:w-24 sm:h-24',
    xs: 'w-10 h-10',
  }[size];

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center overflow-hidden select-none shrink-0 ${sizeClasses} ${className}`}
      aria-label="Member silhouette placeholder"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-slate-200/50" />

      {/* Modern stylized person silhouette */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4 text-slate-400/90 relative z-10 drop-shadow-2xs"
      >
        {/* Head */}
        <circle cx="60" cy="42" r="22" fill="currentColor" opacity="0.9" />
        {/* Collar / neck detail */}
        <path
          d="M52 62C52 62 56 68 60 68C64 68 68 62 68 62"
          stroke="#cbd5e1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Shoulders / Torso */}
        <path
          d="M20 108C20 90.3269 34.3269 76 52 76H68C85.6731 76 100 90.3269 100 108V114H20V108Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Subtle shirt collar contour */}
        <path
          d="M48 76L60 90L72 76"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
