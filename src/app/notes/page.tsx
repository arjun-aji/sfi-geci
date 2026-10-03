import React from 'react';
import Link from 'next/link';
import { BookOpen, FileQuestion, ArrowRight, Sparkles, GraduationCap, Search } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata = {
  title: 'Digital Academic Vault | SFI GECI',
  description: 'Choose between KTU Study Notes and Previous Year Question Papers for GEC Idukki.',
};

export default function NotesIndexPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl">
      <Breadcrumbs items={[{ label: 'Study Portal' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>SFI GECI Academic Repository</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Digital Academic Vault
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Access high-yield KTU lecture notes, module guides, and official previous year university question papers organized across all 6 engineering departments.
        </p>
      </div>

      {/* The Two Major Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card 1: NOTES */}
        <Link
          href="/notes/notes"
          className="group relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-red-100 hover:border-red-500 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full -z-0 opacity-80 group-hover:scale-125 transition-transform" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform mb-6">
              📚
            </div>

            <span className="text-xs font-black tracking-widest text-red-600 uppercase">
              Section 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-red-600 transition-colors mt-1">
              STUDY NOTES
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Unit-wise class notes, faculty study materials, module summaries, assignments, and comprehensive lab manuals for all KTU semesters.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-red-600 group-hover:text-red-700">
            <span className="uppercase tracking-wider">Explore Notes</span>
            <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Card 2: PREVIOUS YEAR QUESTION PAPERS */}
        <Link
          href="/notes/question-papers"
          className="group relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-100 hover:border-amber-500 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full -z-0 opacity-80 group-hover:scale-125 transition-transform" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform mb-6">
              📝
            </div>

            <span className="text-xs font-black tracking-widest text-amber-600 uppercase">
              Section 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-amber-600 transition-colors mt-1">
              QUESTION PAPERS
            </h2>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Official KTU regular & supplementary university examination question papers, internal series tests, and model question banks with answer keys.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-amber-600 group-hover:text-amber-700">
            <span className="uppercase tracking-wider">Explore Question Papers</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
