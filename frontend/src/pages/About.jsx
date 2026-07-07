import React, { useState } from 'react';
import { Target, Landmark, Award, Eye, Compass, Users, CheckCircle, MapPin } from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('us');

  const historyMilestones = [
    { year: '2005', title: 'Foundation Stone', desc: 'Metropolitan University was established by the Education Society with a vision to deliver world-class research and academic excellence.' },
    { year: '2010', title: 'Accreditation Milestone', desc: 'Received NAAC Grade "A" status and got autonomous university recognition from the UGC.' },
    { year: '2016', title: 'Research & Labs Expansion', desc: 'Inaugurated the advanced Innovation and Incubation Center sponsored by corporate tech partners.' },
    { year: '2022', title: 'Global Collaborations', desc: 'Partnered with top tier Ivy League universities for student exchanges and credit transfer programs.' },
  ];

  const adminProfiles = [
    { name: 'Dr. Ramesh K. Verma', role: 'Honorable Chairman', desc: 'Over 30 years of philanthropic leadership and industry expertise shaping educational policies globally.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dr. Sameer Malhotra', role: 'Director General', desc: 'Former advisor to national research panels. Steering university corporate collaborations.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Prof. Aditi Sharma', role: 'Principal & Academic Head', desc: 'Passionate academician driving curricular advancements and teaching excellence frameworks.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dr. Vikramaditya Rao', role: 'Vice Principal', desc: 'Specialist in student affairs, operations, and organizing comprehensive co-curricular programs.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' }
  ];

  const infrastructureAssets = [
    { title: 'Smart Academic Blocks', desc: 'Air-conditioned digital lecture halls equipped with premium acoustics and interactive presentation screens.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500' },
    { title: 'Supercomputing Research Labs', desc: 'Vibrant AI, IoT, and Cloud Computing research workspaces powered by NVIDIA GPUs and hardware labs.', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=500' },
    { title: 'Central Library Hall', desc: 'Housing 100,000+ print volumes, online research journal subscriptions, and 24/7 quiet research zones.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=500' },
    { title: 'Sports Arena & Gym', desc: 'Olympic-sized indoor basketball court, cricket fields, athletics tracks, and a modern wellness center.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=500' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Page Header Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.15),transparent)]" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Metropolitan University</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base">
          A premier institution committed to nurturing global innovators and professional leaders through scholarly education.
        </p>
      </section>

      {/* Tabs Menu Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'us', label: 'Who We Are', icon: <Landmark className="h-4 w-4" /> },
          { id: 'vision', label: 'Vision & Mission', icon: <Target className="h-4 w-4" /> },
          { id: 'vc', label: 'VC Message', icon: <Users className="h-4 w-4" /> },
          { id: 'history', label: 'Our History', icon: <Compass className="h-4 w-4" /> },
          { id: 'infra', label: 'Campus Infrastructure', icon: <Award className="h-4 w-4" /> },
          { id: 'accreditations', label: 'Accreditations', icon: <CheckCircle className="h-4 w-4" /> },
          { id: 'admin', label: 'Administration Office', icon: <Users className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels Contents */}
      <div className="mt-8">
        
        {/* WHO WE ARE */}
        {activeTab === 'us' && (
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">An Overview of Academic Excellence</h2>
              <p className="text-slate-650 dark:text-slate-450 leading-relaxed text-sm">
                Founded in 2005, Metropolitan University stands as a beacon of academic distinction, research leadership, and community development. With over 4,500 active students and 45 specialized graduate programs, we facilitate an environment where curiosity thrives.
              </p>
              <p className="text-slate-650 dark:text-slate-455 leading-relaxed text-sm">
                Our curriculum is designed in alignment with global educational standards and in close synergy with corporate industry advisory boards. We empower students to innovate, collaborate, and succeed in their chosen careers.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  'UGC & AICTE Recognized',
                  'Grade A+ NAAC Certified',
                  'Lush Green 50-Acre Campus',
                  '100% Placement Support Desk',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video md:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" 
                alt="Metropolitan University Campus" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                Main Academic Campus Entrance
              </div>
            </div>
          </div>
        )}

        {/* VISION & MISSION */}
        {activeTab === 'vision' && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Vision card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-4">
              <div className="inline-flex rounded-lg bg-blue-100 dark:bg-blue-950/40 p-3 text-blue-600">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Our Global Vision</h2>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                To be recognized as a world-class center of higher learning, cultivating a creative educational ecology that drives technological innovations, moral responsibility, and entrepreneurial leaders for sustainable development.
              </p>
            </div>

            {/* Mission card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-4">
              <div className="inline-flex rounded-lg bg-indigo-100 dark:bg-indigo-950/40 p-3 text-indigo-600">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Our Core Mission</h2>
              <ul className="space-y-3 text-sm text-slate-650 dark:text-slate-400 list-disc list-inside">
                <li>Provide outstanding, industry-responsive academic instruction in sciences, technologies, and management systems.</li>
                <li>Pioneer interdisciplinary research projects that target local and global industrial challenges.</li>
                <li>Engage with local and corporate stakeholders to foster values, social responsibility, and tech-driven career placement programs.</li>
              </ul>
            </div>
          </div>
        )}

        {/* VC MESSAGE */}
        {activeTab === 'vc' && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-3 text-center space-y-2">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" 
                alt="Vice Chancellor" 
                className="h-32 w-32 rounded-full mx-auto object-cover border-4 border-blue-500 shadow"
              />
              <h3 className="font-bold text-base mt-2">Prof. S. K. Suryavanshi</h3>
              <p className="text-xs text-blue-600 font-semibold uppercase">Vice Chancellor, MU</p>
            </div>
            <div className="md:col-span-9 space-y-4">
              <h2 className="text-xl font-bold">Message from the Vice Chancellor</h2>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                Welcome to Metropolitan University. In this fast-evolving digital era, higher education must serve as an incubator for critical thought, practical adaptability, and visionary engineering. Our academic programs are designed to inspire students to look beyond conventional boundaries and address real-world community challenges.
              </p>
              <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-medium italic">
                "We do not teach subjects; we cultivate a mindset of resilience, creativity, and technological excellence. I invite you to join our family of innovators and redefine what is possible."
              </p>
            </div>
          </div>
        )}

        {/* ACCREDITATIONS */}
        {activeTab === 'accreditations' && (
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: 'NAAC Grade A+ Certification', body: 'The National Assessment and Accreditation Council has awarded Metropolitan University an A+ grade with a CGPA score of 3.65/4.0.', authority: 'NAAC, Govt of India' },
              { title: 'AICTE Approval', body: 'All engineering, computing, and professional management degrees offered are officially approved by the All India Council for Technical Education.', authority: 'AICTE, New Delhi' },
              { title: 'UGC Autonomous Status', body: 'Recognized as an autonomous university under Section 2(f) of the UGC Act 1956, granting independence for curriculum innovations.', authority: 'University Grants Commission' },
              { title: 'NIRF Ranking', body: 'Ranked in the top 75 Engineering Institutes nationwide by the National Institutional Ranking Framework.', authority: 'NIRF, Ministry of Education' },
              { title: 'ISO 9001:2015 Certified', body: 'Maintains international standards in teaching methodologies, laboratories setup, data management, and operations.', authority: 'ISO Registry' },
              { title: 'QS I-GAUGE Diamond Rating', body: 'Awarded Diamond badge for visual learning infrastructures, student employabilities, and campus facilities.', authority: 'QS World University Rankings' },
            ].map((acc, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-905 dark:text-white">{acc.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{acc.body}</p>
                <div className="text-[10px] uppercase font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">{acc.authority}</div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8 py-4">
            {historyMilestones.map((m, idx) => (
              <div key={idx} className="relative pl-8">
                {/* Timeline node dot */}
                <div className="absolute -left-[9px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-950">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-blue-600">{m.year}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{m.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFRASTRUCTURE */}
        {activeTab === 'infra' && (
          <div className="grid gap-6 sm:grid-cols-2">
            {infrastructureAssets.map((asset, idx) => (
              <div key={idx} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow transition">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={asset.image} 
                    alt={asset.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{asset.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{asset.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADMINISTRATION */}
        {activeTab === 'admin' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adminProfiles.map((p, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="h-20 w-20 rounded-full object-cover shadow border border-slate-105 dark:border-slate-850"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-950 dark:text-white">{p.name}</h3>
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">{p.role}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{p.desc}"
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default About;
