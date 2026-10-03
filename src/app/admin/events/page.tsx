'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  category: string;
  registrationUrl?: string;
  isPublished: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    eventDate: '2026-11-15',
    eventTime: '10:00 AM',
    venue: '',
    category: 'Cultural',
    registrationUrl: '',
    isPublished: true,
  });

  const fetchEvents = async () => {
    const res = await fetch('/api/events?all=true');
    const data = await res.json();
    if (data.events) setEvents(data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      posterUrl: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '10:00 AM',
      venue: 'College Main Auditorium',
      category: 'Cultural',
      registrationUrl: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: EventItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      posterUrl: item.posterUrl,
      eventDate: new Date(item.eventDate).toISOString().split('T')[0],
      eventTime: item.eventTime || '10:00 AM',
      venue: item.venue,
      category: item.category || 'Cultural',
      registrationUrl: item.registrationUrl || '',
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete event?')) return;
    const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    if (res.ok) setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
    };
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setIsModalOpen(false);
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Campus Life CMS</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-red-600" />
            <span>Campus Events & Fests</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage Arts Fests, Technical Symposia, and Union Inaugurations.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Event</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Event Title</th>
              <th className="py-4 px-4">Date & Time</th>
              <th className="py-4 px-4">Venue</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((e) => (
              <tr key={e._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {e.posterUrl ? (
                      <img src={e.posterUrl} alt={e.title} className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{e.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">slug: {e.slug}</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-700">{formatDate(e.eventDate)} • {e.eventTime}</td>
                <td className="py-4 px-4 text-slate-600 truncate max-w-[150px]">{e.venue}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {e.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${e.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {e.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => handleOpenEditModal(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(e._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600">
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
              <h2 className="text-lg font-black text-slate-900">{modalMode === 'create' ? '+ Add Event' : 'Edit Event'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <ImageUploadPicker
                label="Poster Image"
                folder="sfi-geci/events"
                value={formData.posterUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, posterUrl: url }))}
                placeholder="https://... or upload poster image"
                helperText="Upload event promotional poster/flyer or paste image link."
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-slate-700">Publish Immediately</label>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-red-600 text-white rounded-xl">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
