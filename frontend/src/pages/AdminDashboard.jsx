import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api.js';
import { Users, BookOpen, Banknote, Bell, FileText, Check, X, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

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

  // Fetch dashboard metrics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/admin');
      if (res.data.success) {
        setStats(res.data.data);
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
          { id: 'payments', label: 'Payments History', icon: <Banknote className="h-4 w-4" /> },
          { id: 'notices', label: 'Publish Notices', icon: <Bell className="h-4 w-4" /> },
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
      </main>
    </div>
  );
};

export default AdminDashboard;
