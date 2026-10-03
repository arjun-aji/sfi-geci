'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';

interface CatItem {
  _id: string;
  name: string;
  type: 'notes' | 'question-paper';
  slug: string;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'notes' as 'notes' | 'question-paper' });

  const fetchCats = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setIsModalOpen(false);
    fetchCats();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete category?')) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    if (res.ok) setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Classification</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-red-600" />
            <span>Material Categories</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Categories for Notes (Class Notes, Unit Notes, etc.) and Question Papers (University Exam, Model Exam, etc.).
          </p>
        </div>
        <button
          onClick={() => { setFormData({ name: '', type: 'notes' }); setIsModalOpen(true); }}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Category Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Slug</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.type === 'notes' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {c.type === 'notes' ? 'Notes' : 'Question Paper'}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500 text-xs">{c.slug}</td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
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
              <h2 className="text-lg font-black text-slate-900">+ Add Category</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Notes or Model Exam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="notes">Notes</option>
                  <option value="question-paper">Question Paper</option>
                </select>
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
