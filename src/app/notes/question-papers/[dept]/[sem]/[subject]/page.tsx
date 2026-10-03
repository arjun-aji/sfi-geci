import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import MaterialCard from '@/components/ui/MaterialCard';
import { FileQuestion, FolderOpen, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ dept: string; sem: string; subject: string }>;
}

export const revalidate = 60;

export default async function QuestionPaperListPage({ params }: Props) {
  const { dept, sem, subject } = await params;
  const deptCode = dept.toUpperCase();
  const semCode = sem.toUpperCase();
  const decodedSubject = decodeURIComponent(subject);

  const [department, materials] = await Promise.all([
    DataService.getDepartmentByCode(deptCode),
    DataService.getMaterials({
      type: 'question-paper',
      department: deptCode,
      semester: semCode,
      subject: decodedSubject,
      publishedOnly: true,
    }),
  ]);

  if (!department) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <Breadcrumbs
        items={[
          { label: 'Notes', href: '/notes' },
          { label: 'Question Papers', href: '/notes/question-papers' },
          { label: department.code, href: `/notes/question-papers/${department.code}` },
          { label: semCode, href: `/notes/question-papers/${department.code}/${semCode}` },
          { label: decodedSubject },
        ]}
      />

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>{department.code} • {semCode}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {decodedSubject}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Official previous year university examination question papers and answer schemes.
          </p>
        </div>

        <Link
          href={`/notes/question-papers/${department.code}/${semCode}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm self-start md:self-auto transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All {semCode} Subjects</span>
        </Link>
      </div>

      {/* Question Papers Grid */}
      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((item) => (
            <MaterialCard key={item._id} material={item as any} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto">
          <FolderOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">
            No previous year question papers available for this subject yet.
          </h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            The SFI academic repository team is currently digitizing physical question papers from college archives.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/notes/question-papers/${department.code}/${semCode}`}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              Back to Subjects
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
