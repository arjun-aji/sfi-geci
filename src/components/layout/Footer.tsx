
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';

export default function Footer() {
  const pathname = usePathname();
  const [contactInfo, setContactInfo] = React.useState({
    email: 'sfigecidukkiunit@gmail.com',
    phone: '+91 92078 81324',
    address: 'GEC Idukki, Painavu, Idukki District, Kerala 685603',
  });
  const [socialLinks, setSocialLinks] = React.useState({
    instagram: 'https://www.instagram.com/sfigeci?stkn=eGpvMTR5NGcycWw2',
    facebook: 'https://www.facebook.com/share/19TYtp22RP/?mibextid=wwXIfr',
    whatsapp: 'https://whatsapp.com/channel/0029VaWgEOBC1Fu36Tlm0L0Q',
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setContactInfo({
            email: data.settings.contactEmail || 'sfigecidukkiunit@gmail.com',
            phone: data.settings.phone || '+91 92078 81324',
            address: data.settings.address || 'GEC Idukki, Painavu, Idukki District, Kerala 685603',
          });
          setSocialLinks({
            instagram: data.settings.instagramUrl || 'https://www.instagram.com/sfigeci?stkn=eGpvMTR5NGcycWw2',
            facebook: data.settings.facebookUrl || 'https://www.facebook.com/share/19TYtp22RP/?mibextid=wwXIfr',
            whatsapp: data.settings.whatsappUrl || 'https://whatsapp.com/channel/0029VaWgEOBC1Fu36Tlm0L0Q',
          });
        }
      })
      .catch(() => {});
  }, []);

  // If in admin dashboard, suppress public footer
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-red-600/30">
                SFI
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight">SFI GECI UNIT</h3>
                <p className="text-xs text-rose-400 font-semibold tracking-wider uppercase">
                  Students' Federation of India
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Committed to the progressive ideals of <span className="text-white font-semibold">Independence, Democracy, and Socialism</span>. Working tirelessly for the academic excellence, digital accessibility, and democratic rights of every student at Government Engineering College Idukki.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 hover:text-red-400 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 hover:text-red-400 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center transition"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Academic Repository Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span>Digital Vault</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/notes/notes" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Lecture Notes</span>
                </Link>
              </li>
              <li>
                <Link href="/notes/question-papers" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Previous Year QPs</span>
                </Link>
              </li>
              <li>
                <Link href="/notes/notes/CSE" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>CSE Materials</span>
                </Link>
              </li>
              <li>
                <Link href="/notes/notes/RAI" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Robotics & AI</span>
                </Link>
              </li>
              <li>
                <Link href="/notes/notes/ECE" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>ECE Notes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-red-500" />
              <span>Campus Portals</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/events" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Events & Fests</span>
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Unit Committee</span>
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Circulars & Alerts</span>
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Student Grievance</span>
                </Link>
              </li>
              <li>
                <Link href="/complaints/track" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  <span>Track Status</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Campus Unit</span>
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition">
                  {contactInfo.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition">
                  {contactInfo.phone}
                </a>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin CMS Access</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SFI GEC Idukki Unit. Built with solidarity for students.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-300 transition">About SFI</Link>
            <Link href="/contact" className="hover:text-slate-300 transition">Contact</Link>
            <Link href="/complaints" className="hover:text-slate-300 transition">Confidential Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
