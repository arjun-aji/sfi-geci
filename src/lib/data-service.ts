import mongoose from 'mongoose';
import { connectDB } from './db';
import { User, IUser } from '../models/User';
import { Department, IDepartment } from '../models/Department';
import { Semester, ISemester } from '../models/Semester';
import { Subject, ISubject } from '../models/Subject';
import { AcademicYear, IAcademicYear } from '../models/AcademicYear';
import { Material, IMaterial } from '../models/Material';
import { Category, ICategory } from '../models/Category';
import { Event, IEvent } from '../models/Event';
import { UnitMember, IUnitMember, normalizePosition } from '../models/UnitMember';
import { Announcement, IAnnouncement } from '../models/Announcement';
import { GalleryAlbum, IGalleryAlbum } from '../models/GalleryAlbum';
import { ComplaintCategory, IComplaintCategory } from '../models/ComplaintCategory';
import { Complaint, IComplaint } from '../models/Complaint';
import { SiteSettings, ISiteSettings } from '../models/SiteSettings';
import MemorialPage, { IMemorialPage } from '../models/MemorialPage';
import { hashPassword } from './auth';

import {
  INITIAL_DEPARTMENTS,
  INITIAL_SEMESTERS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CATEGORIES,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_EVENTS,
  INITIAL_MEMBERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_COMPLAINT_CATEGORIES,
  INITIAL_COMPLAINTS,
} from './seed-data';

// In-Memory fallback store for environments where MongoDB is unreachable or pending Atlas setup
interface MemoryStore {
  users: Array<any>;
  departments: Array<any>;
  semesters: Array<any>;
  subjects: Array<any>;
  academicYears: Array<any>;
  materials: Array<any>;
  categories: Array<any>;
  events: Array<any>;
  members: Array<any>;
  announcements: Array<any>;
  gallery: Array<any>;
  complaintCategories: Array<any>;
  complaints: Array<any>;
  settings: any;
  memorial: any;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStore: MemoryStore | undefined;
}

const OFFICIAL_UNIT_MEMBERS = [
  // 2026-27 (Current Academic Year)
  { _id: 'mem_26_1', name: 'Akash Ashok', position: 'President', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '+91 92078 81324', photoUrl: '', bio: '', email: '', order: 1, isActive: true },
  { _id: 'mem_26_2', name: 'Sooraj Sudhevan', position: 'Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '+91 92072 94158', photoUrl: '', bio: '', email: '', order: 2, isActive: true },
  { _id: 'mem_26_3', name: 'Abhinav', position: 'Vice President', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 3, isActive: true },
  { _id: 'mem_26_4', name: 'Saffa', position: 'Vice President', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 4, isActive: true },
  { _id: 'mem_26_5', name: 'Abhijith', position: 'Joint Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 5, isActive: true },
  { _id: 'mem_26_6', name: 'Adwaith', position: 'Joint Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 6, isActive: true },
  { _id: 'mem_26_7', name: 'Abhinav K', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 7, isActive: true },
  { _id: 'mem_26_8', name: 'Riza', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 8, isActive: true },
  { _id: 'mem_26_9', name: 'Akshay Ramakrishnan', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 9, isActive: true },
  { _id: 'mem_26_10', name: 'Abhinav k', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 10, isActive: true },
  { _id: 'mem_26_11', name: 'Akshay', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 11, isActive: true },
  { _id: 'mem_26_12', name: 'Riza', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 12, isActive: true },
  { _id: 'mem_26_13', name: 'Athul Krishna T B', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 13, isActive: true },
  { _id: 'mem_26_14', name: 'Nikhil', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 14, isActive: true },
  { _id: 'mem_26_15', name: 'Abhijith', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 15, isActive: true },
  { _id: 'mem_26_16', name: 'Adithya', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 16, isActive: true },
  { _id: 'mem_26_17', name: 'Savad', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 17, isActive: true },
  { _id: 'mem_26_18', name: 'Athul Krishna R', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 18, isActive: true },
  { _id: 'mem_26_19', name: 'Theertha', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 19, isActive: true },
  { _id: 'mem_26_20', name: 'Krishnaprasad', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 20, isActive: true },
  { _id: 'mem_26_21', name: 'Akhina Kishor', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 21, isActive: true },
  { _id: 'mem_26_22', name: 'Saptha', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 22, isActive: true },
  { _id: 'mem_26_23', name: 'Akshaya', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 23, isActive: true },
  { _id: 'mem_26_24', name: 'Abhi', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 24, isActive: true },
  { _id: 'mem_26_25', name: 'Alogh', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 25, isActive: true },
  { _id: 'mem_26_26', name: 'Adithya A', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 26, isActive: true },
  { _id: 'mem_26_27', name: 'Siddarth', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 27, isActive: true },
  { _id: 'mem_26_28', name: 'Aravindh', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 28, isActive: true },
  { _id: 'mem_26_29', name: 'Abhinandh', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 29, isActive: true },
  { _id: 'mem_26_30', name: 'Alanadh', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 30, isActive: true },
  { _id: 'mem_26_31', name: 'Sadasiva', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 31, isActive: true },
  { _id: 'mem_26_32', name: 'Adwaith', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2026-27', phone: '', photoUrl: '', bio: '', email: '', order: 32, isActive: true },

  // 2025-26 Academic Year
  { _id: 'mem_25_1', name: 'Harigovind K', position: 'President', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 33, isActive: true },
  { _id: 'mem_25_2', name: 'Abhinand C M', position: 'Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 34, isActive: true },
  { _id: 'mem_25_3', name: 'Arya Suresh', position: 'Vice President', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 35, isActive: true },
  { _id: 'mem_25_4', name: 'Abhinav S', position: 'Vice President', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 36, isActive: true },
  { _id: 'mem_25_5', name: 'Lenin T K', position: 'Joint Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 37, isActive: true },
  { _id: 'mem_25_6', name: 'Athul Krishna', position: 'Joint Secretary', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 38, isActive: true },
  { _id: 'mem_25_7', name: 'Abhinav K Balan', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 39, isActive: true },
  { _id: 'mem_25_8', name: 'Yaseen K P', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 40, isActive: true },
  { _id: 'mem_25_9', name: 'Amarnadh', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 41, isActive: true },
  { _id: 'mem_25_10', name: 'Sooraj S', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 42, isActive: true },
  { _id: 'mem_25_11', name: 'Abhijith K', position: 'Secretariat Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 43, isActive: true },
  { _id: 'mem_25_12', name: 'Nihal Udhay', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 44, isActive: true },
  { _id: 'mem_25_13', name: 'Vyshakh T P', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 45, isActive: true },
  { _id: 'mem_25_14', name: 'Arjun Aji', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 46, isActive: true },
  { _id: 'mem_25_15', name: 'Dhron M', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 47, isActive: true },
  { _id: 'mem_25_16', name: 'Jithin B', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 48, isActive: true },
  { _id: 'mem_25_17', name: 'Jishnu K', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 49, isActive: true },
  { _id: 'mem_25_18', name: 'Adithyan V', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 50, isActive: true },
  { _id: 'mem_25_19', name: 'Rahul M S', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 51, isActive: true },
  { _id: 'mem_25_20', name: 'Athul Krishna R', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 52, isActive: true },
  { _id: 'mem_25_21', name: 'Adithya A', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 53, isActive: true },
  { _id: 'mem_25_22', name: 'Krishnaraj M T', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 54, isActive: true },
  { _id: 'mem_25_23', name: 'Aparna G B', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 55, isActive: true },
  { _id: 'mem_25_24', name: 'Angel Rose Shaji', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 56, isActive: true },
  { _id: 'mem_25_25', name: 'Vishwanath B', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 57, isActive: true },
  { _id: 'mem_25_26', name: 'Manjari Sajith', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 58, isActive: true },
  { _id: 'mem_25_27', name: 'Rajul S R', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 59, isActive: true },
  { _id: 'mem_25_28', name: 'Anjush Praveen', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 60, isActive: true },
  { _id: 'mem_25_29', name: 'Saffa Meera', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 61, isActive: true },
  { _id: 'mem_25_30', name: 'Adwaith R', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 62, isActive: true },
  { _id: 'mem_25_31', name: 'Krishna Prasad K K', position: 'Unit Member', department: 'GECI', semester: 'UNIT', academicYear: '2025-26', phone: '', photoUrl: '', bio: '', email: '', order: 63, isActive: true },
];

function initMemoryStore(): MemoryStore {
  const now = new Date();
  return {
    users: [
      {
        _id: 'usr_admin_1',
        name: 'SFI Admin',
        email: 'admin@sfigeci.org',
        // pre-hashed for 'SfiGeci@2026!'
        passwordHash: '$2b$10$8o6dM9JQUU3t4hgjsguqp.iQkoJ7iRNklQlHbGdQULIuthJjRkCZO',
        role: 'superadmin',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    departments: INITIAL_DEPARTMENTS.map((d, i) => ({
      ...d,
      _id: `dept_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    semesters: INITIAL_SEMESTERS.map((s, i) => ({
      ...s,
      _id: `sem_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    subjects: INITIAL_SUBJECTS.map((sub, i) => ({
      ...sub,
      isActive: true,
      _id: `sub_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    academicYears: INITIAL_ACADEMIC_YEARS.map((y, i) => ({
      ...y,
      _id: `ay_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    materials: [],
    categories: INITIAL_CATEGORIES.map((c, i) => ({
      ...c,
      type: c.type as 'notes' | 'question-paper',
      _id: `cat_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    events: [],
    members: [...OFFICIAL_UNIT_MEMBERS],
    announcements: INITIAL_ANNOUNCEMENTS.map((a, i) => ({
      ...a,
      _id: `ann_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    gallery: [],
    complaintCategories: INITIAL_COMPLAINT_CATEGORIES.map((cc, i) => ({
      ...cc,
      isActive: true,
      _id: `cc_${i + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    complaints: [],
    settings: {
      _id: 'settings_default',
      websiteName: 'SFI GECI',
      tagline: "Students' Federation of India - Government Engineering College Idukki",
      heroTitle: 'STUDY & STRUGGLE',
      heroSubtitle: 'Official digital portal and academic resource sanctuary of SFI Government Engineering College Idukki Unit.',
      announcementTicker: 'Welcome to SFI GECI Portal • KTU B.Tech Notes & Previous Question Papers Repository now updated!',
      contactEmail: 'sfigecidukkiunit@gmail.com',
      phone: '+91 92078 81324',
      address: 'Government Engineering College Idukki, Painavu, Idukki, Kerala 685603',
      instagramUrl: 'https://www.instagram.com/sfigeci?stkn=eGpvMTR5NGcycWw2',
      facebookUrl: 'https://www.facebook.com/share/19TYtp22RP/?mibextid=wwXIfr',
      whatsappUrl: 'https://whatsapp.com/channel/0029VaWgEOBC1Fu36Tlm0L0Q',
      youtubeUrl: 'https://youtube.com/@sfigeci',
      footerText: "Students' Federation of India - GEC Idukki Unit. Independence, Democracy, Socialism.",
      aboutText: "SFI GECI represents the vibrant student community of Government Engineering College Idukki, standing steadfast for student rights, progressive education, and holistic academic welfare.",
      updatedAt: now,
    },
    memorial: {
      _id: 'memorial_dheeraj',
      title: 'Comrade Dheeraj Rajendran',
      slug: 'comrade-dheeraj',
      subtitle: 'A Student. A Comrade. Remembered by GECI.',
      heroImage: '/images/dheeraj-portrait.png',
      introduction:
        'Remembering Dheeraj Rajendran, a Computer Science and Engineering student of Government Engineering College, Idukki, whose life was cut short during violence surrounding the college union election in January 2022.',
      keyFacts: {
        age: '21',
        college: 'Government Engineering College, Idukki',
        course: 'B.Tech',
        department: 'Computer Science and Engineering',
        semester: 'Seventh semester',
        from: 'Palakkulangara, near Taliparamba, Kannur',
        dateOfDeath: '10 January 2022',
      },
      studentLife:
        'Dheeraj was pursuing his B.Tech in Computer Science and Engineering at Government Engineering College, Idukki, and was in his seventh semester when he died. Residing and studying in Painavu, he was an active member of the campus community and a student activist affiliated with the Students\' Federation of India (SFI).',
      incident:
        'On 10 January 2022, violence broke out around the student union election at Government Engineering College, Idukki. Dheeraj Rajendran, a 21-year-old seventh-semester Computer Science and Engineering student and SFI activist, was fatally stabbed during the confrontation. Two other SFI members were also injured in the clash.',
      caseInformation:
        'Contemporary reports stated that Dheeraj was allegedly stabbed by Nikhil Paily, a Youth Congress functionary. Police arrested Paily and other individuals in connection with the case. Reports described the incident as occurring during clashes involving SFI and KSU/Youth Congress activists around the college union election. The police subsequently filed charges and legal proceedings were initiated in designated courts.',
      finalDays:
        'Following the confrontation outside the campus gate during election voting hours, Dheeraj was rushed immediately to the Government Medical College Hospital, Idukki, after sustaining serious injuries. Despite emergency medical interventions by attending doctors, he could not be saved. Contemporary reporting indicated that the postmortem identified a deep stab wound to the chest area as the fatal cause.',
      remembrance:
        'Dheeraj\'s death left a lasting mark on the student community at GECI and across Kerala. His name continues to be remembered by students, friends, and members of the SFI community. The campus community commemorates his memory as an enduring reminder of democratic student rights, mutual dignity, and peace in academic environments.',
      timeline: [
        {
          date: '2022 — College Union Election',
          title: 'Election Day Tensions',
          description: 'Election-related tensions and a clash were reported at Government Engineering College, Idukki.',
        },
        {
          date: '10 January 2022',
          title: 'Fatal Confrontation',
          description: 'Dheeraj Rajendran was fatally stabbed during the confrontation near the college gate.',
        },
        {
          date: '10 January 2022 — Later',
          title: 'Police Arrest Functionary',
          description: 'Police arrested a Youth Congress functionary in connection with the case.',
        },
        {
          date: 'Following Days',
          title: 'Ongoing Investigation',
          description: 'The case continued to be investigated, with additional arrests and formal charge-sheets reported.',
        },
      ],
      gallery: [
        {
          imageUrl: '/images/dheeraj-portrait.png',
          caption: 'Comrade Dheeraj Rajendran — B.Tech Computer Science and Engineering student, GEC Idukki.',
          date: 'Pre-2022',
          source: 'College & Family Archive',
          altText: 'Portrait of Comrade Dheeraj Rajendran',
        },
        {
          imageUrl: '/images/hero-bg.jpg',
          caption: 'Comrade Dheeraj remembered with the students of GEC Idukki and the hills of Painavu.',
          date: 'January 2022',
          source: 'SFI GECI Archive',
          altText: 'Comrade Dheeraj Rajendran memorial tribute visual',
        },
      ],
      sources: [
        {
          title: 'SFI activist stabbed to death in Kerala college union election clash',
          publisher: 'The Hindu',
          date: '10 January 2022',
          url: 'https://www.thehindu.com/news/national/kerala/sfi-activist-stabbed-to-death-in-idukki-engineering-college/article38217354.ece',
          description: 'Contemporary news report detailing the election clash outside GEC Idukki and the death of Dheeraj Rajendran.',
        },
        {
          title: 'Youth Congress leader arrested over murder of SFI activist Dheeraj in Idukki',
          publisher: 'The News Minute',
          date: '11 January 2022',
          url: 'https://www.thenewsminute.com/kerala/youth-congress-leader-arrested-over-murder-sfi-activist-dheeraj-idukki-159676',
          description: 'Reporting on the initial police investigation, detention, and subsequent legal custody.',
        },
        {
          title: 'GEC Idukki Union Election Clashes: Police Investigation and Charge-sheet',
          publisher: 'Mathrubhumi News',
          date: '12 January 2022',
          url: 'https://english.mathrubhumi.com/news/kerala/dheeraj-murder-case-police-investigation-1.6353270',
          description: 'Coverage of witness statements, postmortem findings, and proceedings of the investigating team.',
        },
      ],
      seoTitle: 'Comrade Dheeraj Rajendran | SFI GECI',
      seoDescription:
        'Remembering Dheeraj Rajendran, a seventh-semester Computer Science and Engineering student of Government Engineering College, Idukki, who died during violence surrounding the college union election in January 2022.',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
  };
}

if (!global.memoryStore) {
  global.memoryStore = initMemoryStore();
} else {
  if (!global.memoryStore.memorial) {
    global.memoryStore.memorial = initMemoryStore().memorial;
  }
  // Ensure default superadmin is always available and active
  if (!global.memoryStore.users || global.memoryStore.users.length === 0) {
    global.memoryStore.users = initMemoryStore().users;
  } else {
    const adminIdx = global.memoryStore.users.findIndex((u: any) => u.email === 'admin@sfigeci.org');
    if (adminIdx === -1) {
      global.memoryStore.users.unshift(initMemoryStore().users[0]);
    } else {
      global.memoryStore.users[adminIdx].passwordHash = '$2b$10$8o6dM9JQUU3t4hgjsguqp.iQkoJ7iRNklQlHbGdQULIuthJjRkCZO';
      global.memoryStore.users[adminIdx].isActive = true;
    }
  }
}

const memoryStore = global.memoryStore;

// Seed MongoDB if empty
export async function seedDatabase(force = false) {
  const db = await connectDB();
  if (!db) {
    console.log('MongoDB not connected; using in-memory store.');
    return { success: true, mode: 'memory' };
  }

  const deptCount = await Department.countDocuments();
  if (deptCount > 0 && !force) {
    return { success: true, message: 'Database already populated' };
  }

  console.log('Seeding MongoDB with initial SFI GECI dataset...');

  // Superadmin
  const existingAdmin = await User.findOne({ email: 'admin@sfigeci.org' });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('SfiGeci@2026!');
    await User.create({
      name: 'SFI GECI Super Admin',
      email: 'admin@sfigeci.org',
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });
  }

  if (deptCount === 0 || force) {
    await Department.deleteMany({});
    await Department.insertMany(INITIAL_DEPARTMENTS);

    await Semester.deleteMany({});
    await Semester.insertMany(INITIAL_SEMESTERS);

    await AcademicYear.deleteMany({});
    await AcademicYear.insertMany(INITIAL_ACADEMIC_YEARS);

    await Category.deleteMany({});
    await Category.insertMany(INITIAL_CATEGORIES);

    await Subject.deleteMany({});
    await Subject.insertMany(INITIAL_SUBJECTS);

    await ComplaintCategory.deleteMany({});
    await ComplaintCategory.insertMany(INITIAL_COMPLAINT_CATEGORIES);

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      const { _id: _sId, ...settingsData } = memoryStore.settings || {};
      await SiteSettings.create(settingsData);
    }

    const memorialCount = await MemorialPage.countDocuments();
    if (memorialCount === 0) {
      const { _id: _mId, ...memorialData } = memoryStore.memorial || {};
      await MemorialPage.create(memorialData);
    }
  }

  return { success: true, message: 'Database successfully seeded' };
}

// -------------------------------------------------------------
function toPlain<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}

export const DataService = {
  // Departments
  async getDepartments(activeOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter = activeOnly ? { isActive: true } : {};
      const res = await Department.find(filter).sort({ order: 1 }).lean();
      return toPlain(res);
    }
    return memoryStore.departments
      .filter((d) => !activeOnly || d.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async getDepartmentByCode(code: string) {
    const db = await connectDB();
    if (db) {
      return await Department.findOne({ code: code.toUpperCase() }).lean();
    }
    return (
      memoryStore.departments.find(
        (d) => d.code?.toUpperCase() === code.toUpperCase()
      ) || null
    );
  },

  async saveDepartment(data: Partial<IDepartment>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Department.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Department.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.departments.findIndex((d) => d._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.departments[idx] = { ...memoryStore.departments[idx], ...data, updatedAt: now };
        return memoryStore.departments[idx];
      }
    }
    const newDept = { ...data, _id: `dept_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.departments.push(newDept);
    return newDept;
  },

  async deleteDepartment(id: string) {
    const db = await connectDB();
    if (db) {
      return await Department.findByIdAndDelete(id);
    }
    const idx = memoryStore.departments.findIndex((d) => d._id === id);
    if (idx !== -1) memoryStore.departments.splice(idx, 1);
    return true;
  },

  // Semesters
  async getSemesters(activeOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter = activeOnly ? { isActive: true } : {};
      return await Semester.find(filter).sort({ order: 1 }).lean();
    }
    return memoryStore.semesters
      .filter((s) => !activeOnly || s.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async saveSemester(data: Partial<ISemester>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Semester.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Semester.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.semesters.findIndex((s) => s._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.semesters[idx] = { ...memoryStore.semesters[idx], ...data, updatedAt: now };
        return memoryStore.semesters[idx];
      }
    }
    const newSem = { ...data, _id: `sem_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.semesters.push(newSem);
    return newSem;
  },

  async deleteSemester(id: string) {
    const db = await connectDB();
    if (db) {
      return await Semester.findByIdAndDelete(id);
    }
    const idx = memoryStore.semesters.findIndex((s) => s._id === id);
    if (idx !== -1) memoryStore.semesters.splice(idx, 1);
    return true;
  },

  // Subjects
  async getSubjects(department?: string, semester?: string, activeOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter: any = {};
      if (department) filter.department = department.toUpperCase();
      if (semester) filter.semester = semester.toUpperCase();
      if (activeOnly) filter.isActive = true;
      return await Subject.find(filter).sort({ code: 1 }).lean();
    }
    return memoryStore.subjects.filter((s) => {
      if (activeOnly && !s.isActive) return false;
      if (department && s.department?.toUpperCase() !== department.toUpperCase()) return false;
      if (semester && s.semester?.toUpperCase() !== semester.toUpperCase()) return false;
      return true;
    });
  },

  async saveSubject(data: Partial<ISubject>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Subject.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Subject.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.subjects.findIndex((s) => s._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.subjects[idx] = { ...memoryStore.subjects[idx], ...data, updatedAt: now };
        return memoryStore.subjects[idx];
      }
    }
    const newSub = { ...data, _id: `sub_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.subjects.push(newSub);
    return newSub;
  },

  async deleteSubject(id: string) {
    const db = await connectDB();
    if (db) {
      return await Subject.findByIdAndDelete(id);
    }
    const idx = memoryStore.subjects.findIndex((s) => s._id === id);
    if (idx !== -1) memoryStore.subjects.splice(idx, 1);
    return true;
  },

  // Materials (Notes & Question Papers)
  async getMaterials(query: {
    type?: 'notes' | 'question-paper';
    department?: string;
    semester?: string;
    subject?: string;
    category?: string;
    search?: string;
    publishedOnly?: boolean;
    limit?: number;
  }) {
    const db = await connectDB();
    if (db) {
      const filter: any = {};
      if (query.type) filter.type = query.type;
      if (query.department) filter.department = query.department.toUpperCase();
      if (query.semester) filter.semester = query.semester.toUpperCase();
      if (query.subject) filter.subject = new RegExp(`^${query.subject}$`, 'i');
      if (query.category) filter.category = query.category;
      if (query.publishedOnly !== false) filter.isPublished = true;
      if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [{ title: regex }, { subject: regex }, { description: regex }];
      }

      let q = Material.find(filter).sort(
        query.type === 'notes' ? { unitNumber: 1, createdAt: -1 } : { examYear: -1, createdAt: -1 }
      );
      if (query.limit) q = q.limit(query.limit);
      return await q.lean();
    }

    // In-memory filter
    let items = memoryStore.materials.filter((m) => {
      if (query.publishedOnly !== false && !m.isPublished) return false;
      if (query.type && m.type !== query.type) return false;
      if (query.department && m.department?.toUpperCase() !== query.department.toUpperCase()) return false;
      if (query.semester && m.semester?.toUpperCase() !== query.semester.toUpperCase()) return false;
      if (query.subject && m.subject?.toLowerCase() !== query.subject.toLowerCase()) return false;
      if (query.category && m.category !== query.category) return false;
      if (query.search) {
        const s = query.search.toLowerCase();
        const matches =
          m.title?.toLowerCase().includes(s) ||
          m.subject?.toLowerCase().includes(s) ||
          m.description?.toLowerCase().includes(s);
        if (!matches) return false;
      }
      return true;
    });

    items.sort((a, b) => {
      if (query.type === 'notes') {
        return (a.unitNumber || 0) - (b.unitNumber || 0);
      }
      return (b.examYear || 0) - (a.examYear || 0);
    });

    if (query.limit) items = items.slice(0, query.limit);
    return items;
  },

  async getMaterialById(id: string) {
    const db = await connectDB();
    if (db) {
      return await Material.findById(id).lean();
    }
    return memoryStore.materials.find((m) => m._id === id) || null;
  },

  async saveMaterial(data: Partial<IMaterial>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Material.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Material.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.materials.findIndex((m) => m._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.materials[idx] = { ...memoryStore.materials[idx], ...data, updatedAt: now };
        return memoryStore.materials[idx];
      }
    }
    const newMat = {
      ...data,
      _id: `mat_${Date.now()}`,
      downloadCount: 0,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: now,
      updatedAt: now,
    } as any;
    memoryStore.materials.push(newMat);
    return newMat;
  },

  async deleteMaterial(id: string) {
    const db = await connectDB();
    if (db) {
      return await Material.findByIdAndDelete(id);
    }
    const idx = memoryStore.materials.findIndex((m) => m._id === id);
    if (idx !== -1) memoryStore.materials.splice(idx, 1);
    return true;
  },

  async incrementMaterialDownload(id: string) {
    const db = await connectDB();
    if (db) {
      return await Material.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });
    }
    const item = memoryStore.materials.find((m) => m._id === id);
    if (item) {
      item.downloadCount = (item.downloadCount || 0) + 1;
      return item;
    }
    return null;
  },

  // Events
  async getEvents(publishedOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter = publishedOnly ? { isPublished: true } : {};
      return await Event.find(filter).sort({ eventDate: 1 }).lean();
    }
    return memoryStore.events
      .filter((e) => !publishedOnly || e.isPublished)
      .sort((a, b) => new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime());
  },

  async getEventBySlug(slug: string) {
    const db = await connectDB();
    if (db) {
      return await Event.findOne({ slug }).lean();
    }
    return memoryStore.events.find((e) => e.slug === slug) || null;
  },

  async saveEvent(data: Partial<IEvent>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Event.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Event.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.events.findIndex((e) => e._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.events[idx] = { ...memoryStore.events[idx], ...data, updatedAt: now };
        return memoryStore.events[idx];
      }
    }
    const newEvt = { ...data, _id: `evt_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.events.push(newEvt);
    return newEvt;
  },

  async deleteEvent(id: string) {
    const db = await connectDB();
    if (db) {
      return await Event.findByIdAndDelete(id);
    }
    const idx = memoryStore.events.findIndex((e) => e._id === id);
    if (idx !== -1) memoryStore.events.splice(idx, 1);
    return true;
  },

  // Unit Members
  async getMembers(academicYear?: string, activeOnly = true) {
    const POSITION_RANKS: Record<string, number> = {
      'President': 1,
      'Secretary': 2,
      'Vice President': 3,
      'Joint Secretary': 4,
      'Secretariat Member': 5,
      'Unit Member': 6,
    };

    const sortMembers = (a: any, b: any) => {
      const posA = normalizePosition(a.position);
      const posB = normalizePosition(b.position);
      const rankA = POSITION_RANKS[posA] || 99;
      const rankB = POSITION_RANKS[posB] || 99;
      if (rankA !== rankB) return rankA - rankB;
      const orderA = typeof a.order === 'number' ? a.order : 0;
      const orderB = typeof b.order === 'number' ? b.order : 0;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    };

    const db = await connectDB();
    if (db) {
      const filter: any = {};
      if (academicYear) filter.academicYear = academicYear;
      if (activeOnly) filter.isActive = true;
      const list = await UnitMember.find(filter).lean();
      return toPlain((list as any[]).sort(sortMembers));
    }
    return toPlain(
      memoryStore.members
        .filter((m) => {
          if (activeOnly && !m.isActive) return false;
          if (academicYear && m.academicYear !== academicYear) return false;
          return true;
        })
        .sort(sortMembers)
    );
  },

  async saveMember(data: Partial<IUnitMember>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await UnitMember.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await UnitMember.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.members.findIndex((m) => m._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.members[idx] = { ...memoryStore.members[idx], ...data, updatedAt: now };
        return memoryStore.members[idx];
      }
    }
    const newMem = { ...data, _id: `mem_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.members.push(newMem);
    return newMem;
  },

  async deleteMember(id: string) {
    const db = await connectDB();
    if (db) {
      return await UnitMember.findByIdAndDelete(id);
    }
    const idx = memoryStore.members.findIndex((m) => m._id === id);
    if (idx !== -1) memoryStore.members.splice(idx, 1);
    return true;
  },

  // Announcements
  async getAnnouncements(publishedOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter = publishedOnly ? { isPublished: true } : {};
      const res = await Announcement.find(filter).sort({ publishedAt: -1 }).lean();
      return toPlain(res);
    }
    return toPlain(
      memoryStore.announcements
        .filter((a) => !publishedOnly || a.isPublished)
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    );
  },

  async getAnnouncementById(id: string) {
    const db = await connectDB();
    if (db) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const item = await Announcement.findById(id).lean();
          if (item) return toPlain(item);
        }
        const item = await Announcement.findOne({ _id: id }).lean();
        if (item) return toPlain(item);
      } catch (e) {
        console.error('Error fetching announcement by ID:', e);
      }
    }
    const item = memoryStore.announcements.find((a) => String(a._id) === String(id)) || null;
    return toPlain(item);
  },

  async saveAnnouncement(data: Partial<IAnnouncement>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Announcement.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Announcement.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.announcements.findIndex((a) => String(a._id) === String((data as any)._id));
      if (idx !== -1) {
        memoryStore.announcements[idx] = { ...memoryStore.announcements[idx], ...data, updatedAt: now };
        return memoryStore.announcements[idx];
      }
    }
    const newAnn = { ...data, _id: `ann_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.announcements.push(newAnn);
    return newAnn;
  },

  async deleteAnnouncement(id: string) {
    const db = await connectDB();
    if (db) {
      return await Announcement.findByIdAndDelete(id);
    }
    const idx = memoryStore.announcements.findIndex((a) => String(a._id) === String(id));
    if (idx !== -1) memoryStore.announcements.splice(idx, 1);
    return true;
  },

  // Gallery
  async getGalleryAlbums(publishedOnly = true) {
    const db = await connectDB();
    if (db) {
      const filter = publishedOnly ? { isPublished: true } : {};
      const res = await GalleryAlbum.find(filter).sort({ date: -1 }).lean();
      return toPlain(res);
    }
    return toPlain(
      memoryStore.gallery
        .filter((g) => !publishedOnly || g.isPublished)
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    );
  },

  async getGalleryAlbumById(id: string) {
    const db = await connectDB();
    if (db) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const item = await GalleryAlbum.findById(id).lean();
          if (item) return toPlain(item);
        }
        const item = await GalleryAlbum.findOne({ _id: id }).lean();
        if (item) return toPlain(item);
      } catch (e) {
        console.error('Error fetching gallery album by ID:', e);
      }
    }
    const item = memoryStore.gallery.find((g) => String(g._id) === String(id)) || null;
    return toPlain(item);
  },

  async saveGalleryAlbum(data: Partial<IGalleryAlbum>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await GalleryAlbum.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await GalleryAlbum.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.gallery.findIndex((g) => String(g._id) === String((data as any)._id));
      if (idx !== -1) {
        memoryStore.gallery[idx] = { ...memoryStore.gallery[idx], ...data, updatedAt: now };
        return memoryStore.gallery[idx];
      }
    }
    const newGal = { ...data, _id: `gal_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.gallery.push(newGal);
    return newGal;
  },

  async deleteGalleryAlbum(id: string) {
    const db = await connectDB();
    if (db) {
      return await GalleryAlbum.findByIdAndDelete(id);
    }
    const idx = memoryStore.gallery.findIndex((g) => String(g._id) === String(id));
    if (idx !== -1) memoryStore.gallery.splice(idx, 1);
    return true;
  },

  // Complaints
  async getComplaints(filterQuery: { status?: string; category?: string; priority?: string } = {}) {
    const db = await connectDB();
    if (db) {
      const filter: any = {};
      if (filterQuery.status) filter.status = filterQuery.status;
      if (filterQuery.category) filter.category = filterQuery.category;
      if (filterQuery.priority) filter.priority = filterQuery.priority;
      return await Complaint.find(filter).sort({ createdAt: -1 }).lean();
    }
    return memoryStore.complaints
      .filter((c) => {
        if (filterQuery.status && c.status !== filterQuery.status) return false;
        if (filterQuery.category && c.category !== filterQuery.category) return false;
        if (filterQuery.priority && c.priority !== filterQuery.priority) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async getComplaintByNumber(complaintNumber: string) {
    const db = await connectDB();
    if (db) {
      return await Complaint.findOne({ complaintNumber: complaintNumber.toUpperCase().trim() }).lean();
    }
    return (
      memoryStore.complaints.find(
        (c) => c.complaintNumber?.toUpperCase() === complaintNumber.toUpperCase().trim()
      ) || null
    );
  },

  async createComplaint(data: {
    studentName?: string;
    email?: string;
    department: string;
    semester: string;
    category: string;
    subject: string;
    description: string;
    attachmentUrl?: string;
    isAnonymous: boolean;
  }) {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const complaintNumber = `SFI-${year}-${randomSuffix}`;

    const newDoc = {
      complaintNumber,
      studentName: data.isAnonymous ? 'Anonymous Student' : (data.studentName || 'Student'),
      email: data.isAnonymous ? '' : (data.email || ''),
      department: data.department.toUpperCase(),
      semester: data.semester.toUpperCase(),
      category: data.category,
      subject: data.subject,
      description: data.description,
      attachmentUrl: data.attachmentUrl || '',
      isAnonymous: Boolean(data.isAnonymous),
      status: 'Submitted' as const,
      priority: 'Medium' as const,
      assignedTo: 'Unassigned',
      internalNotes: [],
      statusHistory: [
        {
          status: 'Submitted',
          comment: 'Grievance submitted by student',
          changedBy: 'System',
          changedAt: new Date(),
        },
      ],
    };

    const db = await connectDB();
    if (db) {
      return await Complaint.create(newDoc);
    }

    const memoryItem = {
      ...newDoc,
      _id: `cmp_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    memoryStore.complaints.unshift(memoryItem);
    return memoryItem;
  },

  async updateComplaint(
    id: string,
    updates: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      internalNote?: string;
      statusComment?: string;
      adminName?: string;
    }
  ) {
    const db = await connectDB();
    const admin = updates.adminName || 'Admin';

    if (db) {
      const complaint = await Complaint.findById(id);
      if (!complaint) return null;

      if (updates.status && updates.status !== complaint.status) {
        complaint.status = updates.status as any;
        complaint.statusHistory.push({
          status: updates.status,
          comment: updates.statusComment || `Status changed to ${updates.status}`,
          changedBy: admin,
          changedAt: new Date(),
        });
      }

      if (updates.priority) complaint.priority = updates.priority as any;
      if (updates.assignedTo) complaint.assignedTo = updates.assignedTo;

      if (updates.internalNote) {
        complaint.internalNotes.push({
          note: updates.internalNote,
          author: admin,
          createdAt: new Date(),
        });
      }

      await complaint.save();
      return complaint.toObject();
    }

    // Memory store
    const item = memoryStore.complaints.find((c) => c._id === id);
    if (!item) return null;

    if (updates.status && updates.status !== item.status) {
      item.status = updates.status as any;
      item.statusHistory = item.statusHistory || [];
      item.statusHistory.push({
        status: updates.status,
        comment: updates.statusComment || `Status changed to ${updates.status}`,
        changedBy: admin,
        changedAt: new Date(),
      });
    }

    if (updates.priority) item.priority = updates.priority as any;
    if (updates.assignedTo) item.assignedTo = updates.assignedTo;

    if (updates.internalNote) {
      item.internalNotes = item.internalNotes || [];
      item.internalNotes.push({
        note: updates.internalNote,
        author: admin,
        createdAt: new Date(),
      });
    }

    item.updatedAt = new Date();
    return item;
  },

  async deleteComplaint(id: string) {
    const db = await connectDB();
    if (db) {
      return await Complaint.findByIdAndDelete(id);
    }
    const idx = memoryStore.complaints.findIndex((c) => c._id === id);
    if (idx !== -1) memoryStore.complaints.splice(idx, 1);
    return true;
  },

  // Categories & Complaint Categories
  async getCategories(type?: 'notes' | 'question-paper') {
    const db = await connectDB();
    if (db) {
      const filter: any = { isActive: true };
      if (type) filter.type = type;
      return await Category.find(filter).sort({ name: 1 }).lean();
    }
    return memoryStore.categories.filter((c) => (!type || c.type === type) && c.isActive);
  },

  async saveCategory(data: Partial<ICategory>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await Category.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await Category.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.categories.findIndex((c) => c._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.categories[idx] = { ...memoryStore.categories[idx], ...data, updatedAt: now };
        return memoryStore.categories[idx];
      }
    }
    const newCat = { ...data, _id: `cat_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.categories.push(newCat);
    return newCat;
  },

  async deleteCategory(id: string) {
    const db = await connectDB();
    if (db) {
      return await Category.findByIdAndDelete(id);
    }
    const idx = memoryStore.categories.findIndex((c) => c._id === id);
    if (idx !== -1) memoryStore.categories.splice(idx, 1);
    return true;
  },

  async getComplaintCategories() {
    const db = await connectDB();
    if (db) {
      return await ComplaintCategory.find({ isActive: true }).sort({ name: 1 }).lean();
    }
    return memoryStore.complaintCategories.filter((cc) => cc.isActive);
  },

  // Academic Years
  async getAcademicYears() {
    const db = await connectDB();
    if (db) {
      return await AcademicYear.find({ isActive: true }).sort({ year: -1 }).lean();
    }
    return memoryStore.academicYears.filter((y) => y.isActive).sort((a, b) => (b.year || '').localeCompare(a.year || ''));
  },

  async saveAcademicYear(data: Partial<IAcademicYear>) {
    const db = await connectDB();
    if (db) {
      if ((data as any)._id) {
        return await AcademicYear.findByIdAndUpdate((data as any)._id, data, { new: true });
      }
      return await AcademicYear.create(data);
    }
    const now = new Date();
    if ((data as any)._id) {
      const idx = memoryStore.academicYears.findIndex((y) => y._id === (data as any)._id);
      if (idx !== -1) {
        memoryStore.academicYears[idx] = { ...memoryStore.academicYears[idx], ...data, updatedAt: now };
        return memoryStore.academicYears[idx];
      }
    }
    const newYear = { ...data, _id: `ay_${Date.now()}`, createdAt: now, updatedAt: now } as any;
    memoryStore.academicYears.push(newYear);
    return newYear;
  },

  async deleteAcademicYear(id: string) {
    const db = await connectDB();
    if (db) {
      return await AcademicYear.findByIdAndDelete(id);
    }
    const idx = memoryStore.academicYears.findIndex((y) => y._id === id);
    if (idx !== -1) memoryStore.academicYears.splice(idx, 1);
    return true;
  },

  // Site Settings
  async getSettings() {
    const db = await connectDB();
    let settings: any = null;

    if (db) {
      settings = await SiteSettings.findOne().lean();
    }
    if (!settings) {
      settings = memoryStore.settings;
    }

    const resolvedSettings = { ...settings };

    // Set contact email as requested
    if (!resolvedSettings.contactEmail || resolvedSettings.contactEmail === 'unit@sfigeci.org') {
      resolvedSettings.contactEmail = 'sfigecidukkiunit@gmail.com';
    }

    // Set updated social channels
    if (!resolvedSettings.instagramUrl || resolvedSettings.instagramUrl === 'https://instagram.com/sfi_geci') {
      resolvedSettings.instagramUrl = 'https://www.instagram.com/sfigeci?stkn=eGpvMTR5NGcycWw2';
    }
    if (!resolvedSettings.facebookUrl || resolvedSettings.facebookUrl === 'https://facebook.com/sfigeci') {
      resolvedSettings.facebookUrl = 'https://www.facebook.com/share/19TYtp22RP/?mibextid=wwXIfr';
    }
    if (!resolvedSettings.whatsappUrl) {
      resolvedSettings.whatsappUrl = 'https://whatsapp.com/channel/0029VaWgEOBC1Fu36Tlm0L0Q';
    }

    // Dynamically match phone number with President of current academic year
    try {
      if (db) {
        const currentYearDoc = await AcademicYear.findOne({ isCurrent: true }).lean();
        const currentYear = currentYearDoc?.year || '2026-27';

        let president = await UnitMember.findOne({
          position: 'President',
          academicYear: currentYear,
          isActive: true,
        }).lean();

        if (!president || !president.phone) {
          president = await UnitMember.findOne({
            position: 'President',
            isActive: true,
            phone: { $exists: true, $ne: '' },
          }).lean();
        }

        if (president && president.phone) {
          resolvedSettings.phone = president.phone;
        }
      } else {
        const president = memoryStore.members.find(
          (m) => normalizePosition(m.position) === 'President' && m.isActive && m.phone
        );
        if (president && president.phone) {
          resolvedSettings.phone = president.phone;
        }
      }
    } catch (err) {
      console.warn('Failed to resolve dynamic president phone number:', err);
    }

    return toPlain(resolvedSettings);
  },

  async updateSettings(updates: Partial<ISiteSettings>) {
    const db = await connectDB();
    if (db) {
      return await SiteSettings.findOneAndUpdate({}, updates, { upsert: true, new: true });
    }
    memoryStore.settings = { ...memoryStore.settings, ...updates, updatedAt: new Date() };
    return memoryStore.settings;
  },

  // Admin Users
  async getUsers() {
    const db = await connectDB();
    if (db) {
      return await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    }
    return memoryStore.users.map(({ passwordHash, ...rest }) => rest);
  },

  async getUserByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const db = await connectDB();
    if (db) {
      const found = await User.findOne({ email: cleanEmail }).lean();
      if (found) return found;
    }
    const memUser = memoryStore.users.find((u) => u.email?.toLowerCase() === cleanEmail);
    if (memUser) return memUser;

    // Self-healing fallback for superadmin
    if (cleanEmail === 'admin@sfigeci.org') {
      const defaultAdmin = initMemoryStore().users[0];
      if (!memoryStore.users.some(u => u.email === 'admin@sfigeci.org')) {
        memoryStore.users.unshift(defaultAdmin);
      }
      return defaultAdmin;
    }

    return null;
  },

  async saveUser(data: { name: string; email: string; password?: string; role?: 'superadmin' | 'admin' | 'editor'; isActive?: boolean; _id?: string }) {
    const db = await connectDB();
    let passwordHash = undefined;
    if (data.password) {
      passwordHash = await hashPassword(data.password);
    }

    if (db) {
      if (data._id) {
        const updateData: any = { name: data.name, email: data.email.toLowerCase().trim(), role: data.role, isActive: data.isActive };
        if (passwordHash) updateData.passwordHash = passwordHash;
        return await User.findByIdAndUpdate(data._id, updateData, { new: true });
      }
      return await User.create({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash: passwordHash || (await hashPassword('ChangeMe@2026')),
        role: data.role || 'admin',
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    }

    const now = new Date();
    if (data._id) {
      const idx = memoryStore.users.findIndex((u) => u._id === data._id);
      if (idx !== -1) {
        memoryStore.users[idx] = {
          ...memoryStore.users[idx],
          name: data.name,
          email: data.email,
          role: data.role || memoryStore.users[idx].role,
          isActive: data.isActive !== undefined ? data.isActive : memoryStore.users[idx].isActive,
          passwordHash: passwordHash || memoryStore.users[idx].passwordHash,
          updatedAt: now,
        };
        return memoryStore.users[idx];
      }
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash: passwordHash || (await hashPassword('ChangeMe@2026')),
      role: data.role || 'admin',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    } as any;
    memoryStore.users.push(newUser);
    return newUser;
  },

  async deleteUser(id: string) {
    const db = await connectDB();
    if (db) {
      return await User.findByIdAndDelete(id);
    }
    const idx = memoryStore.users.findIndex((u) => u._id === id);
    if (idx !== -1) memoryStore.users.splice(idx, 1);
    return true;
  },

  // Dashboard Aggregates & Statistics
  async getDashboardStats() {
    const [
      materials,
      events,
      members,
      complaints,
      departments,
    ] = await Promise.all([
      this.getMaterials({ publishedOnly: false }),
      this.getEvents(false),
      this.getMembers(undefined, false),
      this.getComplaints(),
      this.getDepartments(false),
    ]);

    const notes = materials.filter((m) => m.type === 'notes');
    const questionPapers = materials.filter((m) => m.type === 'question-paper');
    const totalDownloads = materials.reduce((acc, m) => acc + (m.downloadCount || 0), 0);
    const now = new Date();
    const upcomingEvents = events.filter((e) => new Date(e.eventDate || 0) >= now);
    const pendingComplaints = complaints.filter(
      (c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress'
    );

    // Distribution by Department
    const materialsByDept: Record<string, number> = {};
    const notesBySem: Record<string, number> = {};
    const qpByDept: Record<string, number> = {};

    departments.forEach((d) => {
      if (d.code) {
        materialsByDept[d.code] = 0;
        qpByDept[d.code] = 0;
      }
    });

    for (let i = 1; i <= 8; i++) {
      notesBySem[`S${i}`] = 0;
    }

    materials.forEach((m) => {
      if (m.department && materialsByDept[m.department] !== undefined) {
        materialsByDept[m.department]++;
      }
      if (m.type === 'notes' && m.semester && notesBySem[m.semester] !== undefined) {
        notesBySem[m.semester]++;
      }
      if (m.type === 'question-paper' && m.department && qpByDept[m.department] !== undefined) {
        qpByDept[m.department]++;
      }
    });

    // Complaints by Category & Status
    const complaintsByCategory: Record<string, number> = {};
    const complaintsByStatus: Record<string, number> = {};

    complaints.forEach((c) => {
      if (c.category) {
        complaintsByCategory[c.category] = (complaintsByCategory[c.category] || 0) + 1;
      }
      if (c.status) {
        complaintsByStatus[c.status] = (complaintsByStatus[c.status] || 0) + 1;
      }
    });

    return {
      totalNotes: notes.length,
      totalQuestionPapers: questionPapers.length,
      totalMaterials: materials.length,
      totalDownloads,
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      totalMembers: members.length,
      totalComplaints: complaints.length,
      pendingComplaints: pendingComplaints.length,
      materialsByDept,
      notesBySem,
      qpByDept,
      complaintsByCategory,
      complaintsByStatus,
    };
  },

  // Comrade Dheeraj Memorial Page
  async getMemorialPage() {
    const db = await connectDB();
    if (db) {
      let page = await MemorialPage.findOne({ slug: 'comrade-dheeraj' }).lean();
      if (!page) {
        page = await MemorialPage.create(memoryStore.memorial || initMemoryStore().memorial);
      }
      return page;
    }
    if (!memoryStore.memorial) {
      memoryStore.memorial = initMemoryStore().memorial;
    } else if (memoryStore.memorial.heroImage === '/images/hero-bg.jpg') {
      memoryStore.memorial.heroImage = '/images/dheeraj-portrait.png';
      if (!memoryStore.memorial.gallery?.some((g: any) => g.imageUrl === '/images/dheeraj-portrait.png')) {
        memoryStore.memorial.gallery = [
          {
            imageUrl: '/images/dheeraj-portrait.png',
            caption: 'Comrade Dheeraj Rajendran — B.Tech Computer Science and Engineering student, GEC Idukki.',
            date: 'Pre-2022',
            source: 'College & Family Archive',
            altText: 'Portrait of Comrade Dheeraj Rajendran',
          },
          ...(memoryStore.memorial.gallery || []),
        ];
      }
    }
    return memoryStore.memorial;
  },

  async updateMemorialPage(data: any) {
    const db = await connectDB();
    if (db) {
      let page = await MemorialPage.findOne({ slug: 'comrade-dheeraj' });
      if (!page) {
        page = await MemorialPage.create({ ...memoryStore.memorial, ...data });
      } else {
        Object.assign(page, data);
        await page.save();
      }
      return page.toObject ? page.toObject() : page;
    }
    const now = new Date();
    memoryStore.memorial = {
      ...memoryStore.memorial,
      ...data,
      updatedAt: now,
    };
    return memoryStore.memorial;
  },
};
