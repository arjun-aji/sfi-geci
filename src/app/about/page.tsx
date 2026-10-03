import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Flame, ShieldCheck, BookOpen, Heart, Award, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'About SFI GECI Unit | History & Ideals',
  description: "Learn about the Students' Federation of India unit at Government Engineering College Idukki and its commitment to progressive education.",
};

export default async function AboutPage() {
  const settings = await DataService.getSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-12">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          <span>Study & Struggle</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About SFI GEC Idukki Unit
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {settings.aboutText}
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
            🏛️
          </div>
          <h3 className="text-lg font-bold text-slate-900">Independence</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Preserving autonomous student thought, free from authoritarian diktats, and defending equal academic opportunities for every engineering student.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
            ⚖️
          </div>
          <h3 className="text-lg font-bold text-slate-900">Democracy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Democratic campus elections, student union governance, transparent grievance resolution, and amplifying student voices in college decision-making.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            ✊
          </div>
          <h3 className="text-lg font-bold text-slate-900">Socialism</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Universal access to educational resources, affordable canteen & hostel fees, digital learning equity, and solidarity with working class causes.
          </p>
        </div>
      </div>

      {/* Legacy and Campus Welfare */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-red-400">
          Academic Sanctuary in the High Ranges
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Situated amidst the misty hills of Painavu, Government Engineering College Idukki presents unique geographical and infrastructural challenges. SFI GECI has stood at the forefront of every campus reform — from establishing 24/7 college bus services, securing high-speed Wi-Fi, expanding women's hostels, to launching this state-of-the-art open academic repository.
        </p>
        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href="/notes"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-md"
          >
            Access Study Materials →
          </Link>
          <Link
            href="/members"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
          >
            Meet the Unit Committee
          </Link>
        </div>
      </div>
    </div>
  );
}
