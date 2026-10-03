import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  FileQuestion,
  Calendar,
  Users,
  Bell,
  MessageSquareWarning,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  Download,
  GraduationCap,
  ShieldAlert,
  Flame,
  CheckCircle,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { DataService } from '@/lib/data-service';
import MaterialCard from '@/components/ui/MaterialCard';
import EventCard from '@/components/ui/EventCard';
import { formatDate } from '@/lib/utils';

export const revalidate = 60; // 1 minute ISR

export default async function HomePage() {
  const [
    latestNotes,
    latestQPs,
    upcomingEvents,
    announcements,
    stats,
    settings,
  ] = await Promise.all([
    DataService.getMaterials({ type: 'notes', limit: 4, publishedOnly: true }),
    DataService.getMaterials({ type: 'question-paper', limit: 4, publishedOnly: true }),
    DataService.getEvents(true),
    DataService.getAnnouncements(true),
    DataService.getDashboardStats(),
    DataService.getSettings(),
  ]);

  const plainNotes: any[] = JSON.parse(JSON.stringify(latestNotes || []));
  const plainQPs: any[] = JSON.parse(JSON.stringify(latestQPs || []));
  const plainEvents: any[] = JSON.parse(JSON.stringify(upcomingEvents || []));
  const plainAnnouncements: any[] = JSON.parse(JSON.stringify(announcements || []));

  const nextEvent = plainEvents.find((e) => new Date(e.eventDate) >= new Date()) || plainEvents[0];

  return (
    <div className="w-full space-y-16 pb-20">
      {/* ========================================================================= */}
      {/* HERO SECTION - REVOLUTIONARY INSPIRATION DESIGN */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#faf8f5] text-slate-900 pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-red-100/60 shadow-xs">
        {/* Top Seamless Fade to Navbar (no red line/gap) */}
        <div className="absolute top-0 left-0 right-0 h-10 sm:h-16 bg-gradient-to-b from-[#faf8f5] via-[#faf8f5]/80 to-transparent z-10 pointer-events-none" />

        {/* Faint Red Star / Hammer & Sickle Watermark in Top-Left Background */}
        <div className="absolute top-4 left-4 sm:left-10 w-44 sm:w-60 h-44 sm:h-60 opacity-[0.045] pointer-events-none text-red-700 select-none z-0">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <polygon points="50,5 61,35 95,35 68,54 78,85 50,66 22,85 32,54 5,35 39,35" />
          </svg>
        </div>

        {/* Desktop Comrade Dheeraj Right Artwork with seamless full-bleed fade */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute right-0 top-0 w-[66%] xl:w-[62%] h-full"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.8) 45%, black 65%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.8) 45%, black 65%)',
            }}
          >
            <Image
              src="/images/hero-bg.jpg"
              alt="Comrade Dheeraj Rajendran and SFI GEC Idukki Rally"
              fill
              priority
              className="object-cover object-[42%_center] translate-x-4 lg:translate-x-8"
            />
          </div>
          {/* Broad, subtle horizontal background wash to guarantee zero line */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] from-30% via-[#faf8f5]/60 via-45% to-transparent to-70%" />
          {/* Smooth vertical fade to eliminate any top red edge of the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-transparent via-15% to-[#faf8f5]/80" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          {/* Main Hero Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center pt-4 sm:pt-6">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              {/* Tagline */}
              <div className="flex items-center space-x-2.5">
                <span className="w-8 sm:w-10 h-0.5 bg-red-600 rounded-full" />
                <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.2em] uppercase text-slate-800">
                  INDEPENDENCE | DEMOCRACY | SOCIALISM
                </span>
              </div>

              {/* Big SFI GECI Title */}
              <div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none">
                  <span className="text-red-600">SFI </span>
                  <span className="text-slate-950">GECI</span>
                </h1>
                <div className="mt-3 space-y-1">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                    Students&apos; Federation of India
                  </p>
                  <p className="text-base sm:text-xl font-medium text-slate-600">
                    Government Engineering College Idukki
                  </p>
                </div>
              </div>

              {/* Mobile Dedicated Comrade Dheeraj Image Card (Optimized for Small Screens) */}
              <div className="block lg:hidden relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-red-100 my-4">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Comrade Dheeraj Rajendran - SFI GECI"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                  <span className="text-white text-xs font-bold drop-shadow-md">
                    Comrade Dheeraj Rajendran • SFI GEC Idukki
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
                For a progressive, democratic and inclusive campus. Students united for a better tomorrow.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/notes"
                  className="inline-flex items-center justify-center space-x-2.5 bg-red-700 hover:bg-red-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-red-700/25 active:scale-95 transition-all text-sm sm:text-base group"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Explore Notes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/events"
                  className="inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-red-50 text-red-700 border-2 border-red-600 font-bold px-7 py-3.5 rounded-xl active:scale-95 transition-all text-sm sm:text-base group shadow-xs"
                >
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span>View Events</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Spacer for Desktop */}
            <div className="hidden lg:block lg:col-span-5 h-full min-h-[460px]" />
          </div>

          {/* Bottom 6 Floating Feature Cards */}
          <div className="mt-12 sm:mt-16 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Card 1: Study Materials */}
              <Link
                href="/notes"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Study Materials
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Notes & QPs
                  </p>
                </div>
              </Link>

              {/* Card 2: Upcoming Events */}
              <Link
                href="/events"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Upcoming Events
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Programs & Activities
                  </p>
                </div>
              </Link>

              {/* Card 3: Unit Members */}
              <Link
                href="/members"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Unit Members
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Our Team
                  </p>
                </div>
              </Link>

              {/* Card 4: Announcements */}
              <Link
                href="/announcements"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Announcements
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Latest Updates
                  </p>
                </div>
              </Link>

              {/* Card 5: Student Support */}
              <Link
                href="/complaints"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Student Support
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Submit a Complaint
                  </p>
                </div>
              </Link>

              {/* Card 6: Gallery */}
              <Link
                href="/gallery"
                className="group bg-white/95 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/80 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    Gallery
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Moments & Memories
                  </p>
                </div>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 text-red-600">
              <div className="w-5 h-8 border-2 border-red-500 rounded-full flex items-start justify-center p-1 shadow-xs">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
              </div>
              <ChevronDown className="w-4 h-4 text-red-500 -mt-0.5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Torn Paper / Watercolor Wash Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 overflow-hidden z-10 pointer-events-none">
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-full fill-red-100/40">
            <path d="M0,30 L1200,30 L1200,12 Q1160,2 1110,16 T1020,4 T930,18 T840,6 T750,16 T660,4 T570,16 T480,4 T390,18 T300,4 T210,16 T120,4 T0,12 Z" />
          </svg>
        </div>
      </section>

      {/* Live Campus Metrics Bar */}
      <section className="container mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-lg">
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-red-600">{stats.totalNotes}+</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Study Materials</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-800">{stats.totalQuestionPapers}+</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Previous Year QPs</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-red-700">6</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">B.Tech Depts</div>
          </div>
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.totalDownloads}+</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Student Downloads</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COMRADE DHEERAJ HOMEPAGE COMMEMORATION SECTION */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-stone-200/90 p-5 sm:p-7 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative w-14 h-18 sm:w-16 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 shadow-2xs bg-stone-100">
              <Image
                src="/images/dheeraj-portrait.png"
                alt="Comrade Dheeraj Rajendran"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-red-600 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>In Memory</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Remembering Comrade Dheeraj
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                Remembering Dheeraj Rajendran, a GECI student whose life was cut short in January 2022.
              </p>
            </div>
          </div>

          <Link
            href="/comrade-dheeraj"
            className="inline-flex items-center space-x-2 text-stone-900 hover:text-red-700 bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-200 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shrink-0 self-stretch sm:self-auto justify-center group"
          >
            <span>Read Dheeraj&apos;s Story</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 30: QUICK ACCESS CARDS */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">Explore Portal</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quick Access Hub
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Direct navigation across campus resources
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {/* 1. Notes */}
          <Link
            href="/notes/notes"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-red-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
              Notes
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Unit Notes & Materials</span>
          </Link>

          {/* 2. Previous Year Question Papers */}
          <Link
            href="/notes/question-papers"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all mb-3">
              <FileQuestion className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Question Papers
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Previous University QPs</span>
          </Link>

          {/* 3. Events */}
          <Link
            href="/events"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Events
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Fests & Activities</span>
          </Link>

          {/* 4. Unit Members */}
          <Link
            href="/members"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-purple-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all mb-3">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Unit Members
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Executive Committee</span>
          </Link>

          {/* 5. Announcements */}
          <Link
            href="/announcements"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Announcements
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Circulars & Notices</span>
          </Link>

          {/* 6. Complaints */}
          <Link
            href="/complaints"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-rose-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all mb-3">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Complaints
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Confidential Grievance</span>
          </Link>

          {/* 7. Gallery */}
          <Link
            href="/gallery"
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-cyan-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              Gallery
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Campus Moments</span>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 31: LATEST NOTES */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">Fresh Material</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-red-600" />
              <span>Latest Notes</span>
            </h2>
          </div>
          <Link
            href="/notes/notes"
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>Browse All Notes</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {plainNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plainNotes.map((note) => (
              <MaterialCard key={note._id} material={note as any} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-500">
            No notes uploaded yet.
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 32: LATEST QUESTION PAPERS */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">Exam Preparation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileQuestion className="w-7 h-7 text-amber-600" />
              <span>Latest Previous Year Question Papers</span>
            </h2>
          </div>
          <Link
            href="/notes/question-papers"
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>Browse All QPs</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {plainQPs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plainQPs.map((qp) => (
              <MaterialCard key={qp._id} material={qp as any} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-500">
            No question papers uploaded yet.
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* CAMPUS HIGHLIGHTS: UPCOMING EVENTS & CIRCULARS */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">Campus Vibrancy</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Featured Events</h3>
              </div>
              <Link href="/events" className="text-xs sm:text-sm font-bold text-red-600 hover:underline">
                All Events →
              </Link>
            </div>

            {plainEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {plainEvents.slice(0, 2).map((event) => (
                  <EventCard key={event._id} event={event as any} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
                No upcoming events scheduled at the moment.
              </div>
            )}
          </div>

          {/* Announcements Ticker / Notice Board */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Alerts</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notice Board</h3>
              </div>
              <Link href="/announcements" className="text-xs sm:text-sm font-bold text-red-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 divide-y divide-slate-100 shadow-sm">
              {plainAnnouncements.length > 0 ? (
                plainAnnouncements.slice(0, 3).map((item) => (
                  <div key={item._id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.priority === 'urgent'
                            ? 'bg-red-100 text-red-700'
                            : item.priority === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2">
                      <Link href={`/announcements/${item._id}`}>{item.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.shortDescription}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  No active announcements right now.
                </div>
              )}
            </div>

            {/* Confidential Helpdesk Banner */}
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg shadow-red-600/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <MessageSquareWarning className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-black tracking-tight">Student Grievance Cell</h4>
              <p className="text-xs text-red-100 leading-relaxed">
                Facing academic, hostel, or campus infrastructure difficulties? Submit a confidential grievance with an instant reference ID.
              </p>
              <div className="pt-1">
                <Link
                  href="/complaints"
                  className="inline-block bg-white text-red-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-red-50 transition shadow-sm"
                >
                  Lodge Complaint →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
