'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Image as ImageIcon,
  BookOpen,
  FileQuestion,
  GraduationCap,
  Tag,
  Building2,
  Layers,
  CalendarRange,
  Users,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  Heart,
} from 'lucide-react';

interface SidebarGroup {
  group: string;
  items: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
  }>;
}

const SIDEBAR_NAV: SidebarGroup[] = [
  {
    group: 'Main',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    group: 'Study Materials',
    items: [
      { name: 'Study Notes', href: '/admin/notes', icon: BookOpen },
      { name: 'Question Papers', href: '/admin/question-papers', icon: FileQuestion },
      { name: 'Subjects', href: '/admin/subjects', icon: GraduationCap },
      { name: 'Categories', href: '/admin/categories', icon: Tag },
    ],
  },
  {
    group: 'Academic Structure',
    items: [
      { name: 'Departments', href: '/admin/departments', icon: Building2 },
      { name: 'Semesters', href: '/admin/semesters', icon: Layers },
      { name: 'Academic Years', href: '/admin/academic-years', icon: CalendarRange },
    ],
  },
  {
    group: 'Content & Campus',
    items: [
      { name: 'Comrade Dheeraj', href: '/admin/memorial', icon: Heart },
      { name: 'Events & Fests', href: '/admin/events', icon: Calendar },
      { name: 'Announcements', href: '/admin/announcements', icon: Bell },
      { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
      { name: 'Unit Members', href: '/admin/members', icon: Users },
    ],
  },
  {
    group: 'Student Welfare',
    items: [
      { name: 'Grievance Desk', href: '/admin/complaints', icon: MessageSquareWarning },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Site Settings', href: '/admin/settings', icon: Settings },
      { name: 'Admin Users', href: '/admin/users', icon: ShieldAlert },
    ],
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-red-600/30">
                SFI
              </div>
              <div>
                <h2 className="text-sm font-black text-white tracking-tight">SFI GECI CMS</h2>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  Admin Console
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Groups */}
          <div className="p-4 space-y-6 flex-1">
            {SIDEBAR_NAV.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3">
                  {group.group}
                </span>
                <div className="space-y-0.5 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800/80 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
