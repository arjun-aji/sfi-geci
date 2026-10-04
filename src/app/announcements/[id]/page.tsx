import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Bell, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const announcement: any = await DataService.getAnnouncementById(id);
  if (!announcement) {
    return {
      title: 'Announcement Not Found | SFI GECI',
    };
  }
  return {
    title: `${announcement.title} | SFI GECI`,
    description: announcement.shortDescription || 'Campus Announcement from SFI GECI.',
  };
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;
  const announcement: any = await DataService.getAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Announcements', href: '/announcements' },
          { label: announcement.title },
        ]}
      />

      <Link
        href="/announcements"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all announcements</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-xs">
          <span
            className={`font-black uppercase px-3 py-1 rounded-full ${
              announcement.priority === 'urgent'
                ? 'bg-red-100 text-red-700'
                : announcement.priority === 'important'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {announcement.priority}
          </span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Published on {formatDate(announcement.publishedAt)}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {announcement.title}
        </h1>

        <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-red-500 text-sm font-semibold text-slate-700">
          {announcement.shortDescription}
        </div>

        {announcement.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line pt-2">
          {announcement.content}
        </div>
      </div>
    </div>
  );
}
