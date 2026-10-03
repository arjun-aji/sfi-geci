'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  folder?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUploadPicker({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://... or /images/...',
  folder = 'sfi-geci/general',
  helperText,
  required = false,
  className = '',
}: ImageUploadPickerProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Size limit: 25MB
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds 25MB limit');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setImageError(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('resourceType', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Source Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
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
            <span>Browse File</span>
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
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Upload error alert */}
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

      {/* Input Mode 1: File Browser / Drag & Drop */}
      {tab === 'upload' && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
            dragActive
              ? 'border-red-500 bg-red-50/50'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
              <div className="text-xs font-semibold text-slate-700">Uploading image to storage...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 py-1">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 mb-1">
                <Upload className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Click to browse <span className="text-slate-400 font-normal">or drag & drop</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Supports PNG, JPG, WEBP, GIF up to 25MB
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Mode 2: Direct URL Input */}
      {tab === 'url' && (
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setImageError(false);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-xs pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Visual Live Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-slate-400 p-1 text-center">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">Error</span>
              </div>
            ) : (
              <img
                src={value}
                alt="Selected"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800 truncate">Image Attached</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{value}</p>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="View full image"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setImageError(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
}
