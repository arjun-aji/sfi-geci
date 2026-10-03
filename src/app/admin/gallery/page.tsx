'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';
import MultiImageUploadPicker from '@/components/admin/MultiImageUploadPicker';

interface AlbumItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  coverImageUrl: string;
  images: Array<{ url: string; caption?: string }>;
  isPublished: boolean;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '2026-08-22',
    coverImageUrl: '',
    images: [] as Array<{ url: string; caption?: string }>,
    isPublished: true,
  });

  const fetchAlbums = async () => {
    const res = await fetch('/api/gallery?all=true');
    const data = await res.json();
    if (data.albums) setAlbums(data.albums);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      coverImageUrl: '',
      images: [],
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AlbumItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString().split('T')[0],
      coverImageUrl: item.coverImageUrl,
      images: item.images && item.images.length > 0 ? item.images : item.coverImageUrl ? [{ url: item.coverImageUrl, caption: item.title }] : [],
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete album?')) return;
    const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    if (res.ok) setAlbums((prev) => prev.filter((a) => a._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCover = formData.coverImageUrl || (formData.images[0]?.url || '');
    if (!finalCover) {
      alert('Please provide a cover image or upload at least one album photo.');
      return;
    }

    const finalImages = formData.images.length > 0 ? formData.images : [{ url: finalCover, caption: formData.title }];

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      coverImageUrl: finalCover,
      images: finalImages,
      isPublished: formData.isPublished,
      ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
    };

    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setIsModalOpen(false);
    fetchAlbums();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Visual Vault</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-red-600" />
            <span>Photo Albums & Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize campus celebrations, arts fests, and volunteer drives.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Album</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Album</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Photos Count</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {albums.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-12 h-8 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{a.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{a.description}</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-600">{formatDate(a.date)}</td>
                <td className="py-4 px-4 font-bold text-slate-700">{a.images?.length || 1} images</td>
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
              <h2 className="text-lg font-black text-slate-900">{modalMode === 'create' ? '+ Add Album' : 'Edit Album'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <ImageUploadPicker
                label="Cover Image"
                folder="sfi-geci/gallery"
                value={formData.coverImageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
                required
                helperText="Select or upload the main highlight image for this album."
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

              <MultiImageUploadPicker
                label="Album Photos"
                folder="sfi-geci/gallery"
                images={formData.images}
                onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
                coverImageUrl={formData.coverImageUrl}
                onSetCover={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
                helperText="Upload multiple pictures directly or paste external URLs. Click star to make any photo the cover."
              />
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
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-red-600 text-white rounded-xl">Save Album</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
