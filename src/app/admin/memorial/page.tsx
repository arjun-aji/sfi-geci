'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  BookOpen,
  Film,
  Upload,
  Loader2,
} from 'lucide-react';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

export default function AdminMemorialPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<string | null>(null);

  const [memorial, setMemorial] = useState<any>({
    title: 'Comrade Dheeraj Rajendran',
    subtitle: 'A Student. A Comrade. Remembered by GECI.',
    heroImage: '/images/hero-bg.jpg',
    introduction: '',
    keyFacts: {
      age: '21',
      college: 'Government Engineering College, Idukki',
      course: 'B.Tech',
      department: 'Computer Science and Engineering',
      semester: 'Seventh semester',
      from: 'Palakkulangara, near Taliparamba, Kannur',
      dateOfDeath: '10 January 2022',
    },
    studentLife: '',
    incident: '',
    caseInformation: '',
    finalDays: '',
    remembrance: '',
    timeline: [],
    gallery: [],
    sources: [],
    seoTitle: '',
    seoDescription: '',
    isPublished: true,
  });

  useEffect(() => {
    fetch('/api/memorial')
      .then((r) => r.json())
      .then((data) => {
        if (data.memorial) {
          setMemorial(data.memorial);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/memorial', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memorial),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save memorial page details');
      }
    } catch {
      alert('Error saving memorial page');
    } finally {
      setSaving(false);
    }
  };

  // Timeline handlers
  const addTimelineItem = () => {
    setMemorial({
      ...memorial,
      timeline: [
        ...(memorial.timeline || []),
        { date: '', title: '', description: '' },
      ],
    });
  };

  const removeTimelineItem = (index: number) => {
    const updated = [...(memorial.timeline || [])];
    updated.splice(index, 1);
    setMemorial({ ...memorial, timeline: updated });
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    const updated = [...(memorial.timeline || [])];
    updated[index] = { ...updated[index], [field]: value };
    setMemorial({ ...memorial, timeline: updated });
  };

  // Gallery handlers
  const addGalleryItem = (type: 'image' | 'video' = 'image') => {
    setMemorial({
      ...memorial,
      gallery: [
        ...(memorial.gallery || []),
        {
          mediaType: type,
          imageUrl: type === 'image' ? '' : '/images/dheeraj-portrait.png',
          videoUrl: '',
          caption: '',
          date: '',
          source: '',
          altText: '',
        },
      ],
    });
  };

  const removeGalleryItem = (index: number) => {
    const updated = [...(memorial.gallery || [])];
    updated.splice(index, 1);
    setMemorial({ ...memorial, gallery: updated });
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    const updated = [...(memorial.gallery || [])];
    updated[index] = { ...updated[index], [field]: value };
    setMemorial({ ...memorial, gallery: updated });
  };

  const handleGalleryUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'imageUrl' | 'videoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKey = `${index}-${targetField}`;
    setUploadingGalleryIdx(uploadKey);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'sfi-geci/memorial');
    formData.append('resourceType', targetField === 'videoUrl' ? 'video' : 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        updateGalleryItem(index, targetField, data.url);
        if (targetField === 'videoUrl') {
          updateGalleryItem(index, 'mediaType', 'video');
        }
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingGalleryIdx(null);
    }
  };

  // Source handlers
  const addSourceItem = () => {
    setMemorial({
      ...memorial,
      sources: [
        ...(memorial.sources || []),
        { title: '', publisher: '', date: '', url: '', description: '' },
      ],
    });
  };

  const removeSourceItem = (index: number) => {
    const updated = [...(memorial.sources || [])];
    updated.splice(index, 1);
    setMemorial({ ...memorial, sources: updated });
  };

  const updateSourceItem = (index: number, field: string, value: string) => {
    const updated = [...(memorial.sources || [])];
    updated[index] = { ...updated[index], [field]: value };
    setMemorial({ ...memorial, sources: updated });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading Comrade Dheeraj Memorial CMS...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Comrade Dheeraj Memorial CMS
            </h1>
            <p className="text-xs text-slate-500">
              Manage the memorial biography, key facts, documented timeline, photos, and references
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/comrade-dheeraj"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition text-sm disabled:opacity-60"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. HERO & GENERAL INFO */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>Hero &amp; Header Section</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Page Heading</label>
              <input
                type="text"
                value={memorial.title || ''}
                onChange={(e) => setMemorial({ ...memorial, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={memorial.subtitle || ''}
                onChange={(e) => setMemorial({ ...memorial, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <ImageUploadPicker
            label="Hero Image Path or URL"
            folder="sfi-geci/memorial"
            value={memorial.heroImage || ''}
            onChange={(url) => setMemorial((prev: any) => ({ ...prev, heroImage: url }))}
            placeholder="/images/hero-bg.jpg or https://..."
            required
            helperText="Authorized portrait photograph. Do not use altered or synthetic portraits."
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supporting Introduction Text</label>
            <textarea
              rows={3}
              value={memorial.introduction || ''}
              onChange={(e) => setMemorial({ ...memorial, introduction: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        {/* 2. KEY FACTS */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>Key Facts (Contemporaneous Records)</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
              <input
                type="text"
                value={memorial.keyFacts?.age || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, age: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Standing / Semester</label>
              <input
                type="text"
                value={memorial.keyFacts?.semester || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, semester: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Death</label>
              <input
                type="text"
                value={memorial.keyFacts?.dateOfDeath || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, dateOfDeath: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">College &amp; Campus</label>
              <input
                type="text"
                value={memorial.keyFacts?.college || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, college: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Program &amp; Department</label>
              <input
                type="text"
                value={memorial.keyFacts?.department || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, department: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Native Place / Residence</label>
              <input
                type="text"
                value={memorial.keyFacts?.from || ''}
                onChange={(e) =>
                  setMemorial({
                    ...memorial,
                    keyFacts: { ...memorial.keyFacts, from: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* 3. DOCUMENTARY SECTIONS */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Documentary Text Sections
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">A Student of GECI (Student Life)</label>
            <textarea
              rows={3}
              value={memorial.studentLife || ''}
              onChange={(e) => setMemorial({ ...memorial, studentLife: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">10 January 2022 (The Incident)</label>
            <textarea
              rows={3}
              value={memorial.incident || ''}
              onChange={(e) => setMemorial({ ...memorial, incident: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">The Case (Police &amp; Legal Proceedings)</label>
            <textarea
              rows={3}
              value={memorial.caseInformation || ''}
              onChange={(e) => setMemorial({ ...memorial, caseInformation: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hospitalization &amp; Final Hours</label>
            <textarea
              rows={3}
              value={memorial.finalDays || ''}
              onChange={(e) => setMemorial({ ...memorial, finalDays: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Remembering Dheeraj (Remembrance Section)</label>
            <textarea
              rows={3}
              value={memorial.remembrance || ''}
              onChange={(e) => setMemorial({ ...memorial, remembrance: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* 4. TIMELINE */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Timeline of Events</h2>
            <button
              type="button"
              onClick={addTimelineItem}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-4">
            {memorial.timeline && memorial.timeline.length > 0 ? (
              memorial.timeline.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeTimelineItem(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid sm:grid-cols-3 gap-3 pr-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Date / Marker</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateTimelineItem(idx, 'date', e.target.value)}
                        placeholder="e.g. 10 January 2022"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelineItem(idx, 'title', e.target.value)}
                        placeholder="e.g. Fatal Confrontation"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateTimelineItem(idx, 'description', e.target.value)}
                      placeholder="Factual description based on reporting"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No timeline events defined.</p>
            )}
          </div>
        </div>

        {/* 5. MEMORY PHOTOS & VIDEOS */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Visual Archives: Memories of Dheeraj</h2>
              <p className="text-xs text-slate-500">Authorized photographs, video files (MP4/WebM), posters, and tributes</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => addGalleryItem('image')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
              <button
                type="button"
                onClick={() => addGalleryItem('video')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Add Video</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {memorial.gallery && memorial.gallery.length > 0 ? (
              memorial.gallery.map((item: any, idx: number) => {
                const isVideo = item.mediaType === 'video' || Boolean(item.videoUrl);

                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 mb-2">
                      <label className="text-xs font-bold text-slate-700">Media Type:</label>
                      <select
                        value={item.mediaType || (isVideo ? 'video' : 'image')}
                        onChange={(e) => updateGalleryItem(idx, 'mediaType', e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-white"
                      >
                        <option value="image">Photo / Poster</option>
                        <option value="video">Video (MP4 / WebM / YouTube)</option>
                      </select>
                    </div>

                    {item.mediaType === 'video' ? (
                      <div className="space-y-3 pr-8">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Video URL (MP4 file or YouTube link)
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item.videoUrl || ''}
                                onChange={(e) => updateGalleryItem(idx, 'videoUrl', e.target.value)}
                                placeholder="e.g. /videos/dheeraj.mp4 or https://youtube.com/..."
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                              />
                              <label
                                className={`cursor-pointer px-2.5 py-2 rounded-lg border text-xs font-bold flex items-center gap-1 shrink-0 transition ${
                                  uploadingGalleryIdx === `${idx}-videoUrl`
                                    ? 'bg-purple-100 text-purple-400 border-purple-300 pointer-events-none'
                                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                                }`}
                                title="Upload Video File (MP4, WebM)"
                              >
                                {uploadingGalleryIdx === `${idx}-videoUrl` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline">Upload</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  disabled={Boolean(uploadingGalleryIdx)}
                                  onChange={(e) => handleGalleryUpload(idx, e, 'videoUrl')}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {uploadingGalleryIdx === `${idx}-videoUrl` && (
                              <p className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading video file...
                              </p>
                            )}
                          </div>

                          <ImageUploadPicker
                            label="Poster / Thumbnail Image"
                            folder="sfi-geci/memorial"
                            value={item.imageUrl || ''}
                            onChange={(url) => updateGalleryItem(idx, 'imageUrl', url)}
                            placeholder="/images/dheeraj-portrait.png"
                            helperText="Optional video poster thumbnail displayed before video plays."
                          />
                        </div>

                        {/* Video Live Preview */}
                        {item.videoUrl && (
                          <div className="p-3 bg-stone-900 rounded-xl max-w-md">
                            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Film className="w-3 h-3 text-red-500" />
                              Video Preview
                            </span>
                            {item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be') ? (
                              <div className="text-xs text-stone-300 font-mono bg-stone-800/80 p-2 rounded truncate">
                                YouTube link: {item.videoUrl}
                              </div>
                            ) : (
                              <video
                                controls
                                preload="metadata"
                                poster={item.imageUrl || undefined}
                                className="w-full max-h-40 rounded-lg bg-black object-contain"
                              >
                                <source src={item.videoUrl} />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 pr-8">
                        <ImageUploadPicker
                          label="Photo Image"
                          folder="sfi-geci/memorial"
                          value={item.imageUrl || ''}
                          onChange={(url) => updateGalleryItem(idx, 'imageUrl', url)}
                          placeholder="/images/dheeraj-portrait.png"
                          helperText="Upload photograph or specify local path / URL."
                        />
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Source / Attribution</label>
                          <input
                            type="text"
                            value={item.source || ''}
                            onChange={(e) => updateGalleryItem(idx, 'source', e.target.value)}
                            placeholder="e.g. SFI GECI Archive"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Caption</label>
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                          placeholder="Brief respectful caption"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                        <input
                          type="text"
                          value={item.date || ''}
                          onChange={(e) => updateGalleryItem(idx, 'date', e.target.value)}
                          placeholder="e.g. January 2022"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">No media items added.</p>
            )}
          </div>
        </div>

        {/* 6. SOURCES & REFERENCES */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sources &amp; References</h2>
              <p className="text-xs text-slate-500">Documented journalistic and institutional sources</p>
            </div>
            <button
              type="button"
              onClick={addSourceItem}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Source</span>
            </button>
          </div>

          <div className="space-y-4">
            {memorial.sources && memorial.sources.length > 0 ? (
              memorial.sources.map((src: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeSourceItem(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition"
                    title="Remove source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid sm:grid-cols-3 gap-3 pr-8">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Article / Record Title</label>
                      <input
                        type="text"
                        value={src.title}
                        onChange={(e) => updateSourceItem(idx, 'title', e.target.value)}
                        placeholder="Article Headline"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Publisher</label>
                      <input
                        type="text"
                        value={src.publisher}
                        onChange={(e) => updateSourceItem(idx, 'publisher', e.target.value)}
                        placeholder="e.g. The Hindu"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Source URL</label>
                      <input
                        type="url"
                        value={src.url}
                        onChange={(e) => updateSourceItem(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Publication Date</label>
                      <input
                        type="text"
                        value={src.date}
                        onChange={(e) => updateSourceItem(idx, 'date', e.target.value)}
                        placeholder="10 January 2022"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No references added.</p>
            )}
          </div>
        </div>

        {/* 7. SEO & PUBLISHING */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Search Engine Optimization (SEO) &amp; Status
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Title</label>
              <input
                type="text"
                value={memorial.seoTitle || ''}
                onChange={(e) => setMemorial({ ...memorial, seoTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status</label>
              <select
                value={memorial.isPublished ? 'true' : 'false'}
                onChange={(e) => setMemorial({ ...memorial, isPublished: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="true">Published (Visible to all students)</option>
                <option value="false">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SEO Meta Description</label>
            <textarea
              rows={2}
              value={memorial.seoDescription || ''}
              onChange={(e) => setMemorial({ ...memorial, seoDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition text-base disabled:opacity-60"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
