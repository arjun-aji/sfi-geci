import React from 'react';
import { DataService } from '@/lib/data-service';
import DepartmentCard from '@/components/ui/DepartmentCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { BookOpen } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Departments — Study Notes | SFI GECI',
  description: 'Select your engineering department to access KTU study notes and course materials.',
};

export default async function NotesDepartmentsPage() {
  const [departments, allMaterials] = await Promise.all([
    DataService.getDepartments(true),
    DataService.getMaterials({ type: 'notes', publishedOnly: true }),
  ]);

  // Calculate material count per department
  const counts: Record<string, number> = {};
  allMaterials.forEach((m) => {
    const d = m.department?.toUpperCase();
    if (d) counts[d] = (counts[d] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <Breadcrumbs
        items={[
          { label: 'Notes', href: '/notes' },
          { label: 'Study Notes' },
        ]}
      />

      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Step 1 of 3: Select Department</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Select Your Department
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Choose from the 6 official undergraduate engineering branches at Government Engineering College Idukki.
        </p>
      </div>

      {/* Responsive Grid: Desktop 3x2, Mobile 2x3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept._id}
            code={dept.code}
            name={dept.name}
            description={dept.description}
            materialCount={counts[dept.code.toUpperCase()] || 0}
            baseHref="/notes/notes"
          />
        ))}
      </div>
    </div>
  );
}
