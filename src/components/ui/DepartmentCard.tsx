import React from 'react';
import Link from 'next/link';
import {
  Laptop,
  Network,
  Zap,
  Radio,
  Cog,
  Bot,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface DepartmentCardProps {
  code: string;
  name: string;
  description?: string;
  materialCount?: number;
  baseHref: string; // e.g. '/notes/notes' or '/notes/question-papers'
}

const DEPT_ICONS: Record<string, React.ElementType> = {
  CSE: Laptop,
  IT: Network,
  EEE: Zap,
  ECE: Radio,
  ME: Cog,
  RAI: Bot,
};

const DEPT_COLORS: Record<string, { bg: string; text: string; border: string; hoverBorder: string; gradient: string }> = {
  CSE: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    gradient: 'from-blue-600 to-indigo-600',
  },
  IT: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-100',
    hoverBorder: 'hover:border-cyan-300',
    gradient: 'from-cyan-600 to-teal-600',
  },
  EEE: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300',
    gradient: 'from-amber-500 to-orange-600',
  },
  ECE: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
    gradient: 'from-emerald-600 to-teal-600',
  },
  ME: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    hoverBorder: 'hover:border-rose-300',
    gradient: 'from-rose-600 to-red-600',
  },
  RAI: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    hoverBorder: 'hover:border-purple-300',
    gradient: 'from-purple-600 to-violet-600',
  },
};

export default function DepartmentCard({
  code,
  name,
  description,
  materialCount = 0,
  baseHref,
}: DepartmentCardProps) {
  const Icon = DEPT_ICONS[code.toUpperCase()] || BookOpen;
  const color = DEPT_COLORS[code.toUpperCase()] || {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
    hoverBorder: 'hover:border-red-300',
    gradient: 'from-red-600 to-rose-600',
  };

  return (
    <Link
      href={`${baseHref}/${code.toUpperCase()}`}
      className={`group relative bg-white rounded-2xl p-6 border ${color.border} ${color.hoverBorder} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden`}
    >
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${color.gradient}`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl ${color.bg} ${color.text} flex items-center justify-center font-bold text-2xl group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-red-600 transition">
            {materialCount} {materialCount === 1 ? 'Material' : 'Materials'}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Department</span>
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-2">
            <span>{code}</span>
          </h3>
          <h4 className="text-sm font-semibold text-slate-700 line-clamp-1 mt-0.5">
            {name}
          </h4>
        </div>

        {description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-red-600 transition-colors">
        <span>Select Semesters</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
