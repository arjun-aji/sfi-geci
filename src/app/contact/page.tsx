import React from 'react';
import { DataService } from '@/lib/data-service';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { MapPin, Mail, Phone, Building } from 'lucide-react';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import ContactForm from '@/components/ui/ContactForm';

export const revalidate = 60;

export const metadata = {
  title: 'Contact SFI GECI Unit | Government Engineering College Idukki',
  description: 'Reach out to the SFI unit committee at GEC Idukki for academic queries, hostel help, or college assistance.',
};

export default async function ContactPage() {
  const settings = await DataService.getSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-12">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Connect With Unit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Have an inquiry, study material suggestion, or collaboration idea? We are here to support every student.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/20">
                SFI
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{settings.websiteName} UNIT</h3>
                <p className="text-xs text-red-600 font-semibold">{settings.tagline}</p>
              </div>
            </div>

            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">College Location</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Email Address</span>
                  <a href={`mailto:${settings.contactEmail}`} className="font-semibold text-slate-800 hover:text-red-600 transition">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Helpline Number</span>
                  <a href={`tel:${settings.phone}`} className="font-semibold text-slate-800 hover:text-red-600 transition">
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Follow Us on Social Media
            </span>
            <div className="flex items-center space-x-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 transition"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 transition"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {settings.whatsappUrl && (
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-600 transition"
                  aria-label="WhatsApp Channel"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Direct Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
