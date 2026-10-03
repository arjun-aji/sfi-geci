import React from 'react';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import SemesterCard from '@/components/ui/SemesterCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Layers } from 'lucide-react';

interface Props {
  params: Promise<{ dept: string }>;
}

export const revalidate = 60;

export default async function QuestionPapersSemesterSelectPage({ params }: Props) {
  const { dept } = await params;
  const deptCode = dept.toUpperCase();

  const [department, semesters, subjects] = await Promise.all([
    DataService.getDepartmentByCode(deptCode),
    DataService.getSemesters(true),
    DataService.getSubjects(deptCode, undefined, true),
  ]);

  if (!department) {
    notFound();
  }

  // Count subjects per semester
  const subjectCounts: Record<string, number> = {};
  subjects.forEach((s) => {
    const sem = s.semester?.toUpperCase();
    if (sem) subjectCounts[sem] = (subjectCounts[sem] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <Breadcrumbs
        items={[
          { label: 'Notes', href: '/notes' },
          { label: 'Question Papers', href: '/notes/question-papers' },
          { label: department.code },
        ]}
      />

      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Step 2 of 3: Select Semester</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {department.name} ({department.code})
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Select semester level to access official previous year KTU examination question papers.
        </p>
      </div>

      {/* 8 Semesters Responsive Grid: Desktop 4x2, Mobile 2x4 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {semesters.map((sem) => (
          <SemesterCard
            key={sem._id}
            code={sem.code}
            name={sem.name}
            subjectCount={subjectCounts[sem.code.toUpperCase()] || 0}
            href={`/notes/question-papers/${department.code}/${sem.code}`}
          />
        ))}
      </div>
    </div>
  );
}
