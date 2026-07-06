import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../redux/slices/courseSlice.js';
import { GraduationCap, Clock, Banknote, Users, CheckCircle2, Building, ChevronRight } from 'lucide-react';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => dispatch(fetchCourses())}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight">Offered Academic Programs</h1>
        <p className="text-sm text-slate-500">Explore undergraduate and postgraduate degrees with industrial placements.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course._id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden hover:shadow-md transition">
            {/* Header branding */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-6 text-white">
              <span className="rounded bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-200">
                {course.code}
              </span>
              <h2 className="mt-3 text-xl font-bold">{course.name}</h2>
            </div>

            {/* Info Grid */}
            <div className="p-6 flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{course.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Academic Fee</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">₹{course.fees.toLocaleString()}/year</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Seats</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{course.seats} (Left: {course.availableSeats})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                    <p className={`text-sm font-bold ${course.admissionStatus === 'Open' ? 'text-emerald-500' : 'text-red-500'}`}>
                      Admissions {course.admissionStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border dark:border-slate-850">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Eligibility Criteria</p>
                <p className="mt-1 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                  {course.eligibility}
                </p>
              </div>

              {/* Core Subjects */}
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Key Core Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {course.subjects.map((sub, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-slate-750 dark:text-slate-300">
                      <CheckCircle2 className="h-3 w-3 text-blue-500" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Placements */}
              {course.placement && course.placement.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Recent Placements</p>
                  <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span>Hiring partners: {course.placement.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-150 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
              {course.admissionStatus === 'Open' ? (
                <Link
                  to={`/admission?courseId=${course._id}`}
                  className="w-full flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Apply Online Now <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full rounded bg-slate-200 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
                >
                  Admission Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
