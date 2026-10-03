import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Bell, Calendar, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export const metadata = {
  title: 'Official Announcements & Circulars | SFI GECI',
  description: 'Stay updated with KTU exam timetables, campus advisories, transport updates, and student notices.',
};

export default async function AnnouncementsPage() {
  const announcements = await DataService.getAnnouncements(true);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-10">
      <Breadcrumbs items={[{ label: 'Announcements' }]} />

      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Bulletins & Notices</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Campus Announcements
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Direct circulars and university alerts from the SFI GECI unit and college authorities.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-3 text-xs">
                <span
                  className={`font-black uppercase px-2.5 py-0.5 rounded-full ${
                    item.priority === 'urgent'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : item.priority === 'important'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.priority}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(item.publishedAt)}</span>
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                <Link href={`/announcements/${item._id}`}>{item.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.shortDescription}
              </p>
            </div>

            <Link
              href={`/announcements/${item._id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition shrink-0"
            >
              <span>Read Notice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
