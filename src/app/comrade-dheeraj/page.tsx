import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
  Calendar,
  GraduationCap,
  MapPin,
  Clock,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  FileText,
  Heart,
} from 'lucide-react';
import MemorialGallery from '@/components/memorial/MemorialGallery';

export const revalidate = 60; // 1 minute ISR

export async function generateMetadata() {
  const memorial = await DataService.getMemorialPage();
  return {
    title: memorial?.seoTitle || 'Comrade Dheeraj Rajendran | SFI GECI',
    description:
      memorial?.seoDescription ||
      'Remembering Dheeraj Rajendran, a seventh-semester Computer Science and Engineering student of Government Engineering College, Idukki, who died during violence surrounding the college union election in January 2022.',
  };
}

export default async function ComradeDheerajPage() {
  const memorial = (await DataService.getMemorialPage()) || {};

  return (
    <article className="w-full bg-[#fbf9f6] text-slate-900 pb-28">
      {/* Top documentary breadcrumb strip */}
      <div className="border-b border-stone-200/80 bg-white/70 backdrop-blur-xs py-3">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Breadcrumbs items={[{ label: 'Comrade Dheeraj' }]} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO / MEMORIAL COMMEMORATION SECTION */}
      {/* ========================================================================= */}
      <header className="relative overflow-hidden border-b border-stone-300/80 bg-stone-900 text-white pt-16 pb-20 sm:pb-24">
        {/* Background atmospheric image with solemn dark overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
          <Image
            src={memorial.heroImage || '/images/hero-bg.jpg'}
            alt="Comrade Dheeraj Rajendran memorial visual"
            fill
            priority
            className="object-cover object-top filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-950" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Memorial Text */}
            <div className="md:col-span-8 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-red-700 text-white text-xs font-bold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>In Solemn Remembrance</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight font-serif">
                {memorial.title || 'Comrade Dheeraj Rajendran'}
              </h1>

              <p className="text-xl sm:text-2xl text-stone-200 font-semibold tracking-normal border-l-2 border-red-600 pl-4">
                {memorial.subtitle || 'A Student. A Comrade. Remembered by GECI.'}
              </p>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal pt-2">
                {memorial.introduction ||
                  'Remembering Dheeraj Rajendran, a Computer Science and Engineering student of Government Engineering College, Idukki, whose life was cut short during violence surrounding the college union election in January 2022.'}
              </p>
            </div>

            {/* Right: Respectful Portrait Frame */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-sm overflow-hidden border-4 border-stone-800 shadow-2xl bg-stone-950">
                <Image
                  src={memorial.heroImage || '/images/hero-bg.jpg'}
                  alt="Comrade Dheeraj Rajendran"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 border border-white/10" />
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/90 text-stone-300 text-[11px] p-2 text-center font-medium border-t border-stone-800">
                  Dheeraj Rajendran (2000 – 2022)
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-16 mt-12 sm:mt-16">
        {/* ========================================================================= */}
        {/* HIS STUDENT LIFE */}
        {/* ========================================================================= */}
        <section aria-labelledby="student-life-heading" className="space-y-4">
          <div className="border-l-4 border-red-600 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">Campus Years</span>
            <h2 id="student-life-heading" className="text-2xl sm:text-3xl font-black text-stone-900">
              A Student of GECI
            </h2>
          </div>
          <div className="prose prose-stone max-w-none text-stone-700 text-base leading-relaxed space-y-4">
            <p>
              {memorial.studentLife ||
                'Dheeraj was pursuing B.Tech in Computer Science and Engineering at Government Engineering College, Idukki, and was in his seventh semester when he died.'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. WHAT HAPPENED */}
        {/* ========================================================================= */}
        <section aria-labelledby="incident-heading" className="space-y-4">
          <div className="border-l-4 border-stone-900 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Documented Incident</span>
            <h2 id="incident-heading" className="text-2xl sm:text-3xl font-black text-stone-900">
              10 January 2022
            </h2>
          </div>
          <div className="prose prose-stone max-w-none text-stone-700 text-base leading-relaxed bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <p>
              {memorial.incident ||
                'On 10 January 2022, violence broke out around the student union election at Government Engineering College, Idukki. Dheeraj Rajendran, a 21-year-old seventh-semester Computer Science and Engineering student and SFI activist, was fatally stabbed during the confrontation. Two other SFI members were also injured.'}
            </p>
            <p className="text-xs text-stone-500 italic">
              Contemporary reports stated that the clash occurred in connection with the college union election.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. THE CASE / POLICE PROCEEDINGS */}
        {/* ========================================================================= */}
        <section aria-labelledby="case-heading" className="space-y-4">
          <div className="border-l-4 border-stone-500 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Legal Proceedings</span>
            <h2 id="case-heading" className="text-2xl sm:text-3xl font-black text-stone-900">
              The Case
            </h2>
          </div>
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 sm:p-7 space-y-4 text-stone-700 text-base leading-relaxed">
            <p>
              {memorial.caseInformation ||
                'Contemporary reports stated that Dheeraj was allegedly stabbed by Nikhil Paily, a Youth Congress functionary. Police arrested Paily and other individuals in connection with the case. Reports described the incident as occurring during clashes involving SFI and KSU/Youth Congress activists around the college union election.'}
            </p>
            <div className="text-xs text-stone-500 space-y-1 border-t border-stone-200 pt-3">
              <p>• Contemporary reporting confirms that Paily was arrested and that additional people were arrested in the case.</p>
              <p>• The legal process continues under the jurisdiction of the competent courts.</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. VISUAL TIMELINE */}
        {/* ========================================================================= */}
        <section aria-labelledby="timeline-heading" className="space-y-6">
          <div className="border-l-4 border-red-600 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">Chronology</span>
            <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-black text-stone-900">
              Timeline of Events
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-300 space-y-8 my-6">
            {memorial.timeline && memorial.timeline.length > 0 ? (
              memorial.timeline.map((item: any, idx: number) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-xs" />
                  <div className="space-y-1">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-0.5 rounded">
                      {item.date}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 pt-1">{item.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Timeline events will appear here.</p>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. DHEERAJ'S FINAL DAYS AT GECI */}
        {/* ========================================================================= */}
        <section aria-labelledby="final-days-heading" className="space-y-4">
          <div className="border-l-4 border-stone-700 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Circumstances</span>
            <h2 id="final-days-heading" className="text-2xl sm:text-3xl font-black text-stone-900">
              Hospitalization &amp; Final Hours
            </h2>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-7 shadow-xs text-stone-700 text-base leading-relaxed space-y-3">
            <p>
              {memorial.finalDays ||
                'Dheeraj was taken to the Government Medical College Hospital, Idukki, after sustaining serious injuries, but he could not be saved.'}
            </p>
            <p className="text-xs text-stone-500 italic">
              Contemporary reporting stated that the postmortem identified a deep stab wound to the heart as the cause of death.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. REMEMBRANCE */}
        {/* ========================================================================= */}
        <section aria-labelledby="remembrance-heading" className="space-y-4 bg-stone-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-current" />
            <span>Legacy of Peace &amp; Democratic Rights</span>
          </div>
          <h2 id="remembrance-heading" className="text-2xl sm:text-3xl font-black text-white font-serif">
            Remembering Dheeraj
          </h2>
          <div className="text-stone-300 text-base leading-relaxed space-y-4 max-w-3xl">
            <p>
              {memorial.remembrance ||
                'Dheeraj\'s death left a lasting mark on the student community at GECI and across Kerala. His name continues to be remembered by students, friends and members of the SFI community.'}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. MEMORIES OF DHEERAJ (VISUAL ARCHIVES: PHOTOS, POSTERS & VIDEOS) */}
        {/* ========================================================================= */}
        <section aria-labelledby="memories-heading">
          <MemorialGallery items={memorial.gallery || []} />
        </section>

        {/* ========================================================================= */}
        {/* 10. SOURCES & REFERENCES */}
        {/* ========================================================================= */}
        <section aria-labelledby="sources-heading" className="space-y-4 pt-6 border-t border-stone-300">
          <div className="border-l-4 border-stone-400 pl-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Verification</span>
            <h2 id="sources-heading" className="text-2xl font-black text-stone-900">
              Sources &amp; References
            </h2>
            <p className="text-xs text-stone-500">
              Attributed reporting from established news organizations and contemporaneous public records
            </p>
          </div>

          <div className="space-y-3">
            {memorial.sources && memorial.sources.length > 0 ? (
              memorial.sources.map((src: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg border border-stone-200/90 shadow-2xs hover:border-stone-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        {src.publisher}
                      </span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-500">{src.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 pt-1">{src.title}</h3>
                    {src.description && <p className="text-xs text-stone-600">{src.description}</p>}
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 hover:text-red-800 bg-stone-50 hover:bg-red-50 border border-stone-200 px-3 py-1.5 rounded transition shrink-0 self-start sm:self-center"
                  >
                    <span>Read Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500">No references added yet.</p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
