'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { WEB3FORMS_ACCESS_KEY } from '@/lib/web3forms';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'SFI GECI Contact Section');
    if (!formData.get('subject')) {
      const name = formData.get('name') || 'Website Visitor';
      formData.append('subject', `New Contact Section Message from ${name}`);
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        form.reset();
      } else {
        const errorText = data.message || 'Submission failed. Please try again.';
        setErrorMsg(errorText);
        alert('Error: ' + errorText);
      }
    } catch (error) {
      const errText = 'Something went wrong. Please try again.';
      setErrorMsg(errText);
      alert(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Message Delivered!</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Thank you for reaching out to SFI GECI. Our unit representatives will review your query and respond shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-bold text-red-600 hover:underline pt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900">Send a Message</h3>
        <p className="text-xs text-slate-500">We will respond to your queries promptly.</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Arun Kumar"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            placeholder="Write your query or feedback..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md shadow-red-500/20 transition active:scale-95 flex items-center justify-center space-x-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
