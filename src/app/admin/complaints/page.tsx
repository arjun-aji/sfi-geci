'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Building,
  Layers,
  Tag,
  AlertCircle,
  X,
  Send,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ComplaintItem {
  _id: string;
  complaintNumber: string;
  studentName?: string;
  email?: string;
  department: string;
  semester: string;
  category: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
  isAnonymous: boolean;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Rejected' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  internalNotes: Array<{ note: string; author: string; createdAt: string }>;
  statusHistory: Array<{ status: string; comment?: string; changedBy: string; changedAt: string }>;
  createdAt: string;
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Complaint Details Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatePriority, setUpdatePriority] = useState('');
  const [updateAssigned, setUpdateAssigned] = useState('');
  const [newInternalNote, setNewInternalNote] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.complaints) {
        setComplaints(data.complaints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openDetailModal = (c: ComplaintItem) => {
    setSelectedComplaint(c);
    setUpdateStatus(c.status);
    setUpdatePriority(c.priority);
    setUpdateAssigned(c.assignedTo || 'Unassigned');
    setNewInternalNote('');
    setStatusComment('');
  };

  const handleSaveResolution = async () => {
    if (!selectedComplaint) return;
    setSaving(true);

    try {
      const payload: any = {
        status: updateStatus,
        priority: updatePriority,
        assignedTo: updateAssigned,
        statusComment: statusComment || undefined,
        internalNote: newInternalNote || undefined,
      };

      const res = await fetch(`/api/complaints/${selectedComplaint._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.complaint) {
        setSelectedComplaint(json.complaint);
        setComplaints((prev) =>
          prev.map((c) => (c._id === json.complaint._id ? json.complaint : c))
        );
        setNewInternalNote('');
        setStatusComment('');
        alert('Grievance status & notes updated successfully.');
      }
    } catch (e) {
      alert('Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint record?')) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComplaints((prev) => prev.filter((c) => c._id !== id));
        if (selectedComplaint?._id === id) setSelectedComplaint(null);
      }
    } catch (e) {
      alert('Failed to delete');
    }
  };

  // Metrics
  const total = complaints.length;
  const submittedCount = complaints.filter((c) => c.status === 'Submitted').length;
  const reviewCount = complaints.filter((c) => c.status === 'Under Review').length;
  const progressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const urgentCount = complaints.filter((c) => c.priority === 'Urgent').length;

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterPriority && c.priority !== filterPriority) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.complaintNumber.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        (c.studentName && c.studentName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Student Welfare & Redressal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquareWarning className="w-7 h-7 text-rose-600" />
          <span>Grievance Management Desk</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review student grievances, assign union representatives, maintain status timelines, and add private internal notes.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Logged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
          <span className="text-[10px] font-bold text-purple-700 uppercase">New / Submitted</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{submittedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-[10px] font-bold text-amber-700 uppercase">Under Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{reviewCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
          <span className="text-[10px] font-bold text-blue-700 uppercase">In Progress</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{progressCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Resolved</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <span className="text-[10px] font-bold text-rose-700 uppercase">Urgent Flagged</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{urgentCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by ID, subject, or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">ID & Subject</th>
                <th className="py-4 px-4">Student</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Dept / Sem</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono font-bold text-red-600">{c.complaintNumber}</div>
                    <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">{c.subject}</div>
                  </td>
                  <td className="py-4 px-4">
                    {c.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Anonymous</span>
                      </span>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-800">{c.studentName || 'Student'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{c.email || '—'}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{c.category}</td>
                  <td className="py-4 px-4 font-bold text-slate-700">{c.department} • {c.semester}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : c.priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : c.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-xs font-medium">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openDetailModal(c)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition"
                    >
                      Resolve / View
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLAINT DETAILS & RESOLUTION DRAWER / MODAL */}
      {/* ========================================================================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                  {selectedComplaint.complaintNumber}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedComplaint.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Info & Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Submitted By</span>
                <span className="font-bold text-slate-800">
                  {selectedComplaint.isAnonymous ? 'Anonymous' : selectedComplaint.studentName || 'Student'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-bold text-slate-800">
                  {selectedComplaint.department} • {selectedComplaint.semester}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-800">{selectedComplaint.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Date Lodged</span>
                <span className="font-bold text-slate-800">{formatDate(selectedComplaint.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Student's Grievance Description
              </span>
              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {selectedComplaint.description}
              </p>
              {selectedComplaint.attachmentUrl && (
                <div className="pt-2">
                  <a
                    href={selectedComplaint.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Provided Attachment / Proof Link ↗</span>
                  </a>
                </div>
              )}
            </div>

            {/* Resolution Control Form */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Resolution Workflow & Action
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Union Lead</label>
                  <input
                    type="text"
                    value={updateAssigned}
                    onChange={(e) => setUpdateAssigned(e.target.value)}
                    placeholder="e.g. Rahul Mohan (VP)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Public Timeline Status Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Status Timeline Update <span className="text-slate-400 font-normal">(Visible to student upon tracking)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technicians have resolved the seminar hall projector issue."
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Internal Admin Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Add Confidential Internal Note <span className="text-slate-400 font-normal">(STRICTLY Private to Admins)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Add private investigation notes, technician quotes, or committee discussions..."
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveResolution}
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                {saving ? 'Saving Updates...' : 'Update Grievance & Timeline'}
              </button>
            </div>

            {/* Existing Private Internal Notes */}
            {selectedComplaint.internalNotes && selectedComplaint.internalNotes.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Confidential Admin Notes History
                </span>
                <div className="space-y-2">
                  {selectedComplaint.internalNotes.map((note, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span>{note.author}</span>
                        <span className="text-slate-400 font-normal">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-slate-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
