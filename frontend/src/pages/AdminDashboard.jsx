import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api.js';
import { Users, BookOpen, Banknote, Bell, FileText, Check, X, ShieldAlert, Award, FileSpreadsheet, Briefcase, Settings, Landmark, ShieldCheck, MapPin, Book } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // States
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, admissions, students, payments, notices

  // Dynamic Notice creation state
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
  });
  const [noticeStatus, setNoticeStatus] = useState('');

  // Admin extra dashboard modules states
  const [facultiesList, setFacultiesList] = useState([]);
  const [facultyForm, setFacultyForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', department: 'Computer Science', qualification: '', salary: '', password: '' });
  const [facultyStatus, setFacultyStatus] = useState('');
  
  const [coursesList, setCoursesList] = useState([]);
  const [courseForm, setCourseForm] = useState({ name: '', code: '', duration: '3 Years', fees: '', seats: '', eligibility: '', subjects: '' });
  const [courseStatus, setCourseStatus] = useState('');

  const [jobDrives, setJobDrives] = useState([]);
  const [jobForm, setJobForm] = useState({ companyName: '', role: '', packageAmount: '', description: '', eligibility: '', driveDate: '' });
  const [jobStatus, setJobStatus] = useState('');

  const [systemInfo, setSystemInfo] = useState({ universityName: 'Metropolitan University', theme: 'Default Dark', gateway: 'Razorpay' });
  const [settingsStatus, setSettingsStatus] = useState('');

  // Fetch dashboard metrics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setStats(res.data.data);
      }

      // Fetch extras
      try {
        const teachRes = await api.get('/teachers');
        if (teachRes.data.success) {
          setFacultiesList(teachRes.data.data);
        }
        const courseRes = await api.get('/courses');
        if (courseRes.data.success) {
          setCoursesList(courseRes.data.data);
        }
        const jobRes = await api.get('/placements');
        if (jobRes.data.success) {
          setJobDrives(jobRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard extras', err);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/admission/${id}/approve`);
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to approve application');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.put(`/admission/${id}/reject`);
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to reject application');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', noticeForm);
      if (res.data.success) {
        setNoticeStatus('Notice published successfully!');
        setNoticeForm({ title: '', content: '', category: 'General', priority: 'Medium' });
        setTimeout(() => setNoticeStatus(''), 4000);
        fetchDashboardData();
      }
    } catch (err) {
      setNoticeStatus('Failed to publish notice.');
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    if (!facultyForm.firstName || !facultyForm.lastName || !facultyForm.email || !facultyForm.mobile || !facultyForm.qualification || !facultyForm.salary) {
      setFacultyStatus('All faculty fields are required.');
      return;
    }
    try {
      setFacultyStatus('Adding faculty...');
      const res = await api.post('/teachers', facultyForm);
      if (res.data.success) {
        setFacultyStatus('Faculty profile created successfully!');
        setFacultyForm({ firstName: '', lastName: '', email: '', mobile: '', department: 'Computer Science', qualification: '', salary: '', password: '' });
        fetchDashboardData();
        setTimeout(() => setFacultyStatus(''), 4000);
      }
    } catch (err) {
      setFacultyStatus(err.response?.data?.message || 'Failed to create faculty.');
      setTimeout(() => setFacultyStatus(''), 4000);
    }
  };

  const handleDeleteFaculty = async (id) => {
    try {
      setFacultyStatus('Deleting faculty...');
      const res = await api.delete(`/teachers/${id}`);
      if (res.data.success) {
        setFacultyStatus('Faculty profile deleted successfully!');
        fetchDashboardData();
        setTimeout(() => setFacultyStatus(''), 4000);
      }
    } catch (err) {
      setFacultyStatus('Failed to delete faculty.');
      setTimeout(() => setFacultyStatus(''), 4000);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code || !courseForm.fees || !courseForm.seats || !courseForm.eligibility) {
      setCourseStatus('All course fields are required.');
      return;
    }
    try {
      setCourseStatus('Creating course...');
      const subs = courseForm.subjects.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
      const payload = { ...courseForm, fees: Number(courseForm.fees), seats: Number(courseForm.seats), subjects: subs };

      const res = await api.post('/courses', payload);
      if (res.data.success) {
        setCourseStatus('Course created successfully!');
        setCourseForm({ name: '', code: '', duration: '3 Years', fees: '', seats: '', eligibility: '', subjects: '' });
        fetchDashboardData();
        setTimeout(() => setCourseStatus(''), 4000);
      }
    } catch (err) {
      setCourseStatus('Failed to create course.');
      setTimeout(() => setCourseStatus(''), 4000);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      setCourseStatus('Deleting course...');
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) {
        setCourseStatus('Course deleted successfully!');
        fetchDashboardData();
        setTimeout(() => setCourseStatus(''), 4000);
      }
    } catch (err) {
      setCourseStatus('Failed to delete course.');
      setTimeout(() => setCourseStatus(''), 4000);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobForm.companyName || !jobForm.role || !jobForm.packageAmount || !jobForm.driveDate || !jobForm.eligibility) {
      setJobStatus('All job placement fields are required.');
      return;
    }
    try {
      setJobStatus('Creating placement drive...');
      const res = await api.post('/placements', jobForm);
      if (res.data.success) {
        setJobStatus('Placement drive created successfully!');
        setJobForm({ companyName: '', role: '', packageAmount: '', description: '', eligibility: '', driveDate: '' });
        fetchDashboardData();
        setTimeout(() => setJobStatus(''), 4000);
      }
    } catch (err) {
      setJobStatus('Failed to create job drive.');
      setTimeout(() => setJobStatus(''), 4000);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      setJobStatus('Deleting job...');
      const res = await api.delete(`/placements/${id}`);
      if (res.data.success) {
        setJobStatus('Job drive deleted successfully!');
        fetchDashboardData();
        setTimeout(() => setJobStatus(''), 4005);
      }
    } catch (err) {
      setJobStatus('Failed to delete job drive.');
      setTimeout(() => setJobStatus(''), 4000);
    }
  };

  const handleUpdateApplicantStatus = async (driveId, studentId, newStatus) => {
    try {
      setJobStatus('Updating status...');
      const res = await api.put(`/placements/${driveId}/applicants/${studentId}`, { status: newStatus });
      if (res.data.success) {
        setJobStatus('Applicant status updated successfully!');
        fetchDashboardData();
        setTimeout(() => setJobStatus(''), 4000);
      }
    } catch (err) {
      setJobStatus('Failed to update status.');
      setTimeout(() => setJobStatus(''), 4000);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsStatus('Settings updated successfully!');
    setTimeout(() => setSettingsStatus(''), 4000);
  };

  const handleExportCSV = (type) => {
    let dataToExport = [];
    let headers = [];
    let filename = '';

    if (type === 'students') {
      filename = 'students_enrolled.csv';
      headers = ['Admission ID', 'Roll Number', 'Name', 'Email', 'Attendance'];
      dataToExport = recentPayments.map((p) => {
        const student = p.student;
        if (!student) return null;
        return [
          `ADM-${new Date().getFullYear()}-${student._id?.slice(-4)}`,
          student._id?.slice(-4).toUpperCase(),
          `${student.firstName} ${student.lastName}`,
          student.email,
          '87%'
        ];
      }).filter(Boolean);
    } else if (type === 'payments') {
      filename = 'payments_ledger.csv';
      headers = ['Receipt Number', 'Student Name', 'Fees Type', 'Amount', 'Method', 'Transaction ID'];
      dataToExport = recentPayments.map((p) => [
        p.receiptNumber,
        `${p.student?.firstName} ${p.student?.lastName}`,
        p.type,
        `₹${p.amount}`,
        p.method,
        p.transactionId
      ]);
    } else if (type === 'faculties') {
      filename = 'faculty_catalog.csv';
      headers = ['Name', 'Email', 'Mobile', 'Department', 'Qualification', 'Salary'];
      dataToExport = facultiesList.map((f) => [
        `${f.firstName} ${f.lastName}`,
        f.email,
        f.mobile,
        f.department,
        f.qualification,
        `₹${f.salary}`
      ]);
    }

    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of dataToExport) {
      csvRows.push(row.map(value => `"${value}"`).join(','));
    }
    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  const { totals, charts, recentPayments, recentRegistrations } = stats;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Sidebar Panel */}
      <aside className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2 h-fit">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h2 className="text-sm font-bold uppercase text-slate-400">Controls Panel</h2>
        </div>
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <Users className="h-4 w-4" /> },
          { id: 'admissions', label: 'Pending Admissions', icon: <FileText className="h-4 w-4" />, count: totals.totalPendingAdmissions },
          { id: 'students', label: 'Approved Students', icon: <Users className="h-4 w-4" />, count: totals.totalStudents },
          { id: 'faculties', label: 'Faculty Directory', icon: <ShieldCheck className="h-4 w-4" />, count: facultiesList.length },
          { id: 'courses', label: 'Course Planner', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'placements', label: 'Placement Drives', icon: <Briefcase className="h-4 w-4" /> },
          { id: 'payments', label: 'Payments History', icon: <Banknote className="h-4 w-4" /> },
          { id: 'services', label: 'Hostel & Transport', icon: <MapPin className="h-4 w-4" /> },
          { id: 'library', label: 'Library Tracker', icon: <Book className="h-4 w-4" /> },
          { id: 'notices', label: 'Publish Notices', icon: <Bell className="h-4 w-4" /> },
          { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
          { id: 'exports', label: 'Data Export Desk', icon: <FileSpreadsheet className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="lg:col-span-9 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total Enrolled', count: totals.totalStudents, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50 dark:bg-blue-950/20' },
                { label: 'Pending Forms', count: totals.totalPendingAdmissions, icon: <FileText className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50 dark:bg-amber-950/20' },
                { label: 'Supervising Staff', count: totals.totalTeachers, icon: <Award className="h-5 w-5 text-indigo-600" />, bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
                { label: 'Net Revenue', count: `₹${totals.totalRevenue.toLocaleString()}`, icon: <Banknote className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
              ].map((card, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">{card.label}</p>
                    <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{card.count}</h3>
                  </div>
                  <div className={`rounded-full p-3 ${card.bg}`}>
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Recharts Graphical Plots */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Bar Chart Course counts */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h4 className="font-bold text-sm text-slate-450 uppercase mb-4">Course Enrollments</h4>
                <div className="h-72 w-full">
                  {charts.courseStats.length === 0 ? (
                    <p className="text-xs text-slate-400 py-24 text-center">No active student data.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.courseStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="courseName" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Chart Category divisions */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h4 className="font-bold text-sm text-slate-450 uppercase mb-4">Student Category Splits</h4>
                <div className="h-72 w-full">
                  {charts.categoryStats.length === 0 ? (
                    <p className="text-xs text-slate-400 py-24 text-center">No category demographic records.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={charts.categoryStats}
                          dataKey="count"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={{ fontSize: 10 }}
                        >
                          {charts.categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Pending verifications preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-450 uppercase">Recent Admission Submissions</h4>
              {recentRegistrations.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No registrations waiting processing.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2.5">App Number</th>
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Course</th>
                        <th className="py-2.5 text-center">12th Marks</th>
                        <th className="py-2.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRegistrations.map((app) => (
                        <tr key={app._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                          <td className="py-3 font-semibold text-blue-600">{app.applicationNumber}</td>
                          <td className="py-3 font-medium">{app.firstName} {app.lastName}</td>
                          <td className="py-3 text-slate-500">{app.course?.name}</td>
                          <td className="py-3 text-center">{app.marks12th}%</td>
                          <td className="py-3 flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(app._id)}
                              className="rounded bg-emerald-500 p-1 text-white hover:bg-emerald-400"
                              title="Approve"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(app._id)}
                              className="rounded bg-red-500 p-1 text-white hover:bg-red-400"
                              title="Reject"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PENDING ADMISSIONS TAB */}
        {activeTab === 'admissions' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Document Verification Desk</h2>
            {recentRegistrations.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">All registrations processed!</p>
            ) : (
              <div className="space-y-6">
                {recentRegistrations.map((app) => (
                  <div key={app._id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-150 dark:border-slate-800 pb-3 gap-2">
                      <div>
                        <h3 className="font-bold text-base">{app.firstName} {app.lastName}</h3>
                        <p className="text-xs text-slate-500">App No: {app.applicationNumber} | DOB: {new Date(app.dob).toLocaleDateString()}</p>
                      </div>
                      <span className="rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 text-xs font-semibold">
                        {app.course?.name}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-650 dark:text-slate-350">
                      <p><strong>Father's Name:</strong> {app.fatherName}</p>
                      <p><strong>Mobile:</strong> {app.mobile}</p>
                      <p><strong>Category:</strong> {app.category}</p>
                      <p><strong>10th Score:</strong> {app.marks10th}%</p>
                      <p><strong>12th Score:</strong> {app.marks12th}%</p>
                      <p><strong>Address:</strong> {app.address}, {app.state}</p>
                    </div>

                    {/* Files links */}
                    <div className="flex flex-wrap gap-3 border-t border-b border-slate-100 dark:border-slate-850 py-3 text-xs">
                      <strong>Submitted Attachments:</strong>
                      <a href={app.documents?.aadhar} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Aadhar PDF</a>
                      <a href={app.documents?.marksheet} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">12th Certificate</a>
                      <a href={app.documents?.photo} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Student Photo</a>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleReject(app._id)}
                        className="rounded border border-red-500 px-4 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        Reject Form
                      </button>
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="rounded bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                      >
                        Approve & Issue ID Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPROVED STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Approved Enrolled Catalog</h2>
            {/* Catalog search/lookups */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Admission Number</th>
                    <th className="py-2.5">Roll Number</th>
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Course</th>
                    <th className="py-2.5">Email ID</th>
                    <th className="py-2.5">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-slate-450">No students found.</td>
                    </tr>
                  ) : (
                    // We simulate approved list for demo since payments populate
                    recentPayments.map((p) => {
                      const student = p.student;
                      if (!student) return null;
                      return (
                        <tr key={student._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                          <td className="py-3 font-semibold">ADM-{new Date().getFullYear()}-{student._id?.slice(-4)}</td>
                          <td className="py-3 text-blue-600 font-semibold">{student._id?.slice(-4).toUpperCase()}</td>
                          <td className="py-3 font-medium">{student.firstName} {student.lastName}</td>
                          <td className="py-3 text-slate-500">{student.course?.name || 'BCA'}</td>
                          <td className="py-3">{student.email}</td>
                          <td className="py-3 text-emerald-500 font-semibold">87%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS HISTORY TAB */}
        {activeTab === 'payments' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Ledger Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Receipt Number</th>
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Fees Type</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Method</th>
                    <th className="py-2.5">TXN ID</th>
                    <th className="py-2.5 text-center">Receipt PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-slate-450">No transactions recorded.</td>
                    </tr>
                  ) : (
                    recentPayments.map((p) => (
                      <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                        <td className="py-3 font-semibold">{p.receiptNumber}</td>
                        <td className="py-3 font-medium">{p.student?.firstName} {p.student?.lastName}</td>
                        <td className="py-3 text-slate-500">{p.type}</td>
                        <td className="py-3 font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                        <td className="py-3">{p.method}</td>
                        <td className="py-3 text-slate-500">{p.transactionId}</td>
                        <td className="py-3 text-center">
                          <a
                            href={`http://localhost:5000/api/payments/${p._id}/receipt`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-slate-800 px-2 py-1 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
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
        )}

        {/* NOTICES PUBLISHER TAB */}
        {activeTab === 'notices' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Publish Academic Notices</h2>
            {noticeStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${noticeStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {noticeStatus}
              </div>
            )}
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Notice Title</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Hostels Reopening Schedule"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>General</option>
                    <option>Exam</option>
                    <option>Placement</option>
                    <option>Admission</option>
                    <option>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Content Body</label>
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Enter detailed notice specifications here..."
                  rows="5"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-md"
              >
                Publish Live Notice
              </button>
            </form>
          </div>
        )}

        {/* FACULTY DIRECTORY TAB */}
        {activeTab === 'faculties' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Faculty Catalog Directory</h2>
            {facultyStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20`}>
                {facultyStatus}
              </div>
            )}

            <form onSubmit={handleCreateFaculty} className="grid gap-4 sm:grid-cols-2 border-b pb-6 border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  value={facultyForm.firstName}
                  onChange={(e) => setFacultyForm({ ...facultyForm, firstName: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  value={facultyForm.lastName}
                  onChange={(e) => setFacultyForm({ ...facultyForm, lastName: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Academic Email</label>
                <input
                  type="email"
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mobile Contact</label>
                <input
                  type="text"
                  value={facultyForm.mobile}
                  onChange={(e) => setFacultyForm({ ...facultyForm, mobile: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Department</label>
                <select
                  value={facultyForm.department}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option>Computer Science</option>
                  <option>Management</option>
                  <option>Commerce</option>
                  <option>Science</option>
                  <option>Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Qualifications</label>
                <input
                  type="text"
                  value={facultyForm.qualification}
                  onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                  placeholder="e.g. Ph.D. in Computer Science"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Monthly Salary (INR)</label>
                <input
                  type="number"
                  value={facultyForm.salary}
                  onChange={(e) => setFacultyForm({ ...facultyForm, salary: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Portal Access Password</label>
                <input
                  type="password"
                  value={facultyForm.password}
                  onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                  placeholder="Leave blank for auto-generate"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Create Faculty Member
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-455 uppercase">Onboarded Faculty Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5">qualification</th>
                      <th className="py-2.5">Salary</th>
                      <th className="py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultiesList.map((f) => (
                      <tr key={f._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                        <td className="py-3 font-semibold">{f.firstName} {f.lastName}</td>
                        <td className="py-3">{f.email}</td>
                        <td className="py-3">{f.department}</td>
                        <td className="py-3">{f.qualification}</td>
                        <td className="py-3">₹{f.salary?.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleDeleteFaculty(f._id)}
                            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-400 text-[10px] font-bold"
                          >
                            Delete Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COURSE PLANNER TAB */}
        {activeTab === 'courses' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Institutional Course & Department Planner</h2>
            {courseStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20`}>
                {courseStatus}
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="grid gap-4 sm:grid-cols-2 border-b pb-6 border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Course Name</label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g. Master of Computer Applications"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Course Code</label>
                <input
                  type="text"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  placeholder="e.g. MCA"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Duration</label>
                <select
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>4 Years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Annual Tuition Fees (INR)</label>
                <input
                  type="number"
                  value={courseForm.fees}
                  onChange={(e) => setCourseForm({ ...courseForm, fees: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Intake Seats</label>
                <input
                  type="number"
                  value={courseForm.seats}
                  onChange={(e) => setCourseForm({ ...courseForm, seats: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={courseForm.eligibility}
                  onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })}
                  placeholder="e.g. BCA/B.Sc. in Computer Science with 50% marks"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Core Subjects (Comma-separated)</label>
                <input
                  type="text"
                  value={courseForm.subjects}
                  onChange={(e) => setCourseForm({ ...courseForm, subjects: e.target.value })}
                  placeholder="e.g. Java Programming, Data Structures, Software Engineering"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Publish Course Profile
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-455 uppercase">Active Courses Catalog</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {coursesList.map((course) => (
                  <div key={course._id} className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          {course.code}
                        </span>
                        <span className="text-[10px] text-slate-400">Seats: {course.seats}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2.5">{course.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Duration: {course.duration} | Tuition Fees: ₹{course.fees?.toLocaleString()}/Yr</p>
                    </div>
                    <div className="border-t border-slate-200/50 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Eligibility: {course.eligibility}</span>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-red-500 hover:text-red-400 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PLACEMENT COORDINATOR TAB */}
        {activeTab === 'placements' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Corporate Recruitment Drive Desk</h2>
            {jobStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20`}>
                {jobStatus}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="grid gap-4 sm:grid-cols-2 border-b pb-6 border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  value={jobForm.companyName}
                  onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                  placeholder="e.g. Google India"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Recruitment Role</label>
                <input
                  type="text"
                  value={jobForm.role}
                  onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                  placeholder="e.g. Software Engineer (L3)"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">compensation Package (LPA)</label>
                <input
                  type="number"
                  value={jobForm.packageAmount}
                  onChange={(e) => setJobForm({ ...jobForm, packageAmount: e.target.value })}
                  placeholder="e.g. 24"
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Drive Date</label>
                <input
                  type="date"
                  value={jobForm.driveDate}
                  onChange={(e) => setJobForm({ ...jobForm, driveDate: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Eligibility Requirements</label>
                <input
                  type="text"
                  value={jobForm.eligibility}
                  onChange={(e) => setJobForm({ ...jobForm, eligibility: e.target.value })}
                  placeholder="e.g. CS streams only. Minimum CGPA of 8.0 with no standing backlogs."
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Job Specifications Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Enter details about rounds and timelines..."
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Schedule Placement Drive
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-455 uppercase">Active Job Drives & Candidates</h3>
              <div className="space-y-4">
                {jobDrives.map((drive) => (
                  <div key={drive._id} className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{drive.companyName}</h4>
                        <p className="text-xs text-slate-500 font-semibold">{drive.role} | Drive Date: {new Date(drive.driveDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-50 text-emerald-600 px-2.5 py-0.5 text-xs font-bold">
                          ₹{drive.packageAmount} LPA
                        </span>
                        <button
                          onClick={() => handleDeleteJob(drive._id)}
                          className="text-red-500 hover:text-red-400 text-xs font-bold"
                        >
                          Cancel Drive
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Applicants Registry</p>
                      {(!drive.applicants || drive.applicants.length === 0) ? (
                        <p className="text-[11px] text-slate-400 italic">No candidates registered for this drive yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {drive.applicants.map((applicant, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded">
                              <div>
                                <span className="font-bold text-slate-850 dark:text-slate-100">
                                  {applicant.student?.firstName || 'Student'} {applicant.student?.lastName || applicant.student}
                                </span>
                                <span className="text-[10px] text-slate-450 ml-2 font-mono">{applicant.student?.rollNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 uppercase font-semibold">Status: {applicant.status}</span>
                                {['Selected', 'Rejected'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleUpdateApplicantStatus(drive._id, applicant.student?._id || applicant.student, status)}
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${status === 'Selected' ? 'bg-emerald-600' : 'bg-red-500'}`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOSTEL & TRANSPORT TAB */}
        {activeTab === 'services' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Hostel & Route Transport Allocation Registry</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify student residential housing arrangements, dining hall subscriptions, and bus transport routing schedules.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Hostel Allocations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Aman Yadav', room: 'Block A - 402 (Double Sharing)', status: 'Active' },
                    { name: 'Sneha Sharma', room: 'Block B - 105 (Single AC)', status: 'Active' },
                  ].map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded">
                      <div>
                        <p className="font-bold text-slate-850 dark:text-slate-100">{h.name}</p>
                        <p className="text-slate-500 mt-1">{h.room}</p>
                      </div>
                      <span className="rounded bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Transport Route Registry</h3>
                <div className="space-y-3">
                  {[
                    { route: 'Route 4: Dwarka to Campus', timing: '07:30 AM Departure', driver: 'Gurpreet Singh (+91-98745)' },
                    { route: 'Route 12: Noida Sector 62 to Campus', timing: '07:15 AM Departure', driver: 'Raju Kumar (+91-95689)' },
                  ].map((r, idx) => (
                    <div key={idx} className="text-xs bg-slate-50 dark:bg-slate-955 p-3 rounded space-y-1">
                      <p className="font-bold text-slate-850 dark:text-slate-150">{r.route}</p>
                      <p className="text-slate-500">{r.timing}</p>
                      <p className="text-[10px] text-blue-500 font-semibold">{r.driver}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY TRACKER TAB */}
        {activeTab === 'library' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Library Book Issuance registry</h2>
            <p className="text-xs text-slate-500">
              Audit the catalog of books currently issued out to students and monitor fine statuses for overdue returns.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5">Book Title</th>
                    <th className="py-2.5">Author</th>
                    <th className="py-2.5">Borrower</th>
                    <th className="py-2.5">Due Date</th>
                    <th className="py-2.5">Fine Accrued</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Introduction to Algorithms', author: 'Cormen et al.', borrower: 'Aman Yadav (Roll: 104)', due: '14 July 2026', fine: '₹0', status: 'Issued' },
                    { title: 'Database System Concepts', author: 'Korth et al.', borrower: 'Rahul Verma (Roll: 110)', due: '01 July 2026', fine: '₹120', status: 'Overdue' },
                  ].map((book, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-3 font-semibold">{book.title}</td>
                      <td className="py-3">{book.author}</td>
                      <td className="py-3">{book.borrower}</td>
                      <td className="py-3 font-mono">{book.due}</td>
                      <td className={`py-3 font-bold ${book.fine !== '₹0' ? 'text-red-500' : 'text-slate-500'}`}>{book.fine}</td>
                      <td className="py-3 text-center">
                        <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                          book.status === 'Overdue' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">University Portal Configuration Desk</h2>
            {settingsStatus && (
              <div className="rounded-lg bg-emerald-50 text-emerald-600 p-4 text-xs font-semibold">
                {settingsStatus}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">University Name (Banner)</label>
                <input
                  type="text"
                  value={systemInfo.universityName}
                  onChange={(e) => setSystemInfo({ ...systemInfo, universityName: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Portal UI Theme Style</label>
                <select
                  value={systemInfo.theme}
                  onChange={(e) => setSystemInfo({ ...systemInfo, theme: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option>Default Dark Theme</option>
                  <option>Slate Classic Light</option>
                  <option>Deep Blue Glassmorphism</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Payment Gateway Mode</label>
                <select
                  value={systemInfo.gateway}
                  onChange={(e) => setSystemInfo({ ...systemInfo, gateway: e.target.value })}
                  className="w-full rounded border dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option>Razorpay API Sandbox</option>
                  <option>Stripe Gateway Live</option>
                  <option>Offline Bank Draft Desk Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
              >
                Save System Configs
              </button>
            </form>
          </div>
        )}

        {/* DATA EXPORT DESK TAB */}
        {activeTab === 'exports' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Data Archival & Export Console</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export database collection registries into standardized CSV spreadsheet files for administrative report generation.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: 'Approved Students Catalog', desc: 'Roll numbers, names, departments, emails, and biometric attendance tallies.', type: 'students' },
                { title: 'payments & Ledger Receipts', desc: 'Receipt reference numbers, student records, fee categories, amounts, and transaction IDs.', type: 'payments' },
                { title: 'Faculty & Salaries Directory', desc: 'Detailed qualifications, basic pay slip break-ups, email listings, and phone numbers.', type: 'faculties' },
              ].map((card, idx) => (
                <div key={idx} className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm">{card.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{card.desc}</p>
                  </div>
                  <button
                    onClick={() => handleExportCSV(card.type)}
                    className="rounded bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500 flex items-center justify-center gap-1.5 shadow"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Download CSV
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
