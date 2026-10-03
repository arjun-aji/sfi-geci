'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Lock,
} from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/utils';

interface TrackingData {
  complaintNumber: string;
  subject: string;
  category: string;
  department: string;
  semester: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    status: string;
    comment?: string;
    changedAt: string;
  }>;
}

function ComplaintTrackerInner() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('number') || '';

  const [refNumber, setRefNumber] = useState(initialNumber);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const performSearch = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setData(null);

    try {
      const res = await fetch(`/api/complaints/track?number=${encodeURIComponent(num.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch status');
      }

      setData(json.tracking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error tracking reference number');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      performSearch(initialNumber);
    }
  }, [initialNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(refNumber);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Grievance Cell', href: '/complaints' },
          { label: 'Track Complaint' },
        ]}
      />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Real-Time Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Track Your Grievance
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Enter your reference ID (e.g. <span className="font-mono font-bold text-red-600">SFI-2026-00101</span>) to view current review status and resolution updates.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reference Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. SFI-2026-00101"
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 text-sm sm:text-base font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-wider"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition active:scale-95 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Status Result Card */}
      {data && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Reference ID
              </span>
              <h2 className="text-2xl font-black font-mono text-red-600">
                {data.complaintNumber}
              </h2>
            </div>

            <div className="self-start sm:self-auto">
              <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${getStatusBadge(data.status)}`}>
                {data.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Subject</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{data.subject}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-800">{data.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-bold text-slate-800">{data.department} • {data.semester}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-medium">Submitted</span>
                <span className="font-bold text-slate-800">{formatDate(data.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-500" />
              <span>Resolution Progress Timeline</span>
            </h3>

            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {data.timeline.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-4 ring-red-100" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{step.status}</span>
                    <span className="text-slate-400 font-medium">{formatDate(step.changedAt)}</span>
                  </div>
                  {step.comment && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {step.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Last checked: {formatDate(data.updatedAt)}</span>
            <Link href="/complaints" className="text-red-600 font-bold hover:underline">
              Submit another grievance →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComplaintTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-slate-500 text-sm">
          Loading grievance tracking system...
        </div>
      }
    >
      <ComplaintTrackerInner />
    </Suspense>
  );
}
