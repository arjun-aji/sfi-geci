'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquareWarning,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Send,
  FileUp,
  AlertCircle,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { WEB3FORMS_ACCESS_KEY } from '@/lib/web3forms';

export default function ComplaintSubmitPage() {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    department: 'CSE',
    semester: 'S6',
    category: 'Academic',
    subject: '',
    description: '',
    attachmentUrl: '',
    isAnonymous: false,
  });

  const [categories, setCategories] = useState<string[]>([
    'Academic',
    'Campus Facilities',
    'Hostel',
    'Canteen',
    'Transportation',
    'Library',
    'Examination',
    'Student Activities',
    'Harassment / Safety',
    'Administration',
    'Other',
  ]);

  const [departments, setDepartments] = useState<string[]>(['CSE', 'IT', 'EEE', 'ECE', 'ME', 'RAI']);
  const [semesters, setSemesters] = useState<string[]>(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch dynamic complaint categories & departments if available
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (data.departments?.length) {
          setDepartments(data.departments.map((d: any) => d.code));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit grievance');
      }

      const complaintRef = data.complaintNumber;

      // Send email notification via Web3Forms
      try {
        const emailFormData = new FormData();
        emailFormData.append('access_key', WEB3FORMS_ACCESS_KEY);
        emailFormData.append(
          'subject',
          `[New Grievance] #${complaintRef} - ${formData.category}: ${formData.subject}`
        );
        emailFormData.append('from_name', 'SFI GECI Grievance Desk');
        emailFormData.append('Complaint Number', complaintRef);
        emailFormData.append('Category', formData.category);
        emailFormData.append('Department', formData.department);
        emailFormData.append('Semester', formData.semester);
        emailFormData.append('Grievance Title', formData.subject);
        emailFormData.append('Description', formData.description);
        emailFormData.append(
          'Student Name',
          formData.isAnonymous ? 'Anonymous' : formData.studentName || 'Not specified'
        );
        emailFormData.append(
          'Student Email',
          formData.isAnonymous ? 'Hidden (Anonymous)' : formData.email || 'Not specified'
        );
        if (formData.attachmentUrl) {
          emailFormData.append('Attachment Link', formData.attachmentUrl);
        }
        emailFormData.append('Anonymous Submission', formData.isAnonymous ? 'Yes' : 'No');

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: emailFormData,
        });
      } catch (emailErr) {
        console.warn('Web3Forms notification dispatch failed:', emailErr);
      }

      setSubmittedRef(complaintRef);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      <Breadcrumbs items={[{ label: 'Student Grievance Cell' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Confidential Support Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Student Grievance Redressal
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Submit issues concerning academics, hostel amenities, transportation, or campus facilities. Every grievance is tracked with a private reference ID.
        </p>
      </div>

      {submittedRef ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-300 shadow-xl max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Grievance Lodged Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Your grievance has been submitted securely to the SFI GECI Student Welfare Council.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Your Complaint Reference ID
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl sm:text-3xl font-black text-red-600 font-mono tracking-wider">
                {submittedRef}
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 transition text-slate-700"
                title="Copy Reference Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Please save this code to check resolution progress anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/complaints/track?number=${encodeURIComponent(submittedRef)}`}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition"
            >
              Track Complaint Status →
            </Link>
            <button
              onClick={() => {
                setSubmittedRef(null);
                setFormData({
                  studentName: '',
                  email: '',
                  department: 'CSE',
                  semester: 'S6',
                  category: 'Academic',
                  subject: '',
                  description: '',
                  attachmentUrl: '',
                  isAnonymous: false,
                });
              }}
              className="w-full sm:w-auto text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-3"
            >
              Submit Another Grievance
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Private & Encrypted Grievance Form</span>
            </div>
            <Link
              href="/complaints/track"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Already submitted? Track here →
            </Link>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Anonymous Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <label htmlFor="isAnonymous" className="text-sm font-bold text-slate-900 cursor-pointer">
                  Submit Anonymously
                </label>
                <p className="text-xs text-slate-500">
                  Your identity and contact info will not be collected or displayed.
                </p>
              </div>
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
              />
            </div>

            {/* Name & Email (Shown when not anonymous) */}
            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Rahul S."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(For status updates)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@gecidukki.ac.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* Department & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  required
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  required
                >
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Complaint Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of the issue (e.g. Library AC not functioning in reading hall)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Please explain the issue with specifics (date, time, classroom, or person involved)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Optional Attachment Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attachment / Proof URL <span className="text-slate-400 font-normal">(Optional Google Drive / Photo Link)</span>
              </label>
              <input
                type="url"
                value={formData.attachmentUrl}
                onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center space-x-2 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Lodging Grievance & Sending Alert...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Grievance Securely</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
