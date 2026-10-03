'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

interface AnnItem {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  priority: 'normal' | 'important' | 'urgent';
  publishedAt: string;
  isPublished: boolean;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    imageUrl: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
    isPublished: true,
  });

  const fetchAnn = async () => {
    const res = await fetch('/api/announcements?all=true');
    const data = await res.json();
    if (data.announcements) setAnnouncements(data.announcements);
  };

  useEffect(() => {
    fetchAnn();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({
      title: '',
      shortDescription: '',
      content: '',
      imageUrl: '',
      priority: 'normal',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AnnItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormData({
      title: item.title,
      shortDescription: item.shortDescription,
      content: item.content,
      imageUrl: item.imageUrl || '',
      priority: item.priority,
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete announcement?')) return;
    const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
    if (res.ok) setAnnouncements((prev) => prev.filter((a) => a._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
    };
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setIsModalOpen(false);
    fetchAnn();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Campus Bulletins</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-red-600" />
            <span>Announcements & Circulars</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish KTU timetables, bus schedule revisions, and official notices.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Announcement</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Title & Summary</th>
              <th className="py-4 px-4">Priority</th>
              <th className="py-4 px-4">Published Date</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {announcements.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                    ) : (
                      <Bell className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{a.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{a.shortDescription}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.priority === 'urgent' ? 'bg-red-100 text-red-800' : a.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                    {a.priority}
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-600">{formatDate(a.publishedAt)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {a.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">{modalMode === 'create' ? '+ Add Announcement' : 'Edit Announcement'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary (1-2 sentences)</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Content</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <ImageUploadPicker
                label="Circular / Notice Image or Poster (Optional)"
                folder="sfi-geci/announcements"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                placeholder="https://... or upload circular image"
                helperText="Attach timetable image, bus schedule banner, or official circular."
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-6">
                  <label className="text-xs font-bold text-slate-700">Publish</label>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
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
