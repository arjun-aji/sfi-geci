'use client';

import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import MemberPlaceholder from './MemberPlaceholder';
import { normalizePosition, formatComradeName } from '@/lib/member-constants';

interface MemberData {
  _id: string;
  name: string;
  position: string;
  department?: string;
  semester?: string;
  academicYear?: string;
  photoUrl?: string;
  bio?: string;
  phone?: string;
  email?: string;
}

interface MemberCardProps {
  member: MemberData;
  size?: 'large' | 'medium' | 'small';
}

export default function MemberCard({ member, size = 'medium' }: MemberCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const position = normalizePosition(member.position);
  const displayName = formatComradeName(member.name);
  const hasPhoto = Boolean(member.photoUrl && member.photoUrl.trim() && !imgFailed);
  const hasCustomDept = member.department && member.department !== 'GECI' && member.semester && member.semester !== 'Unit';

  // =========================================================================
  // 1. LARGE CARD (President & Secretary)
  // =========================================================================
  if (size === 'large') {
    return (
      <div className="bg-white rounded-3xl border-2 border-red-100 hover:border-red-400 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between group relative overflow-hidden">
        {/* Subtle decorative top highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

        <div className="flex flex-col items-center w-full">
          {/* Position Badge */}
          <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-red-600 text-white shadow-xs mb-5">
            {position}
          </span>

          {/* Large Profile Photo / Silhouette Placeholder */}
          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden p-1 ring-4 ring-red-500/10 group-hover:ring-red-500/30 transition-all duration-300 shadow-lg bg-slate-100 mb-5 relative flex items-center justify-center">
            {hasPhoto ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <MemberPlaceholder size="lg" className="w-full h-full rounded-xl" />
            )}
          </div>

          {/* Full Name */}
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tight">
            {displayName}
          </h3>

          {/* Department & Semester (if custom provided) */}
          {hasCustomDept && (
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              {member.department} • {member.semester}
            </p>
          )}

          {/* Bio if provided */}
          {member.bio && (
            <p className="text-xs sm:text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed px-4 italic">
              "{member.bio}"
            </p>
          )}

          {/* Clickable Phone Number */}
          {member.phone && (
            <div className="mt-5 w-full pt-4 border-t border-slate-100 flex justify-center">
              <a
                href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-red-700 bg-red-50 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-xl border border-red-200 transition duration-200 shadow-2xs group/btn"
                title={`Call ${displayName}`}
              >
                <Phone className="w-4 h-4 text-red-600 group-hover/btn:text-white transition-colors" />
                <span className="tracking-wide font-mono">{member.phone}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MEDIUM CARD (Vice Presidents, Joint Secretaries, Secretariat)
  // =========================================================================
  if (size === 'medium') {
    return (
      <div className="w-full h-full bg-white rounded-2xl border border-slate-200/90 hover:border-red-300 p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-200 text-center flex flex-col items-center justify-between group">
        <div className="flex flex-col items-center w-full">
          {/* Position Badge */}
          <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-50 text-red-700 border border-red-100 mb-3 sm:mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
            {position}
          </span>

          {/* Medium Profile Photo / Placeholder */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden p-1 ring-4 ring-slate-100 group-hover:ring-red-300/40 transition-all duration-300 shadow-md bg-slate-100 mb-3.5 sm:mb-4 flex items-center justify-center">
            {hasPhoto ? (
              <img
                src={member.photoUrl}
                alt={displayName}
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <MemberPlaceholder size="md" className="w-full h-full rounded-xl" />
            )}
          </div>

          {/* Name */}
          <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
            {displayName}
          </h4>

          {/* Department & Semester (if custom provided) */}
          {hasCustomDept && (
            <p className="text-xs font-bold text-slate-500 mt-1">
              {member.department} • {member.semester}
            </p>
          )}

          {/* Clickable Phone Number */}
          {member.phone && (
            <div className="mt-3">
              <a
                href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 bg-red-50/80 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-100 transition duration-150"
                title={`Call ${displayName}`}
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span className="font-mono text-[11px]">{member.phone}</span>
              </a>
            </div>
          )}

          {/* Bio if present */}
          {member.bio && (
            <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed px-2 italic">
              "{member.bio}"
            </p>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. SMALL CARD (Unit Members)
  // =========================================================================
  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-red-300 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-between group">
      <div className="flex flex-col items-center w-full">
        {/* Small Profile Photo / Placeholder */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-red-400/40 transition-all duration-200 shadow-2xs bg-slate-100 mb-2.5 flex items-center justify-center">
          {hasPhoto ? (
            <img
              src={member.photoUrl}
              alt={displayName}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <MemberPlaceholder size="sm" className="w-full h-full rounded-lg" />
          )}
        </div>

        {/* Name */}
        <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
          {displayName}
        </h5>

        {/* Position */}
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-0.5 block">
          Unit Member
        </span>

        {/* Phone if present */}
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-red-600 mt-1"
            title={`Call ${displayName}`}
          >
            <Phone className="w-3 h-3 text-red-500" />
            <span>{member.phone}</span>
          </a>
        )}

        {/* Department & Semester */}
        {hasCustomDept && (
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {member.department} • {member.semester}
          </p>
        )}
      </div>
    </div>
  );
}
