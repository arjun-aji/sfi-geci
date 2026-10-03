import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "SFI GECI — Students' Federation of India | Govt. Engineering College Idukki",
  description:
    "Official academic portal and student repository of SFI Government Engineering College Idukki Unit. Access KTU Notes, Previous Year Question Papers, Events, Grievance Tracking, and Announcements.",
  keywords: [
    'SFI GECI',
    'GEC Idukki',
    'KTU Notes',
    'Previous Year Question Papers',
    'SFI Kerala',
    'Engineering College Idukki',
    'Painavu',
  ],
  authors: [{ name: 'SFI GECI Tech & Academic Wing' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "SFI GECI — Students' Federation of India | Govt. Engineering College Idukki",
    description:
      'Digital Study Repository, KTU Syllabus Notes, Question Papers, Campus Grievance Desk, and SFI Unit Management System.',
    siteName: 'SFI GECI',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
