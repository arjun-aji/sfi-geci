'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface DeptItem {
  _id: string;
  code: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DeptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    order: 1,
    isActive: true,
  });

  const [formError, setFormError] = useState('');

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/departments?all=true');
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormError('');
    setFormData({ code: '', name: '', description: '', order: departments.length + 1, isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DeptItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormError('');
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description || '',
      order: item.order || 1,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    const res = await fetch(`/api/departments?id=${id}`, { method: 'DELETE' });
    if (res.ok) setDepartments((prev) => prev.filter((d) => d._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
      };

      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save department');

      setIsModalOpen(false);
      fetchDepts();
    } catch (err: any) {
      setFormError(err.message || 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Academic Structure</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-red-600" />
            <span>Engineering Departments</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Default 6 departments: CSE, IT, EEE, ECE, ME, RAI. Add or modify as required.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Department</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Code & Full Name</th>
              <th className="py-4 px-4">Description</th>
              <th className="py-4 px-4">Order</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((d) => (
              <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-mono font-bold text-red-600 mr-2">{d.code}</span>
                  <span className="font-bold text-slate-900">{d.name}</span>
                </td>
                <td className="py-4 px-4 text-slate-500 line-clamp-1 max-w-[300px]">{d.description || '—'}</td>
                <td className="py-4 px-4 font-bold text-slate-700">{d.order}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {d.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(d._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">{modalMode === 'create' ? '+ Add Department' : 'Edit Department'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {formError && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Code (e.g. CSE)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <label className="text-xs font-bold text-slate-700">Active</label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                </div>
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
