import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('Please fill in all inputs.');
      return;
    }
    // Simulate sending message
    setStatus('Thank you! Your message has been received. Our team will get back to you shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  const contactDetails = [
    { icon: <MapPin className="h-5 w-5 text-blue-600" />, label: 'Campus Address', value: '123 Education Campus, Academic Zone, New Delhi - 110001' },
    { icon: <Phone className="h-5 w-5 text-blue-600" />, label: 'Helpdesk Call Center', value: '+91 11 2345 6789 / +91 98765 43210' },
    { icon: <Mail className="h-5 w-5 text-blue-600" />, label: 'General Queries Email', value: 'contact@metropolitan.edu.in' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.1),transparent)]" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Contact Admissions & Helpdesk</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base">
          Have queries about registration, payments, or courses? Reach out to our campus desk.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Info list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Campus Contacts</h2>
            <div className="space-y-6">
              {contactDetails.map((det, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="rounded-lg bg-blue-50 dark:bg-slate-850 p-3 flex-shrink-0">
                    {det.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{det.label}</h4>
                    <p className="text-sm font-semibold text-slate-850 dark:text-slate-200 mt-1">{det.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive map placeholder */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm h-64 relative">
            {/* Visual map design */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <MapPin className="h-10 w-10 text-red-500 animate-bounce mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Metropolitan University Campus Map</p>
              <p className="text-[11px] text-slate-450 mt-1">Latitude: 28.6139° N, Longitude: 77.2090° E</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-4 rounded bg-blue-600 px-4 py-1.5 text-xs text-white font-semibold hover:bg-blue-500"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Send an Inquiry Message</h2>
          {status && (
            <div className={`rounded-lg p-4 text-xs font-semibold mb-6 ${status.includes('received') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {status}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Your Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter name"
                className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="yourname@gmail.com"
                className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Admission Queries"
                className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Detailed Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your question or query specs..."
                rows="4"
                className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-md"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
