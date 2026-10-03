'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Cloud,
  HardDrive,
  Eye,
  Check,
  X,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';

interface MaterialItem {
  _id: string;
  title: string;
  description?: string;
  type: string;
  department: string;
  semester: string;
  subject: string;
  academicYear?: string;
  category?: string;
  unitNumber?: number;
  fileSource: 'cloudinary' | 'external';
  fileUrl: string;
  cloudinaryUrl?: string;
  externalUrl?: string;
  fileName?: string;
  fileSize?: number;
  downloadCount: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminNotesPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDept, setFilterDept] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'CSE',
    semester: 'S6',
    subject: '',
    academicYear: '2026-27',
    category: 'Unit Notes',
    fileSource: 'external' as 'cloudinary' | 'external',
    externalUrl: '',
    cloudinaryUrl: '',
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    isPublished: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // Quick Add Subject State
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [addSubjectError, setAddSubjectError] = useState('');

  // Load initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [matRes, deptRes, semRes, catRes] = await Promise.all([
        fetch('/api/materials?type=notes&all=true').then((r) => r.json()),
        fetch('/api/departments?all=true').then((r) => r.json()),
        fetch('/api/semesters?all=true').then((r) => r.json()),
        fetch('/api/categories?type=notes').then((r) => r.json()),
      ]);

      if (matRes.materials) setMaterials(matRes.materials);
      if (deptRes.departments) setDepartments(deptRes.departments);
      if (semRes.semesters) setSemesters(semRes.semesters);
      if (catRes.categories) setCategories(catRes.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update dynamic subject choices when Dept + Sem change
  useEffect(() => {
    if (formData.department && formData.semester) {
      fetch(`/api/subjects?department=${formData.department}&semester=${formData.semester}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.subjects) {
            setSubjects(data.subjects);
            if (data.subjects.length > 0 && !formData.subject) {
              setFormData((prev) => ({ ...prev, subject: data.subjects[0].name }));
            }
          }
        })
        .catch(() => {});
    }
  }, [formData.department, formData.semester]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setSelectedFile(null);
    setFormError('');
    setFormData({
      title: '',
      description: '',
      department: departments[0]?.code || 'CSE',
      semester: 'S6',
      subject: '',
      academicYear: '2026-27',
      category: 'Unit Notes',
      fileSource: 'external',
      externalUrl: '',
      cloudinaryUrl: '',
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      isPublished: true,
    });
    setShowAddSubject(false);
    setNewSubjectCode('');
    setNewSubjectName('');
    setAddSubjectError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MaterialItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setSelectedFile(null);
    setFormError('');
    setFormData({
      title: item.title,
      description: item.description || '',
      department: item.department,
      semester: item.semester,
      subject: item.subject,
      academicYear: item.academicYear || '2026-27',
      category: item.category || 'Unit Notes',
      fileSource: item.fileSource,
      externalUrl: item.externalUrl || '',
      cloudinaryUrl: item.cloudinaryUrl || '',
      fileUrl: item.fileUrl,
      fileName: item.fileName || '',
      fileSize: item.fileSize || 0,
      isPublished: item.isPublished,
    });
    setShowAddSubject(false);
    setIsModalOpen(true);
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) {
      setAddSubjectError('Both Subject Name and Subject Code are required.');
      return;
    }
    setIsSavingSubject(true);
    setAddSubjectError('');
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubjectName.trim(),
          code: newSubjectCode.trim().toUpperCase(),
          department: formData.department,
          semester: formData.semester,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddSubjectError(data.error || 'Failed to add subject');
        return;
      }
      const created = data.subject || {
        name: newSubjectName.trim(),
        code: newSubjectCode.trim().toUpperCase(),
      };
      setSubjects((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, subject: created.name }));
      setNewSubjectName('');
      setNewSubjectCode('');
      setShowAddSubject(false);
    } catch (err: any) {
      setAddSubjectError(err.message || 'Error creating subject');
    } finally {
      setIsSavingSubject(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this study note?')) return;
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleFileUpload = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', `sfi-geci/notes/${formData.department}/${formData.semester}`);
    uploadData.append('resourceType', 'raw');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: uploadData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Upload to Cloudinary failed');
    }
    return json;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setFormError('');

    try {
      let finalCloudinaryUrl = formData.cloudinaryUrl;
      let finalFileName = formData.fileName;
      let finalFileSize = formData.fileSize;

      // Handle PDF upload if Cloudinary is chosen and new file selected
      if (formData.fileSource === 'cloudinary' && selectedFile) {
        const uploadResult = await handleFileUpload(selectedFile);
        finalCloudinaryUrl = uploadResult.url;
        finalFileName = uploadResult.fileName;
        finalFileSize = uploadResult.bytes;
      }

      const payload = {
        ...formData,
        type: 'notes',
        cloudinaryUrl: finalCloudinaryUrl,
        fileName: finalFileName,
        fileSize: finalFileSize,
        fileUrl: formData.fileSource === 'cloudinary' ? finalCloudinaryUrl : formData.externalUrl,
      };

      const url = modalMode === 'create' ? '/api/materials' : `/api/materials/${currentId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to save note');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Error saving study material');
    } finally {
      setUploading(false);
    }
  };

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (filterDept && m.department !== filterDept) return false;
    if (filterSem && m.semester !== filterSem) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        m.title.toLowerCase().includes(s) ||
        m.subject.toLowerCase().includes(s) ||
        m.department.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Academic Vault Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-red-600" />
            <span>Study Notes Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upload PDF notes to Cloudinary or paste external links (Google Drive, OneDrive).
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md shadow-red-600/20 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search notes by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.code} value={d.code}>{d.code}</option>
            ))}
          </select>

          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s.code} value={s.code}>{s.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Title & Unit</th>
                <th className="py-4 px-4">Dept / Sem</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Source</th>
                <th className="py-4 px-4">Accesses</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.category || 'Notes'}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-700">
                    {item.department} • {item.semester}
                  </td>
                  <td className="py-4 px-4 text-slate-800 font-semibold truncate max-w-[200px]">
                    {item.subject}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.fileSource === 'cloudinary'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.fileSource === 'cloudinary' ? <Cloud className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
                      <span>{item.fileSource === 'cloudinary' ? 'Cloudinary' : 'External Link'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-600">
                    {item.downloadCount || 0}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => window.open(item.fileUrl, '_blank')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Open file"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMaterials.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No notes matching your current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT NOTE MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">
                {modalMode === 'create' ? '+ Add New Study Note' : 'Edit Study Note'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 1: DBMS Introduction & ER Model"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Department & Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value, subject: '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value, subject: '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {semesters.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} ({s.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Subject Selection */}
              {/* Dynamic Subject with Inline Add */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Subject (From {formData.department} • {formData.semester}) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSubject(!showAddSubject);
                      setAddSubjectError('');
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddSubject ? 'Close' : '+ Add Subject'}</span>
                  </button>
                </div>

                {subjects.length > 0 ? (
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setShowAddSubject(true);
                      } else {
                        setFormData({ ...formData, subject: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((sub) => (
                      <option key={sub.code} value={sub.name}>
                        {sub.code}: {sub.name}
                      </option>
                    ))}
                    <option value="__NEW__">➕ Add New Subject...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter subject name manually or add subject below"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                {/* Inline Quick Add Subject Box */}
                {showAddSubject && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Add Subject to {formData.department} • {formData.semester}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddSubject(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Code (e.g. GAMAT101)"
                        value={newSubjectCode}
                        onChange={(e) => setNewSubjectCode(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                      />
                      <input
                        type="text"
                        placeholder="Subject Name (e.g. Mathematics)"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    {addSubjectError && (
                      <p className="text-[11px] text-red-600 font-medium">{addSubjectError}</p>
                    )}
                    <button
                      type="button"
                      disabled={isSavingSubject}
                      onClick={handleCreateSubject}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      {isSavingSubject ? 'Saving Subject...' : 'Save & Select Subject'}
                    </button>
                  </div>
                )}
              </div>

              {/* Category (Unit Number removed) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Unit Notes">Unit Notes</option>
                  <option value="Class Notes">Class Notes</option>
                  <option value="Study Material">Study Material</option>
                  <option value="Assignments">Assignments</option>
                  <option value="Lab Material">Lab Material</option>
                  <option value="Question Bank">Question Bank</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key concepts covered in this unit..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* FILE SOURCE SELECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  File Source Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fileSource: 'cloudinary' })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      formData.fileSource === 'cloudinary'
                        ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Cloud className="w-4 h-4 text-blue-500" />
                    <span>Upload PDF (Cloudinary)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fileSource: 'external' })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      formData.fileSource === 'external'
                        ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    <span>External Link (Google Drive)</span>
                  </button>
                </div>

                {formData.fileSource === 'cloudinary' ? (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Choose PDF File {modalMode === 'edit' && '(Leave empty to keep existing)'}
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      required={modalMode === 'create' && !formData.cloudinaryUrl}
                      onChange={(e) => {
                        if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                    />
                    {formData.cloudinaryUrl && (
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        Current: <a href={formData.cloudinaryUrl} target="_blank" className="text-blue-600 underline">View uploaded PDF</a>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PDF / File URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required={formData.fileSource === 'external'}
                      placeholder="https://drive.google.com/file/d/..."
                      value={formData.externalUrl}
                      onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports public Google Drive, OneDrive, or Dropbox shareable PDF links.
                    </p>
                  </div>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-slate-700">Publish Immediately</label>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 disabled:opacity-50"
                >
                  {uploading ? 'Processing File...' : modalMode === 'create' ? 'Publish Note' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
