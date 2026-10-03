# SFI GECI — Official Student Portal & Academic Repository
### Students' Federation of India • Government Engineering College Idukki

> "Independence • Democracy • Socialism"

A complete, production-ready, fully dynamic academic portal, KTU study repository, grievance tracking desk, and comprehensive CMS for **SFI Government Engineering College Idukki Unit**.

---

## 🌟 Key Features

### 🎓 Public Student Website
- **Dedicated Academic Vault (`/notes`)**:
  - Clear, strict two-lane navigation: **Study Notes** vs. **Previous Year Question Papers**.
  - **Department Selection Grid**: 6 undergraduate branches (**CSE, IT, EEE, ECE, ME, RAI**) in responsive grid with live material counts.
  - **Semester Selection Grid**: All 8 semesters (**S1 to S8**) in responsive grid cards.
  - **Dynamic Subjects**: KTU curriculum subjects loaded dynamically from MongoDB.
  - **Study Notes Page**: Grouped by unit (Unit 1 to 5) with title, description, category, and direct View/Download.
  - **Previous Year Question Papers**: Filtered by examination year (2026, 2025, 2024...) and exam type.
  - **Dual File Source Support**:
    - **Cloudinary Storage**: High-speed CDN PDF upload with download tracking.
    - **External Link Support**: Native Google Drive, OneDrive, or Dropbox shareable links with zero hosting overhead.
  - **Real-Time Download Counter**: Increments downloads server-side.
- **Campus Life & Events (`/events`)**: Upcoming and past college festivals (e.g. *DHWANI Arts Fest*, *ADVAITHA Hackathon*), venue details, and online registration.
- **Unit Leadership (`/members`)**: Academic year-wise filter (2026-27, 2025-26, etc.) with executive committee profiles and contact links.
- **Official Notice Board (`/announcements`)**: KTU timetables, bus schedule updates, and urgent alerts.
- **Visual Archives (`/gallery`)**: Photo albums covering campus milestones.
- **Confidential Grievance Cell (`/complaints`)**:
  - Secure submission form with anonymous option.
  - Generates instant tracking reference ID: `SFI-2026-XXXXX`.
  - **Grievance Tracker (`/complaints/track`)**: Public timeline tracking with strict zero-leakage safeguards (no admin identities or private notes revealed).
- **Contact & About (`/contact`, `/about`)**: College location map, phone, email, social media links, and union history.

---

### 🛡️ Secure Admin CMS (`/admin`)
- **Protected Routes**: Protected by secure HTTP-only JWT cookies (`sfi_admin_token`) signed via `jose`.
- **Role-Based Access Control**: `superadmin`, `admin`, and `editor`.
- **Interactive Dashboard**: Real-time KPI counters and breakdown charts:
  - Materials by Department
  - Notes by Semester (S1–S8 coverage)
  - Complaints by Status & Category
- **Study Notes CMS (`/admin/notes`)**:
  - Modal form with dynamic Department + Semester subject dropdown.
  - File source switcher: Cloudinary PDF upload vs. External Google Drive URL.
- **Question Paper CMS (`/admin/question-papers`)**:
  - Exam year, exam category, and question bank management.
- **Academic Structure Management**:
  - `/admin/subjects`: Add/edit subjects with KTU code and semester mapping.
  - `/admin/departments`: Manage branches (CSE, IT, EEE, ECE, ME, RAI).
  - `/admin/semesters`: S1 through S8 level configuration.
  - `/admin/academic-years`: Manage academic sessions.
  - `/admin/categories`: Notes & QP categories.
- **Content CMS**:
  - `/admin/events`: Add posters, date, time, venue, and registration links.
  - `/admin/members`: Committee members, roles, academic years, and photos.
  - `/admin/announcements`: Circulars, priorities (normal, important, urgent).
  - `/admin/gallery`: Photo albums and bulk photo links.
- **Grievance Resolution Desk (`/admin/complaints`)**:
  - Review student issues, assign union leads, advance status (`Submitted` → `Under Review` → `In Progress` → `Resolved` → `Closed`).
  - Maintain public timeline updates while keeping private internal admin notes strictly confidential.
- **Site Settings (`/admin/settings`)**: Edit portal name, tagline, hero title, contact numbers, social handles, and footer text without touching source code.
- **Admin Users (`/admin/users`)**: Create and manage staff logins.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, Turbopack, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas via Mongoose
- **File & PDF Storage**: Cloudinary SDK (with streaming buffer upload and external Google Drive fallback)
- **Authentication**: JWT signed via `jose` stored in HTTP-only, secure, SameSite cookies + `bcryptjs` password hashing
- **Icons**: Lucide React
- **Validation**: Server-side request validation & file sanitization

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or yarn

### 2. Environment Variables
Create `.env.local` based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Configure your variables:

```env
# MongoDB Atlas or local MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sfi_geci?retryWrites=true&w=majority

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret
AUTH_SECRET=sfi_geci_production_grade_jwt_secret_token_key_2026_xyz

# Base App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: Even if MongoDB Atlas or Cloudinary keys are not yet configured, the system includes automatic resilient mock data handling and memory caching, allowing full frontend and CMS preview out of the box!

### 3. Install & Run
```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🔑 Default Administrator Credentials

Login at: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@sfigeci.org` | `SfiGeci@2026!` |

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── (public)
│   │   ├── page.tsx                     # Homepage (Hero, Quick Access, Latest Notes/QPs)
│   │   ├── about/page.tsx               # About SFI GECI unit
│   │   ├── contact/page.tsx             # College contact & message form
│   │   ├── notes/
│   │   │   ├── page.tsx                 # Academic Vault: Notes vs Question Papers
│   │   │   ├── notes/
│   │   │   │   ├── page.tsx             # 6 Departments Grid
│   │   │   │   └── [dept]/
│   │   │   │       ├── page.tsx         # 8 Semesters Grid (S1 to S8)
│   │   │   │       └── [sem]/
│   │   │   │           ├── page.tsx     # Subjects Grid
│   │   │   │           └── [subject]/
│   │   │   │               └── page.tsx # Notes list (Units 1-5, View/Download)
│   │   │   └── question-papers/
│   │   │       ├── page.tsx             # 6 Departments Grid
│   │   │       └── [dept]/
│   │   │           ├── page.tsx         # 8 Semesters Grid
│   │   │           └── [sem]/
│   │   │               ├── page.tsx     # Subjects Grid
│   │   │               └── [subject]/
│   │   │                   └── page.tsx # QP list (Exam Years, View/Download)
│   │   ├── events/page.tsx              # Campus Events & Fests
│   │   ├── events/[slug]/page.tsx       # Event details & registration
│   │   ├── members/page.tsx             # Year-wise Unit Committee
│   │   ├── announcements/page.tsx       # Circulars & Alerts
│   │   ├── gallery/page.tsx             # Photo albums
│   │   ├── complaints/page.tsx          # Confidential Grievance Submission
│   │   └── complaints/track/page.tsx    # Real-Time Grievance Tracker
│   ├── admin/
│   │   ├── login/page.tsx               # Admin Login
│   │   ├── layout.tsx                   # Admin Shell (Sidebar, Header, Auth Guard)
│   │   ├── page.tsx                     # Dashboard Analytics & Charts
│   │   ├── notes/page.tsx               # Study Notes CMS
│   │   ├── question-papers/page.tsx     # Question Papers CMS
│   │   ├── subjects/page.tsx            # Subjects Management
│   │   ├── departments/page.tsx         # Departments CMS
│   │   ├── semesters/page.tsx           # Semesters CMS
│   │   ├── academic-years/page.tsx      # Academic Years CMS
│   │   ├── categories/page.tsx          # Material Categories CMS
│   │   ├── events/page.tsx              # Events CMS
│   │   ├── members/page.tsx             # Unit Members CMS
│   │   ├── announcements/page.tsx       # Announcements CMS
│   │   ├── gallery/page.tsx             # Gallery CMS
│   │   ├── complaints/page.tsx          # Grievance Redressal Desk
│   │   ├── settings/page.tsx            # Website Settings CMS
│   │   └── users/page.tsx               # Admin Users Management
│   └── api/                             # Route Handlers (23 endpoints)
├── components/                          # Reusable UI & Layout Components
├── models/                              # Mongoose Schemas (14 unified models)
└── lib/                                 # Database, Auth, Cloudinary, and Seed Data
```

---

## ☁️ Deployment on Vercel

1. Push code to your GitHub repository.
2. Import repository into [Vercel](https://vercel.com).
3. Set Environment Variables:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your custom domain or vercel.app domain)
4. Click **Deploy**.
5. Once deployed, call `POST /api/seed` or log into `/admin` to verify seeded data.

---

## 📜 License & Solidarity
Developed for the students of **Government Engineering College Idukki** by **SFI GECI Academic & Tech Wing**.
"Study & Struggle — Towards Democratic Education".
