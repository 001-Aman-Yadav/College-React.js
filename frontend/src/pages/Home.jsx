import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, Award, ChevronRight, Bell, ChevronDown } from 'lucide-react';
import api from '../services/api.js';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices');
        if (res.data.success) {
          setNotices(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotices();
  }, []);

  const stats = [
    { icon: <Users className="h-6 w-6 text-white" />, count: '4,500+', label: 'Active Students' },
    { icon: <BookOpen className="h-6 w-6 text-white" />, count: '45+', label: 'Programs Offered' },
    { icon: <Award className="h-6 w-6 text-white" />, count: '92%', label: 'Placement Record' },
    { icon: <Calendar className="h-6 w-6 text-white" />, count: '15+', label: 'Annual Events' },
  ];

  const faqs = [
    { q: "What is the process for online admission?", a: "To apply, click the 'Admission Open' button. Fill out the application form, upload the required files (Photo, Signature, Aadhar, and Marksheets), set your dashboard password, and submit. An application number will be sent to your email." },
    { q: "How can I pay my fees?", a: "Once your documents are verified and your admission is approved, you will receive your Roll Number and Admission Number. Log into your Student Dashboard using your email and password, click 'Fees', and make payments via UPI, Card, or Net Banking." },
    { q: "Is hostel accommodation available?", a: "Yes, we offer fully furnished hostel rooms with high-speed Wi-Fi, laundry service, and automated biometric attendance. Hostel allocation is processed after fee payment." }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.1),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-8 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Admission Open for Academic Session 2026-27
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Shape Your Future with <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Metropolitan University</span>
              </h1>
              <p className="text-lg text-slate-300">
                Providing high-quality education, state-of-the-art labs, and premium industrial collaborations to launch your corporate career.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/admission"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Apply Online Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-6 py-3 font-semibold text-white backdrop-blur transition-all hover:bg-slate-800/80"
                >
                  Explore Programs
                </Link>
              </div>
            </div>

            {/* Notices Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <Bell className="h-5 w-5 text-blue-400 animate-bounce" />
                    Latest Notice Board
                  </h3>
                  <Link to="/courses" className="text-xs text-blue-400 hover:underline flex items-center gap-0.5">
                    View All <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-4 space-y-4">
                  {notices.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">No notices posted recently.</p>
                  ) : (
                    notices.map((notice) => (
                      <div key={notice._id} className="group rounded-lg bg-slate-900/60 p-4 border border-slate-850 hover:border-slate-700 transition">
                        <div className="flex items-center justify-between">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            notice.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {notice.priority} Notice
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition">
                          {notice.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {notice.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="rounded-lg bg-blue-600 p-3 shadow-md">
                {s.icon}
              </div>
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{s.count}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaders Messages */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-3xl font-bold tracking-tight">Institutional Messages</h2>
          <p className="text-sm text-slate-500">Leading the path of academic distinction.</p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Director Message */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              alt="Director"
              className="h-24 w-24 rounded-full object-cover shadow border"
            />
            <div>
              <h3 className="text-lg font-bold">Dr. Sameer Malhotra</h3>
              <p className="text-xs text-blue-600 font-medium">Director General, MU</p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">
                "Education is not merely filling of the mind, but ignition of interest. At Metropolitan, we strive to build leaders of tomorrow who are ready to create a significant global footprint."
              </p>
            </div>
          </div>

          {/* Principal Message */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
              alt="Principal"
              className="h-24 w-24 rounded-full object-cover shadow border"
            />
            <div>
              <h3 className="text-lg font-bold">Prof. Aditi Sharma</h3>
              <p className="text-xs text-blue-600 font-medium">Principal & Academic Head</p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 italic">
                "We provide a welcoming environment where our students can develop academic skills, critical thinking capabilities, and explore creative arts to build a wholesome engineering, computing or business mindset."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment partners */}
      <section className="bg-slate-100 dark:bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Students Work at Top Corporate Partners</h3>
          <div className="mt-8 flex flex-wrap justify-center gap-12 items-center opacity-60">
            <span className="text-xl font-bold text-slate-400">TATA</span>
            <span className="text-xl font-bold text-slate-400">Google</span>
            <span className="text-xl font-bold text-slate-400">Microsoft</span>
            <span className="text-xl font-bold text-slate-400">Amazon</span>
            <span className="text-xl font-bold text-slate-400">Deloitte</span>
            <span className="text-xl font-bold text-slate-400">Capgemini</span>
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-slate-500">Quick answers to common questions about admissions, fees, and services.</p>
        </div>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <button
                className="flex w-full items-center justify-between p-5 text-left font-medium hover:bg-slate-50 dark:hover:bg-slate-850"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-5 text-sm text-slate-650 dark:text-slate-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
