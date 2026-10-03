'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileQuestion,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Layers,
  HardDrive,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';

interface MaterialCardProps {
  material: {
    _id: string;
    title: string;
    description?: string;
    type: 'notes' | 'question-paper';
    department: string;
    semester: string;
    subject: string;
    academicYear?: string;
    category?: string;
    unitNumber?: number;
    examYear?: number;
    fileSource: 'cloudinary' | 'external';
    fileUrl: string;
    cloudinaryUrl?: string;
    externalUrl?: string;
    fileName?: string;
    fileSize?: number;
    downloadCount: number;
    createdAt?: string | Date;
  };
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const [downloadCount, setDownloadCount] = useState(material.downloadCount || 0);
  const [isOpening, setIsOpening] = useState(false);

  const isQP = material.type === 'question-paper';
  const isCloudinary = material.fileSource === 'cloudinary';

  const handleAccess = async (action: 'view' | 'download') => {
    try {
      setIsOpening(true);
      // Increment download counter via API
      fetch(`/api/materials/${material._id}/download`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.downloadCount) setDownloadCount(data.downloadCount);
        })
        .catch(() => {});

      const targetUrl = material.fileUrl || material.cloudinaryUrl || material.externalUrl || '#';

      if (action === 'download' && isCloudinary) {
        // Direct browser download
        const a = document.createElement('a');
        a.href = targetUrl;
        a.download = material.fileName || `${material.title}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Open in new tab (View or External link)
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setTimeout(() => setIsOpening(false), 500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header row with Type & Source badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg ${
                isQP
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {isQP ? <FileQuestion className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  isQP ? 'bg-amber-100/70 text-amber-800' : 'bg-red-100/70 text-red-800'
                }`}
              >
                {isQP ? 'Question Paper' : `Unit ${material.unitNumber || 'Notes'}`}
              </span>

              {material.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {material.category}
                </span>
              )}
            </div>
          </div>

          {/* File source badge */}
          <div
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isCloudinary
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
            title={isCloudinary ? 'Cloudinary High-Speed Storage' : 'External Hosted (e.g. Google Drive)'}
          >
            {isCloudinary ? <Cloud className="w-3 h-3 text-blue-500" /> : <HardDrive className="w-3 h-3 text-emerald-500" />}
            <span>{isCloudinary ? 'Cloudinary' : 'Drive Link'}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
          {material.title}
        </h4>

        {/* Academic Meta Tags */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-2 font-medium">
          <span className="font-bold text-slate-700">{material.department}</span>
          <span>•</span>
          <span className="font-bold text-slate-700">{material.semester}</span>
          <span>•</span>
          <span className="truncate max-w-[180px]">{material.subject}</span>
          {material.examYear && (
            <>
              <span>•</span>
              <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                Year: {material.examYear}
              </span>
            </>
          )}
        </div>

        {/* Description if present */}
        {material.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {material.description}
          </p>
        )}
      </div>

      {/* Footer & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            {material.fileSize ? (
              <span>{formatFileSize(material.fileSize)}</span>
            ) : (
              <span>PDF Document</span>
            )}
            <span>•</span>
            <span>{downloadCount} {downloadCount === 1 ? 'access' : 'accesses'}</span>
          </div>
          {material.createdAt && (
            <span>{formatDate(material.createdAt)}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* View Button */}
          <button
            onClick={() => handleAccess('view')}
            disabled={isOpening}
            className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{isCloudinary ? 'View PDF' : 'Open Link'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={() => handleAccess('download')}
            disabled={isOpening}
            className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20 transition active:scale-95"
          >
            {isCloudinary ? (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Drive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
