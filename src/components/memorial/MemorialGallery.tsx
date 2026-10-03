'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Film, Image as ImageIcon, Play, X, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

export interface GalleryItem {
  mediaType?: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  date?: string;
  source?: string;
  altText?: string;
}

interface MemorialGalleryProps {
  items: GalleryItem[];
}

export default function MemorialGallery({ items }: MemorialGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?rel=0`
      : url;
  };

  const filteredItems = items.filter((item) => {
    const isVideo = item.mediaType === 'video' || Boolean(item.videoUrl);
    if (filter === 'video') return isVideo;
    if (filter === 'image') return !isVideo;
    return true;
  });

  const photoCount = items.filter(
    (item) => item.mediaType !== 'video' && !item.videoUrl
  ).length;
  const videoCount = items.filter(
    (item) => item.mediaType === 'video' || Boolean(item.videoUrl)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">Visual Archives</span>
          <h2 id="memories-heading" className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Memories of Dheeraj
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Authorized photographs, posters, and campus tributes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {items.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('image')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filter === 'image'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
            <span>Photos &amp; Posters</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {photoCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('video')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filter === 'video'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-red-600" />
            <span>Videos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold">
              {videoCount}
            </span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => {
            const isVideo = item.mediaType === 'video' || Boolean(item.videoUrl);
            const isYouTube =
              item.videoUrl &&
              (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be'));

            return (
              <figure
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs flex flex-col justify-between group transition hover:border-stone-300 hover:shadow-xs"
              >
                <div className="relative w-full aspect-16/10 sm:aspect-16/10 bg-stone-950 overflow-hidden">
                  {isVideo ? (
                    isYouTube ? (
                      <iframe
                        src={getYouTubeEmbedUrl(item.videoUrl || '')}
                        title={item.caption || 'Memorial video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster={item.imageUrl || undefined}
                        className="w-full h-full object-contain bg-black"
                      >
                        {item.videoUrl && <source src={item.videoUrl} />}
                        Your browser does not support HTML5 video playback.
                      </video>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="w-full h-full block text-left relative cursor-zoom-in"
                      title="Click to view full photograph"
                    >
                      <Image
                        src={item.imageUrl || '/images/dheeraj-portrait.png'}
                        alt={item.altText || item.caption || 'Comrade Dheeraj photograph'}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                    </button>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10">
                    {isVideo ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Video Archive</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3 text-stone-300" />
                        <span>Photograph</span>
                      </>
                    )}
                  </div>
                </div>

                <figcaption className="p-4 sm:p-5 space-y-2 bg-stone-50/50">
                  <p className="text-sm font-semibold text-stone-900 leading-snug">
                    {item.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200/70">
                    <span className="font-medium text-stone-600 truncate max-w-[65%]">
                      {item.source || 'Authorized SFI Archive'}
                    </span>
                    {item.date && (
                      <span className="shrink-0 text-stone-400 font-mono">
                        {item.date}
                      </span>
                    )}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-stone-50 border border-dashed border-stone-200 rounded-2xl space-y-2">
          <Film className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-sm font-semibold text-stone-700">No media archives found for this filter</p>
          <p className="text-xs text-stone-400">Select "All" to view photographs, posters, and video footage.</p>
        </div>
      )}

      {/* Lightbox Modal for Full View */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-stone-800 text-stone-300">
              <span className="text-xs font-semibold tracking-wide uppercase text-stone-400">
                Visual Archive View
              </span>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
              <Image
                src={lightboxItem.imageUrl || '/images/dheeraj-portrait.png'}
                alt={lightboxItem.altText || lightboxItem.caption || 'Enlarged archive image'}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 bg-stone-950 text-white space-y-1">
              <p className="text-sm font-medium text-stone-200">{lightboxItem.caption}</p>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-800">
                <span>{lightboxItem.source || 'Authorized Source'}</span>
                <span>{lightboxItem.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
