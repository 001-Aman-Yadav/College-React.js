import React, { useState } from 'react';
import { FileDown, Search, FileText } from 'lucide-react';

const Downloads = () => {
  const [query, setQuery] = useState('');

  const documents = [
    { name: 'University Prospectus 2026-27', type: 'PDF Document', size: '4.8 MB', link: '/uploads/mock_pdf.pdf' },
    { name: 'Academic Calendar - Odd Semester (2026)', type: 'PDF Document', size: '1.2 MB', link: '/uploads/mock_pdf.pdf' },
    { name: 'BCA Course Curriculum & Detailed Syllabus', type: 'PDF Document', size: '2.5 MB', link: '/uploads/mock_pdf.pdf' },
    { name: 'BTech CSE Course Curriculum & Detailed Syllabus', type: 'PDF Document', size: '3.1 MB', link: '/uploads/mock_pdf.pdf' },
    { name: 'MBA Program Handbook & Elective Lists', type: 'PDF Document', size: '1.8 MB', link: '/uploads/mock_pdf.pdf' },
    { name: 'Scholarship Application Form 2026', type: 'Word Document', size: '420 KB', link: '/uploads/mock_pdf.pdf' },
    { name: 'Anti-Ragging Affidavits & Undertaking Form', type: 'PDF Document', size: '850 KB', link: '/uploads/mock_pdf.pdf' },
    { name: 'Hostel Registration Guidelines & Mess Rules', type: 'PDF Document', size: '1.1 MB', link: '/uploads/mock_pdf.pdf' }
  ];

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent)]" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Student Downloads Center</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300 text-sm sm:text-base">
          Access official university curriculum PDFs, schedules, registration forms, and regulatory guidelines.
        </p>
      </section>

      {/* Search Console */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prospectus, syllabus, calendars..."
          className="w-full rounded-xl border border-slate-305 dark:border-slate-750 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 shadow-sm"
        />
      </div>

      {/* Downloads Catalog Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 sm:p-5">Document Name</th>
                <th className="p-4 sm:p-5">File Type</th>
                <th className="p-4 sm:p-5">File Size</th>
                <th className="p-4 sm:p-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">
                    No files found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, idx) => (
                  <tr key={idx} className="border-b border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                    <td className="p-4 sm:p-5 font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-850 dark:text-slate-200">{doc.name}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">{doc.type}</td>
                    <td className="p-4 sm:p-5 text-slate-500">{doc.size}</td>
                    <td className="p-4 sm:p-5 text-center">
                      <a
                        href={doc.link}
                        download
                        className="inline-flex items-center gap-1.5 rounded bg-blue-50 dark:bg-slate-805 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
