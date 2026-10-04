import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Calendar, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const album: any = await DataService.getGalleryAlbumById(id);
  if (!album) {
    return {
      title: 'Album Not Found | SFI GECI',
    };
  }
  return {
    title: `${album.title} | Campus Gallery | SFI GECI`,
    description: album.description || 'Campus photo gallery from SFI GECI.',
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const album: any = await DataService.getGalleryAlbumById(id);

  if (!album) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Gallery', href: '/gallery' },
          { label: album.title },
        ]}
      />

      <Link
        href="/gallery"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all albums</span>
      </Link>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs text-red-600 font-bold">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(album.date)}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {album.title}
        </h1>
        {album.description && (
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            {album.description}
          </p>
        )}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
        {album.images && album.images.length > 0 ? (
          album.images.map((img: any, i: number) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 aspect-[4/3]"
            >
              <img
                src={img.url}
                alt={img.caption || `${album.title} Photo ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-xs font-medium">
                  {img.caption}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            No photos uploaded in this album yet.
          </div>
        )}
      </div>
    </div>
  );
}
