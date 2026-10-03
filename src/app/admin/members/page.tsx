'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Image as ImageIcon,
  AlertCircle,
  Shield,
  Award,
} from 'lucide-react';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';
import MemberPlaceholder from '@/components/ui/MemberPlaceholder';
import {
  MEMBER_POSITIONS,
  POSITION_LIMITS,
  normalizePosition,
  formatComradeName,
  MemberPosition,
} from '@/lib/member-constants';

interface MemberItem {
  _id: string;
  name: string;
  position: string;
  department: string;
  semester: string;
  academicYear: string;
  photoUrl: string;
  bio?: string;
  phone?: string;
  email?: string;
  order: number;
  isActive: boolean;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('ALL');
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const [formData, setFormData] = useState({
    name: '',
    position: 'Unit Member' as MemberPosition,
    department: 'CSE',
    semester: 'S7',
    academicYear: '2026-27',
    photoUrl: '',
    bio: '',
    phone: '',
    order: 1,
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const [memRes, ayRes, deptRes] = await Promise.all([
        fetch('/api/members?all=true').then((r) => r.json()),
        fetch('/api/academic-years').then((r) => r.json()),
        fetch('/api/departments?all=true').then((r) => r.json()),
      ]);
      if (memRes.members) setMembers(memRes.members);
      if (ayRes.academicYears) setAcademicYears(ayRes.academicYears);
      if (deptRes.departments) setDepartments(deptRes.departments);
    } catch (err) {
      console.error('Failed to fetch members data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormError(null);
    const activeYear = filterYear !== 'ALL' ? filterYear : (academicYears.find((y) => y.isCurrent)?.year || academicYears[0]?.year || '2026-27');
    setFormData({
      name: '',
      position: 'Unit Member',
      department: 'GECI',
      semester: 'Unit',
      academicYear: activeYear,
      photoUrl: '',
      bio: '',
      phone: '',
      order: members.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MemberItem) => {
    setModalMode('edit');
    setCurrentId(item._id);
    setFormError(null);
    setFormData({
      name: item.name,
      position: normalizePosition(item.position),
      department: item.department || 'GECI',
      semester: item.semester || 'Unit',
      academicYear: item.academicYear || '2026-27',
      photoUrl: item.photoUrl || '',
      bio: item.bio || '',
      phone: item.phone || '',
      order: typeof item.order === 'number' ? item.order : 1,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m._id !== id));
    }
  };

  const handleToggleActive = async (member: MemberItem) => {
    const nextStatus = !member.isActive;

    // If activating a leadership position, check limit
    const position = normalizePosition(member.position);
    const limit = POSITION_LIMITS[position];
    if (nextStatus && limit !== undefined) {
      const activeSamePos = members.filter(
        (m) =>
          m.isActive &&
          m.academicYear === member.academicYear &&
          normalizePosition(m.position) === position &&
          m._id !== member._id
      ).length;

      if (activeSamePos >= limit) {
        const title = limit === 1 ? `one active ${position}` : `${limit} active ${position}s`;
        alert(`Only ${title} can be assigned for academic year ${member.academicYear}.`);
        return;
      }
    }

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...member,
          isActive: nextStatus,
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      alert('Failed to update member status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const position = normalizePosition(formData.position);

    if (!formData.name?.trim()) {
      setFormError('Member name is required.');
      return;
    }

    // Validate leadership position limits per academic year
    const limit = POSITION_LIMITS[position];
    if (formData.isActive && limit !== undefined) {
      const activeCount = members.filter(
        (m) =>
          m.isActive &&
          m.academicYear === formData.academicYear &&
          normalizePosition(m.position) === position &&
          m._id !== currentId
      ).length;

      if (activeCount >= limit) {
        const title = limit === 1 ? `one active ${position}` : `${limit} active ${position}s`;
        setFormError(`Only ${title} can be assigned for academic year ${formData.academicYear}.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        position,
        phone: formData.phone?.trim() || '',
        photoUrl: formData.photoUrl?.trim() || '',
        ...(modalMode === 'edit' && currentId ? { _id: currentId } : {}),
      };

      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save member.');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const pos = normalizePosition(m.position);
    if (filterPosition !== 'ALL' && pos !== filterPosition) return false;
    if (filterYear !== 'ALL' && m.academicYear !== filterYear) return false;
    if (filterDepartment !== 'ALL' && m.department !== filterDepartment) return false;
    if (filterStatus === 'ACTIVE' && !m.isActive) return false;
    if (filterStatus === 'INACTIVE' && m.isActive) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchPhone = m.phone?.toLowerCase().includes(q);
      const matchDept = m.department?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDept) return false;
    }
    return true;
  });

  const isPresOrSec = formData.position === 'President' || formData.position === 'Secretary';

  // Badge styling for positions
  const getPositionBadge = (posStr: string) => {
    const pos = normalizePosition(posStr);
    switch (pos) {
      case 'President':
        return 'bg-red-600 text-white shadow-2xs font-black';
      case 'Secretary':
        return 'bg-rose-600 text-white shadow-2xs font-black';
      case 'Vice President':
        return 'bg-amber-100 text-amber-900 border border-amber-200 font-bold';
      case 'Joint Secretary':
        return 'bg-blue-100 text-blue-900 border border-blue-200 font-bold';
      case 'Secretariat Member':
        return 'bg-purple-100 text-purple-900 border border-purple-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Unit Leadership CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-red-600" />
            <span>Unit Committee Members</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage President, Secretary, Vice Presidents, Secretariat, and Unit Members.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by Name */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filter by Position */}
          <div>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="ALL">All Positions</option>
              {MEMBER_POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Academic Year */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="ALL">All Academic Years</option>
              {academicYears.map((ay) => (
                <option key={ay.year} value={ay.year}>
                  {ay.year} {ay.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Count summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredMembers.length}</strong> of{' '}
            {members.length} members
          </span>
          {(searchTerm ||
            filterPosition !== 'ALL' ||
            filterYear !== 'ALL' ||
            filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPosition('ALL');
                setFilterYear('ALL');
                setFilterStatus('ALL');
              }}
              className="text-red-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-4">Photo</th>
                <th className="py-4 px-4">Name & Position</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Dept / Sem</th>
                <th className="py-4 px-4">Academic Year</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Order</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => {
                const normPos = normalizePosition(m.position);
                return (
                  <tr key={m._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Photo with silhouette fallback */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <MemberPlaceholder size="xs" className="w-full h-full rounded-none" />
                        )}
                      </div>
                    </td>

                    {/* Name & Position */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{formatComradeName(m.name)}</div>
                      <span
                        className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] ${getPositionBadge(
                          m.position
                        )}`}
                      >
                        {normPos}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">
                      {m.phone ? (
                        <a
                          href={`tel:${m.phone}`}
                          className="hover:text-red-600 inline-flex items-center gap-1 font-bold text-slate-700"
                        >
                          <Phone className="w-3 h-3 text-red-500" />
                          <span>{m.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    {/* Dept & Sem */}
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {m.department} • {m.semester}
                    </td>

                    {/* Academic Year */}
                    <td className="py-3 px-4 font-bold text-slate-700">{m.academicYear}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(m)}
                        title="Click to toggle active status"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                          m.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {m.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Display Order */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{m.order}</td>

                    {/* Actions */}
                    <td className="py-3 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Member Details & Photo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No unit members match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT MEMBER MODAL                                                  */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-5">
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>{modalMode === 'create' ? '+ Add Unit Member' : 'Edit Unit Member'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="text-red-400 hover:text-red-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Academic Year & Position Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {academicYears.map((ay) => (
                      <option key={ay.year} value={ay.year}>
                        {ay.year} {ay.isCurrent ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Position / Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value as MemberPosition })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {MEMBER_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sidharth K. S."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                />
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span>Displays as:</span>
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    {formatComradeName(formData.name || 'Member Name')}
                  </span>
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 94471 23456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Adds a clickable call button for quick contacting.
                </p>
              </div>

              {/* Photo Upload / Browse / Remove */}
              <div className="space-y-2">
                <ImageUploadPicker
                  label="Member Photo (Optional)"
                  folder="sfi-geci/members"
                  value={formData.photoUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
                  placeholder="https://... or browse local image file"
                  helperText="Leave empty to use official silhouette placeholder. You can add or change photos anytime."
                />

                {/* Quick Remove Photo action if photo exists */}
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photoUrl: '' }))}
                    className="text-xs text-red-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove photo (revert to placeholder)</span>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Member' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
