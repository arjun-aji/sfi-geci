'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, ExternalLink, ChevronRight } from 'lucide-react';

interface AnnouncementItem {
  _id: string;
  title: string;
  priority?: 'normal' | 'important' | 'urgent';
  shortDescription?: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
        } else {
          setAnnouncements([]);
        }
      })
      .catch(() => {
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || announcements.length === 0) {
    return null;
  }

  // Duplicate array so marquee seamlessly loops continuously
  const marqueeItems = [...announcements, ...announcements];

  return (
    <div className="relative w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white text-xs border-b border-red-950/40 overflow-hidden shadow-inner">
      <div className="container mx-auto px-2 sm:px-4 flex items-center h-8 sm:h-9">
        {/* Left Pinned Badge */}
        <div className="flex items-center gap-1.5 shrink-0 z-20 pr-3 sm:pr-4 bg-gradient-to-r from-slate-950 via-slate-950 to-transparent">
          <span className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded shadow-xs transition">
            <Megaphone className="w-3 h-3 text-yellow-300 animate-pulse" />
            <span>Updates</span>
          </span>
        </div>

        {/* Sliding Announcement Marquee Bar */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          {/* Subtle fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee whitespace-nowrap flex items-center gap-6 text-xs text-slate-200">
            {marqueeItems.map((item, idx) => (
              <span key={`${item._id}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                {item.priority === 'urgent' && (
                  <span className="bg-red-600/90 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wide shadow-2xs">
                    Urgent
                  </span>
                )}
                {item.priority === 'important' && (
                  <span className="bg-amber-500/80 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wide shadow-2xs">
                    Notice
                  </span>
                )}

                <Link
                  href={item._id.startsWith('default-') ? '/announcements' : `/announcements/${item._id}`}
                  className="hover:text-red-400 hover:underline transition-colors font-medium text-slate-100 flex items-center gap-1 cursor-pointer"
                  title={item.title}
                >
                  <span>{item.title}</span>
                </Link>

                <span className="text-red-500/50 text-[10px] font-bold select-none ml-2">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Pinned Quick Link */}
        <div className="shrink-0 pl-3 sm:pl-4 z-20 flex items-center gap-3 bg-gradient-to-l from-slate-950 via-slate-950 to-transparent">
          <Link
            href="/announcements"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition whitespace-nowrap"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3 text-red-500" />
          </Link>
          <Link
            href="/complaints/track"
            className="text-[11px] font-semibold text-rose-300 hover:text-white transition whitespace-nowrap hidden md:inline-block border-l border-slate-800 pl-3"
          >
            Track Grievance
          </Link>
        </div>
      </div>
    </div>
  );
}
