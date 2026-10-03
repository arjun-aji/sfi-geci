import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import EventCard from '@/components/ui/EventCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Calendar, Sparkles } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Campus Events & Fests | SFI GECI',
  description: 'Explore cultural festivals, technical hackathons, workshops, and union activities at GEC Idukki.',
};

export default async function EventsPage() {
  const events = await DataService.getEvents(true);
  const now = new Date();

  const upcomingEvents = events.filter((e) => new Date(e.eventDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.eventDate) < now);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-12">
      <Breadcrumbs items={[{ label: 'Events & Fests' }]} />

      <div className="text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Life & Cultural Pulse</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Events & Celebrations
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
          From the vibrant high-range arts festival DHWANI to national hackathons like ADVAITHA, discover everything happening at Government Engineering College Idukki.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>Upcoming Events</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">{upcomingEvents.length} Scheduled</span>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt._id} event={evt as any} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-500">
            No upcoming events scheduled right now. Check back soon!
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Past Highlights
            </h2>
            <span className="text-xs font-bold text-slate-500">{pastEvents.length} Concluded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
            {pastEvents.map((evt) => (
              <EventCard key={evt._id} event={evt as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
