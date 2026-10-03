import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    posterUrl?: string;
    eventDate: string | Date;
    eventTime?: string;
    venue: string;
    category?: string;
    registrationUrl?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const isPast = new Date(event.eventDate) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Poster / Thumbnail */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
          {event.posterUrl ? (
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-rose-700 text-white font-extrabold text-2xl">
              SFI GECI
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
              {event.category || 'Event'}
            </span>
          </div>

          {/* Status Badge */}
          {isPast && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-300">
                Concluded
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 text-xs text-red-600 font-bold mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(event.eventDate)}</span>
            </span>
            {event.eventTime && (
              <>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.eventTime}</span>
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {event.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1 flex items-center justify-between">
        <Link
          href={`/events/${event.slug}`}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group-hover:underline"
        >
          <span>View Event Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {event.registrationUrl && !isPast && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            Register Now
          </a>
        )}
      </div>
    </div>
  );
}
