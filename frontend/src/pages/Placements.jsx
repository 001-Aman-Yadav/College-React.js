import React from 'react';
import { Award, Briefcase, GraduationCap, Building2, TrendingUp, HelpCircle } from 'lucide-react';

const Placements = () => {
  const stats = [
    { label: 'Highest Package', value: '₹42.5 LPA', desc: 'Secured at Microsoft (USA)', icon: <TrendingUp className="h-6 w-6 text-emerald-500" /> },
    { label: 'Average Package', value: '₹6.8 LPA', desc: 'Across BTech & MBA programs', icon: <Briefcase className="h-6 w-6 text-blue-500" /> },
    { label: 'Overall Placement', value: '94.2%', desc: 'For 2024-25 graduating batch', icon: <Award className="h-6 w-6 text-indigo-500" /> },
    { label: 'Recruitment Partners', value: '180+', desc: 'Active corporate hiring ties', icon: <Building2 className="h-6 w-6 text-amber-500" /> }
  ];

  const partners = [
    { name: 'Google', sector: 'Technology' },
    { name: 'Microsoft', sector: 'Technology' },
    { name: 'Amazon', sector: 'E-Commerce' },
    { name: 'TATA Consultancy Services', sector: 'IT Services' },
    { name: 'Cognizant', sector: 'IT Services' },
    { name: 'Deloitte', sector: 'Consulting' },
    { name: 'Capgemini', sector: 'Consulting' },
    { name: 'Wipro', sector: 'IT Services' },
    { name: 'HCL Technologies', sector: 'IT Services' },
    { name: 'ICICI Bank', sector: 'Banking' }
  ];

  const trainingPrograms = [
    { title: 'Technical Bootcamps', desc: 'Rigorous coaching in Data Structures, Algorithms, Full Stack Web Development, and Cloud Architectures.' },
    { title: 'Soft Skills Training', desc: 'Mock interviews, resume crafting clinics, verbal reasoning workshops, and corporate etiquette training.' },
    { title: 'Industrial Internships', desc: 'Mandatory 6-month hands-on industry placements with active stipend support at corporate partner organizations.' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.15),transparent)]" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Placement Achievements</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base">
          Connecting outstanding student capabilities with top global recruiters and technology organizations.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{s.label}</span>
              <div className="rounded-full bg-slate-50 dark:bg-slate-850 p-2">
                {s.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">{s.value}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Recruiter corporate grid */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Our Prominent Hiring Partners</h2>
          <p className="text-sm text-slate-500">Organizations recruiting our alumni year-on-year.</p>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((p, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm h-28">
              <span className="font-extrabold text-lg text-slate-800 dark:text-slate-250 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{p.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">{p.sector}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Training Programs */}
      <section className="grid gap-8 md:grid-cols-3">
        {trainingPrograms.map((prog, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="inline-flex rounded-lg bg-blue-50 dark:bg-blue-950/40 p-2.5 text-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-950 dark:text-white">{prog.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {prog.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Placements;
