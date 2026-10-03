import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { BookOpen, ArrowRight, FileText, Sparkles, FolderOpen } from 'lucide-react';

interface Props {
  params: Promise<{ dept: string; sem: string }>;
}

export const revalidate = 60;

export default async function NotesSubjectSelectPage({ params }: Props) {
  const { dept, sem } = await params;
  const deptCode = dept.toUpperCase();
  const semCode = sem.toUpperCase();

  const [department, subjects, allMaterials] = await Promise.all([
    DataService.getDepartmentByCode(deptCode),
    DataService.getSubjects(deptCode, semCode, true),
    DataService.getMaterials({
      type: 'notes',
      department: deptCode,
      semester: semCode,
      publishedOnly: true,
    }),
  ]);

  if (!department) {
    notFound();
  }

  // Count notes per subject
  const noteCounts: Record<string, number> = {};
  allMaterials.forEach((m) => {
    const s = m.subject?.toLowerCase().trim();
    if (s) noteCounts[s] = (noteCounts[s] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <Breadcrumbs
        items={[
          { label: 'Notes', href: '/notes' },
          { label: 'Study Notes', href: '/notes/notes' },
          { label: department.code, href: `/notes/notes/${department.code}` },
          { label: semCode },
        ]}
      />

      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Step 3 of 3: Select Subject</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {department.code} • {semCode} Curriculum
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Select a subject below to view verified unit notes, study guides, and lecture slides.
        </p>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const count = noteCounts[sub.name.toLowerCase().trim()] || 0;

            return (
              <Link
                key={sub._id}
                href={`/notes/notes/${department.code}/${semCode}/${encodeURIComponent(sub.name)}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-red-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-100">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-red-700 transition">
                      {count} {count === 1 ? 'Material' : 'Materials'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {sub.name}
                  </h3>

                  {sub.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-red-600 transition-colors">
                  <span>Browse Unit Notes</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No subjects cataloged yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Subjects for {department.code} {semCode} will be added shortly by the department academic committee.
          </p>
          <div className="mt-6">
            <Link
              href={`/notes/notes/${department.code}`}
              className="inline-block text-xs font-bold text-red-600 hover:underline"
            >
              ← Choose another semester
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
