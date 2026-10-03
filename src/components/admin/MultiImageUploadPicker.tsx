'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Plus,
  Star,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

interface MultiImageUploadPickerProps {
  images: Array<{ url: string; caption?: string }>;
  onChange: (images: Array<{ url: string; caption?: string }>) => void;
  coverImageUrl?: string;
  onSetCover?: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export default function MultiImageUploadPicker({
  images,
  onChange,
  coverImageUrl,
  onSetCover,
  folder = 'sfi-geci/gallery',
  label = 'Album Photos',
  helperText = 'Upload multiple photos or paste URLs. Click the star icon to set as album cover.',
}: MultiImageUploadPickerProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMultipleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setUploadError('Please select valid image files (PNG, JPG, WEBP, etc.)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const newImages: Array<{ url: string; caption?: string }> = [...images];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('resourceType', 'image');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newImages.push({ url: data.url });
          // If no cover is set, set first uploaded as cover
          if (newImages.length === 1 && onSetCover) {
            onSetCover(data.url);
          }
        } else {
          console.warn(`Failed to upload ${file.name}:`, data.error);
        }
      }
      onChange(newImages);
    } catch (err: any) {
      setUploadError(err.message || 'Error occurred while uploading some photos.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrls = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const parsedUrls = urlInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')));

    if (parsedUrls.length === 0) {
      setUploadError('Please enter valid URL(s) starting with http://, https://, or /');
      return;
    }

    const newItems = parsedUrls.map((url) => ({ url }));
    const updated = [...images, ...newItems];
    onChange(updated);
    setUrlInput('');
    setUploadError(null);

    if (!coverImageUrl && onSetCover && parsedUrls[0]) {
      onSetCover(parsedUrls[0]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} ({images.length})
        </label>
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
              tab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Browse Files</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
              tab === 'url'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Add URLs</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-red-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {tab === 'upload' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files) {
              handleMultipleFilesUpload(e.dataTransfer.files);
            }
          }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
            dragActive
              ? 'border-red-500 bg-red-50/50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleMultipleFilesUpload(e.target.files);
              }
            }}
          />

          {isUploading ? (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
              <div className="text-xs font-semibold text-slate-700">{uploadProgress || 'Uploading images...'}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 py-1">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 mb-1">
                <Upload className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Click to browse multiple photos <span className="text-slate-400 font-normal">or drag & drop</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Select one or more images at once (PNG, JPG, WEBP, GIF)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={3}
            placeholder="Paste image URLs here (one per line or comma-separated)..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddUrls}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL(s) to Album</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Current Images */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Album Photos ({images.length})</span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-red-500 hover:text-red-700 text-[10px] font-semibold"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-1">
            {images.map((img, idx) => {
              const isCover = coverImageUrl === img.url;
              return (
                <div
                  key={`${img.url}-${idx}`}
                  className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-square shadow-2xs"
                >
                  <img src={img.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Cover indicator tag */}
                  {isCover && (
                    <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" /> Cover
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    {onSetCover && !isCover && (
                      <button
                        type="button"
                        onClick={() => onSetCover(img.url)}
                        title="Set as cover image"
                        className="p-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full image"
                      className="p-1 rounded-md bg-slate-700 hover:bg-slate-800 text-white shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove photo"
                      className="p-1 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
}
