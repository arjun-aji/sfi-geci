import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Image as ImageIcon, Calendar, ArrowRight, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export const metadata = {
  title: 'Campus Life & Photo Gallery | SFI GECI',
  description: 'Glimpses of student festivals, solidarity rallies, tech meets, and campus life at GEC Idukki.',
};

export default async function GalleryPage() {
  const albums = await DataService.getGalleryAlbums(true);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-10">
      <Breadcrumbs items={[{ label: 'Photo Gallery' }]} />

      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Moments & Memories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Campus Gallery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Visual archives of union festivals, sports milestones, social initiatives, and brotherhood at GEC Idukki.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <Link
            key={album._id}
            href={`/gallery/${album._id}`}
            className="group bg-white rounded-3xl border border-slate-200/90 hover:border-red-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={album.coverImageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white">
                    {album.images?.length || 1} Photos
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-red-600 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(album.date)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {album.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-red-600 border-t border-slate-50 transition-colors">
              <span>View Album</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
