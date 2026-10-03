import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import {
  BookOpen,
  FileQuestion,
  Download,
  Calendar,
  Users,
  MessageSquareWarning,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const revalidate = 0; // Dynamic admin metrics

export default async function AdminDashboardPage() {
  const stats = await DataService.getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time telemetry of academic materials, grievances, downloads, and campus events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/notes"
            className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Note</span>
          </Link>
          <Link
            href="/admin/question-papers"
            className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question Paper</span>
          </Link>
        </div>
      </div>

      {/* Primary 8 Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Notes</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{stats.totalNotes}</div>
            <div className="text-[11px] text-slate-400 mt-1">Study materials online</div>
          </div>
        </div>

        {/* Total Question Papers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Papers</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{stats.totalQuestionPapers}</div>
            <div className="text-[11px] text-slate-400 mt-1">KTU University papers</div>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Downloads</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600">{stats.totalDownloads}</div>
            <div className="text-[11px] text-slate-400 mt-1">Student file accesses</div>
          </div>
        </div>

        {/* Total Grievances */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{stats.totalComplaints}</div>
            <div className="text-[11px] font-bold text-rose-600 mt-1">
              {stats.pendingComplaints} Pending Review
            </div>
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Events</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{stats.totalEvents}</div>
            <div className="text-[11px] text-slate-400 mt-1">{stats.upcomingEvents} Upcoming</div>
          </div>
        </div>

        {/* Total Unit Members */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Committee Members</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{stats.totalMembers}</div>
            <div className="text-[11px] text-slate-400 mt-1">Active leaders & alumni</div>
          </div>
        </div>

        {/* Academic Departments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departments</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              🏛️
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">6</div>
            <div className="text-[11px] text-slate-400 mt-1">CSE, IT, EEE, ECE, ME, RAI</div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600">Operational</div>
            <div className="text-[11px] text-slate-400 mt-1">MongoDB & Cloudinary Ready</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics / Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Materials by Department Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Materials Distribution by Department</h3>
            <span className="text-xs font-semibold text-slate-400">Total Materials</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(stats.materialsByDept).map(([dept, count]) => {
              const percentage = Math.round((count / (stats.totalMaterials || 1)) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{dept}</span>
                    <span className="text-slate-500">{count} materials ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes by Semester Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Notes by Semester (S1–S8)</h3>
            <span className="text-xs font-semibold text-slate-400">Semester Coverage</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
            {Object.entries(stats.notesBySem).map(([sem, count]) => (
              <div key={sem} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-black text-slate-900">{sem}</span>
                <span className="text-lg font-black text-red-600 my-1">{count}</span>
                <span className="text-[10px] text-slate-400">notes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints by Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Grievance Status Breakdown</h3>
            <Link href="/admin/complaints" className="text-xs font-bold text-red-600 hover:underline">
              Manage Desk →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'].map((st) => {
              const count = stats.complaintsByStatus[st] || 0;
              return (
                <div key={st} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">{st}</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaints by Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Complaints by Category</h3>
            <span className="text-xs font-semibold text-slate-400">Issues Raised</span>
          </div>

          <div className="space-y-2 pt-2 max-h-56 overflow-y-auto pr-1">
            {Object.entries(stats.complaintsByCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">{cat}</span>
                <span className="font-black text-slate-900 px-2 py-0.5 rounded-full bg-white border border-slate-200">
                  {count}
                </span>
              </div>
            ))}
            {Object.keys(stats.complaintsByCategory).length === 0 && (
              <div className="text-xs text-slate-400 py-6 text-center">No complaints recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
