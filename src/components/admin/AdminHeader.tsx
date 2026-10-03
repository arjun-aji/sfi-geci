'use client';

import React from 'react';
import { Menu, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function AdminHeader({
  onMenuToggle,
  title,
  user,
}: {
  onMenuToggle: () => void;
  title?: string;
  user?: { name: string; role: string; email: string } | null;
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          {title || 'Admin Console'}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
          <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-red-600 tracking-wider">
              {user?.role || 'Superadmin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
