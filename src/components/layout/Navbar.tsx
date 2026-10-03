'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Users,
  Bell,
  Image as ImageIcon,
  MessageSquareWarning,
  Phone,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Search,
} from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Com.Dheeraj', href: '/comrade-dheeraj', icon: Heart },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Notes', href: '/notes', icon: BookOpen },
  { name: 'Complaints', href: '/complaints', icon: MessageSquareWarning },
  { name: 'Announcements', href: '/announcements', icon: Bell },
  { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // If in admin layout, don't show public navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      {/* Top Sliding Announcement Bar */}
      <AnnouncementBar />

      <nav className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo with Red Star */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <svg
              className="w-9 h-9 text-red-600 fill-current drop-shadow-sm group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
              SFI GECI
            </span>
            <span className="text-[11px] text-slate-500 font-semibold tracking-tight">
              Government Engineering College Idukki
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center space-x-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 ${isActive
                    ? 'text-red-600 font-bold'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-50/80 rounded-lg'
                  }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full animate-in fade-in duration-200" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons: Search & Admin Button */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            href="/notes"
            aria-label="Search study resources"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition border border-slate-200/60"
          >
            <Search className="w-4 h-4" />
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 xl:hidden">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-1 bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg sm:hidden"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-slate-700 hover:text-red-600 hover:bg-slate-100 focus:outline-none transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                      ? 'bg-red-50 text-red-600 font-bold border-l-4 border-red-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                    }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-red-500" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href="/notes"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-red-600 text-white text-sm font-bold py-2.5 rounded-lg shadow-md shadow-red-600/20"
            >
              Browse Study Materials
            </Link>
            <Link
              href="/complaints"
              onClick={() => setIsOpen(false)}
              className="w-full text-center border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold py-2.5 rounded-lg"
            >
              Lodge Student Grievance
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
