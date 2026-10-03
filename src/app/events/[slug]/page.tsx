import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Calendar, Clock, MapPin, ArrowLeft, ExternalLink, Share2, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await DataService.getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.eventDate) < new Date();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Events', href: '/events' },
          { label: event.title },
        ]}
      />

      <Link
        href="/events"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all events</span>
      </Link>

      {/* Main Poster */}
      {event.posterUrl && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
            {event.category || 'Campus Event'}
          </span>
          {isPast && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Concluded
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {event.title}
        </h1>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase">Date</div>
              <div className="font-bold text-slate-800">{formatDate(event.eventDate)}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase">Time</div>
              <div className="font-bold text-slate-800">{event.eventTime || '10:00 AM'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase">Venue</div>
              <div className="font-bold text-slate-800 truncate max-w-[200px]">{event.venue}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">About the Event</h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Registration CTA if active */}
        {event.registrationUrl && !isPast && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Open for Registrations</h4>
              <p className="text-xs text-slate-500">Secure your entry or participation pass online.</p>
            </div>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-red-500/20 transition active:scale-95 w-full sm:w-auto text-center justify-center"
            >
              <span>Register Online</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Gallery snapshots if provided */}
        {event.images && event.images.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Event Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.images.map((img: string, i: number) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={img} alt={`${event.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
