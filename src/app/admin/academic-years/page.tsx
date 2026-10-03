'use client';

import React, { useState, useEffect } from 'react';
import { CalendarRange, Plus, Edit2, Trash2, X } from 'lucide-react';

interface AYItem {
  _id: string;
  year: string;
  isCurrent: boolean;
  isActive: boolean;
}

export default function AdminAcademicYearsPage() {
  const [years, setYears] = useState<AYItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ year: '', isCurrent: false, isActive: true });

  const fetchYears = async () => {
    const res = await fetch('/api/academic-years');
    const data = await res.json();
    if (data.academicYears) setYears(data.academicYears);
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/academic-years', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setIsModalOpen(false);
    fetchYears();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete academic year?')) return;
    const res = await fetch(`/api/academic-years?id=${id}`, { method: 'DELETE' });
    if (res.ok) setYears((prev) => prev.filter((y) => y._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Academic Structure</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarRange className="w-7 h-7 text-red-600" />
            <span>Academic Years</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage academic batches for unit committee and notes archival.
          </p>
        </div>
        <button
          onClick={() => { setFormData({ year: '', isCurrent: false, isActive: true }); setIsModalOpen(true); }}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Academic Year</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Academic Year</th>
              <th className="py-4 px-4">Current Session</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {years.map((y) => (
              <tr key={y._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 font-mono text-base">{y.year}</td>
                <td className="py-4 px-4">
                  {y.isCurrent && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                      Current
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${y.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {y.isActive ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleDelete(y._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">+ Add Academic Year</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year (e.g. 2026-27)</label>
                <input
                  type="text"
                  required
                  placeholder="2026-27"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-slate-700">Set as Current Session</label>
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-red-600 text-white rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
