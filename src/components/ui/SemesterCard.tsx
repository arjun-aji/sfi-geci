import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface SemesterCardProps {
  code: string; // S1 .. S8
  name: string; // Semester 1 .. Semester 8
  subjectCount?: number;
  href: string;
}

export default function SemesterCard({
  code,
  name,
  subjectCount,
  href,
}: SemesterCardProps) {
  // Cycle pleasant subtle accent rings
  const semesterNum = parseInt(code.replace('S', '')) || 1;
  const isOdd = semesterNum % 2 !== 0;

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-red-500 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between overflow-hidden text-center sm:text-left"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full -z-0 opacity-70 group-hover:scale-125 transition-transform" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
            {code}
          </div>
          {subjectCount !== undefined && (
            <span className="hidden sm:inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-red-600 transition">
              {subjectCount} Subjects
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
          {code}
        </h3>
        <p className="text-sm font-semibold text-slate-600 mt-0.5">
          {name}
        </p>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {isOdd ? 'Monsoon Semester' : 'Spring Semester'}
        </p>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-red-600 transition-colors">
        <span>View Subjects</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
