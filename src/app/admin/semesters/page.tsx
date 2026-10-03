'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';

interface SemItem {
  _id: string;
  code: string;
  name: string;
  order: number;
  isActive: boolean;
}

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState<SemItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    order: 1,
    isActive: true,
  });

  const fetchSemesters = async () => {
    const res = await fetch('/api/semesters?all=true');
    const data = await res.json();
    if (data.semesters) setSemesters(data.semesters);
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({ code: '', name: '', order: semesters.length + 1, isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: SemItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormData({ code: item.code, name: item.name, order: item.order, isActive: item.isActive });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this semester?')) return;
    const res = await fetch(`/api/semesters?id=${id}`, { method: 'DELETE' });
    if (res.ok) setSemesters((prev) => prev.filter((s) => s._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
    };
    await fetch('/api/semesters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setIsModalOpen(false);
    fetchSemesters();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Curriculum Levels</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-red-600" />
            <span>Semesters (S1–S8)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage semester codes and display names for academic grid navigation.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Semester</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Code & Label</th>
              <th className="py-4 px-4">Order</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {semesters.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono font-bold text-red-600 mr-2">{s.code}</span>
                  <span className="font-bold text-slate-800">{s.name}</span>
                </td>
                <td className="py-4 px-4 font-bold text-slate-700">{s.order}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {s.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
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
              <h2 className="text-lg font-black text-slate-900">{modalMode === 'create' ? '+ Add Semester' : 'Edit Semester'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Code (e.g. S1)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name (e.g. Semester 1)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order (1-8)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
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
