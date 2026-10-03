import React from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/data-service';
import MemberCard from '@/components/ui/MemberCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Users, Shield, Award, Sparkles } from 'lucide-react';
import { normalizePosition } from '@/lib/member-constants';

interface Props {
  searchParams: Promise<{ year?: string }>;
}

export const revalidate = 60;

export const metadata = {
  title: 'Unit Members & Leadership | SFI GECI',
  description: 'Meet the President, Secretary, Secretariat, and Unit Members of SFI Government Engineering College Idukki unit.',
};

export default async function MembersPage({ searchParams }: Props) {
  const { year } = await searchParams;
  const [academicYears, allMembers] = await Promise.all([
    DataService.getAcademicYears(),
    DataService.getMembers(undefined, true),
  ]);

  // Ensure all members and academic years are plain serializable JSON objects (no Mongoose ObjectIds or toJSON methods)
  const plainMembers: any[] = JSON.parse(JSON.stringify(allMembers || []));
  const plainYears: any[] = JSON.parse(JSON.stringify(academicYears || []));

  // Determine selected year (default to current active year)
  const selectedYear =
    year ||
    (plainYears.find((y) => y.isCurrent)?.year || plainYears[0]?.year || '2026-27');

  const filteredMembers = plainMembers.filter((m) => m.academicYear === selectedYear);

  // Group members into exact 5 hierarchical sections
  const presidentsAndSecretaries = filteredMembers
    .filter((m) => {
      const pos = normalizePosition(m.position);
      return pos === 'President' || pos === 'Secretary';
    })
    .sort((a, b) => {
      const posA = normalizePosition(a.position);
      const posB = normalizePosition(b.position);
      if (posA === 'President' && posB !== 'President') return -1;
      if (posB === 'President' && posA !== 'President') return 1;
      return (a.order || 0) - (b.order || 0);
    });

  const vicePresidents = filteredMembers
    .filter((m) => normalizePosition(m.position) === 'Vice President')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const jointSecretaries = filteredMembers
    .filter((m) => normalizePosition(m.position) === 'Joint Secretary')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const secretariatMembers = filteredMembers
    .filter((m) => normalizePosition(m.position) === 'Secretariat Member')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const regularUnitMembers = filteredMembers
    .filter((m) => normalizePosition(m.position) === 'Unit Member')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const hasAnyMembers = filteredMembers.length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl space-y-12">
      <Breadcrumbs items={[{ label: 'Unit Committee' }]} />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Users className="w-3.5 h-3.5" />
          <span>Student Union Leadership</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          SFI GECI Unit Committee
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The democratic student leadership of Government Engineering College Idukki, elected to serve student rights, academic welfare, and progressive student unity.
        </p>
      </div>

      {/* Academic Year Filter Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-200/70 rounded-2xl gap-1 overflow-x-auto max-w-full shadow-inner">
          {academicYears.map((ay) => {
            const isActive = ay.year === selectedYear;
            return (
              <Link
                key={ay._id}
                href={`/members?year=${encodeURIComponent(ay.year)}`}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <span>Academic Year {ay.year}</span>
                {ay.isCurrent && (
                  <span className="ml-1.5 text-[10px] bg-red-800 text-white px-1.5 py-0.5 rounded-full font-bold">
                    Current
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hierarchical Members Structure */}
      {hasAnyMembers ? (
        <div className="space-y-16">
          {/* ========================================================================= */}
          {/* SECTION 1: PRESIDENT & SECRETARY — 2 LARGE CARDS                         */}
          {/* ========================================================================= */}
          {presidentsAndSecretaries.length > 0 && (
            <section className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5 shadow-2xs">
                  <Shield className="w-3.5 h-3.5 text-red-600" /> Executive Leadership
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  President & Secretary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Chief executive convenors representing the student body of GEC Idukki.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {presidentsAndSecretaries.map((member) => (
                  <MemberCard key={member._id} member={member as any} size="large" />
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: VICE PRESIDENTS & JOINT SECRETARIES — IN SAME ROW              */}
          {/* ========================================================================= */}
          {(vicePresidents.length > 0 || jointSecretaries.length > 0) && (
            <section className="space-y-6 pt-4 border-t border-slate-100">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-0.5 rounded-full border border-red-100 inline-flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-red-600" /> Executive Wing
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Vice Presidents & Joint Secretaries
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Executive coordinators supporting unit administration and student welfare.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-5 sm:gap-6 max-w-6xl mx-auto">
                {vicePresidents.map((member) => (
                  <div
                    key={member._id}
                    className="w-full sm:w-[calc(50%-0.85rem)] lg:w-[calc(25%-1.15rem)] max-w-[270px] flex"
                  >
                    <MemberCard member={member as any} size="medium" />
                  </div>
                ))}
                {jointSecretaries.map((member) => (
                  <div
                    key={member._id}
                    className="w-full sm:w-[calc(50%-0.85rem)] lg:w-[calc(25%-1.15rem)] max-w-[270px] flex"
                  >
                    <MemberCard member={member as any} size="medium" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: SECRETARIAT MEMBERS — 5 MEDIUM CARDS                          */}
          {/* ========================================================================= */}
          {secretariatMembers.length > 0 && (
            <section className="space-y-6 pt-4 border-t border-slate-100">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-0.5 rounded-full border border-red-100 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-red-600" /> Unit Secretariat
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Secretariat Members
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Key administrative council coordinating organizational campaigns and student welfare.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-5 max-w-7xl mx-auto">
                {secretariatMembers.map((member) => (
                  <div
                    key={member._id}
                    className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-0.95rem)] lg:w-[calc(20%-1rem)] max-w-[245px] flex"
                  >
                    <MemberCard member={member as any} size="medium" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: OTHER UNIT MEMBERS — SMALL CARDS                              */}
          {/* ========================================================================= */}
          {regularUnitMembers.length > 0 && (
            <section className="space-y-6 pt-4 border-t border-slate-100">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200 inline-flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-slate-600" /> Committee Representatives
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Unit Members
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dedicated batch, class, and department representatives across Government Engineering College Idukki.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {regularUnitMembers.map((member) => (
                  <MemberCard key={member._id} member={member as any} size="small" />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            No committee members listed for {selectedYear}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Data for this academic year will be added soon.
          </p>
        </div>
      )}
    </div>
  );
}
