import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, BookOpen, Clock, Banknote, Bell, FileText, Check, X, ShieldAlert, Award, FileSpreadsheet,
  User, CheckCircle, MapPin, Calendar, HelpCircle, GraduationCap, ChevronRight, Lock, Book,
  CreditCard, Compass, CheckSquare, MessageSquare, AlertCircle, FileCheck, CheckCircle2, ChevronDown, ListTodo,
  TrendingUp, ClipboardList, PenTool, Inbox, Landmark, LogOut
} from 'lucide-react';
import api from '../services/api.js';

const FacultyDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // States
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: boolean }
  const [attendanceStatus, setAttendanceStatus] = useState('');

  // Marks Entry Form state
  const [marksForm, setMarksForm] = useState({
    studentId: '',
    semester: '1',
    gpa: '',
    sub1Name: 'Web Programming',
    sub1Marks: '',
    sub2Name: 'Data Structures',
    sub2Marks: '',
    sub3Name: 'Database Management',
    sub3Marks: ''
  });
  const [marksStatus, setMarksStatus] = useState('');

  // Leave Form state
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [leaveStatus, setLeaveStatus] = useState('');
  const [facultyLeaves, setFacultyLeaves] = useState([
    { startDate: '2026-04-10', endDate: '2026-04-12', reason: 'Attending Research Conference', status: 'Approved' }
  ]);

  // Assignments state
  const [assignmentForm, setAssignmentForm] = useState({ title: '', subject: '', dueDate: '', instructions: '' });
  const [assignmentStatus, setAssignmentStatus] = useState('');
  const [postedAssignments, setPostedAssignments] = useState([
    { title: 'Redux State Management Lab', subject: 'Web Programming', dueDate: '2026-07-20', instructions: 'Implement slices and configure store for user models.' },
    { title: 'PostgreSQL JSONB Queries Practice', subject: 'Database Management', dueDate: '2026-07-22', instructions: 'Write query blocks using ->> operator and create index mappings.' }
  ]);

  // Study Materials, Salary Slips, and Settings states
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [materialForm, setMaterialForm] = useState({ title: '', courseId: '', subject: '', description: '', fileUrl: '/uploads/mock_pdf.pdf' });
  const [materialStatus, setMaterialStatus] = useState('');
  const [salarySlips, setSalarySlips] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState('');
  const [printSlip, setPrintSlip] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teacher profile
      const profRes = await api.get('/teachers/profile');
      if (profRes.data.success) {
        setProfile(profRes.data.data);
      }

      // Fetch teacher students
      const studRes = await api.get('/teachers/students');
      if (studRes.data.success) {
        setStudents(studRes.data.data);
        
        // Initialize attendance logs (default all Present)
        const initialAtt = {};
        studRes.data.data.forEach((s) => {
          initialAtt[s._id] = true;
        });
        setAttendanceRecords(initialAtt);
      }

      // Fetch extra data for dashboard tabs
      try {
        const matRes = await api.get('/teachers/study-materials');
        if (matRes.data.success) {
          setUploadedMaterials(matRes.data.data);
        }
        const courseRes = await api.get('/courses');
        if (courseRes.data.success) {
          setCoursesList(courseRes.data.data);
          if (courseRes.data.data.length > 0) {
            setMaterialForm((prev) => ({ ...prev, courseId: courseRes.data.data[0]._id }));
          }
        }
        const slipRes = await api.get('/teachers/salary-slips');
        if (slipRes.data.success) {
          setSalarySlips(slipRes.data.data);
        }
      } catch (e) {
        console.error('Failed to load faculty dashboard extras:', e.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch faculty details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    try {
      setAttendanceStatus('Recording attendance...');
      const records = Object.keys(attendanceRecords).map((sid) => ({
        studentId: sid,
        present: attendanceRecords[sid]
      }));

      const res = await api.post('/teachers/attendance', { attendanceRecords: records });
      if (res.data.success) {
        setAttendanceStatus('Attendance logs recorded and saved successfully!');
        fetchData();
        setTimeout(() => setAttendanceStatus(''), 4000);
      }
    } catch (err) {
      setAttendanceStatus('Failed to record attendance.');
    }
  };

  const handleUploadMarks = async (e) => {
    e.preventDefault();
    const { studentId, semester, gpa, sub1Name, sub1Marks, sub2Name, sub2Marks, sub3Name, sub3Marks } = marksForm;
    if (!studentId || !gpa || !sub1Marks || !sub2Marks || !sub3Marks) {
      setMarksStatus('Please fill in all grade marks.');
      return;
    }

    try {
      setMarksStatus('Submitting grade card...');
      const subjects = [
        { subjectName: sub1Name, marksObtained: Number(sub1Marks), maxMarks: 100, grade: Number(sub1Marks) >= 90 ? 'A+' : Number(sub1Marks) >= 80 ? 'A' : 'B' },
        { subjectName: sub2Name, marksObtained: Number(sub2Marks), maxMarks: 100, grade: Number(sub2Marks) >= 90 ? 'A+' : Number(sub2Marks) >= 80 ? 'A' : 'B' },
        { subjectName: sub3Name, marksObtained: Number(sub3Marks), maxMarks: 100, grade: Number(sub3Marks) >= 90 ? 'A+' : Number(sub3Marks) >= 80 ? 'A' : 'B' },
      ];

      const res = await api.post('/teachers/enter-marks', {
        studentId,
        semester,
        gpa,
        subjects
      });

      if (res.data.success) {
        setMarksStatus('Student Grade Card generated successfully!');
        setMarksForm({
          studentId: '',
          semester: '1',
          gpa: '',
          sub1Name: 'Web Programming',
          sub1Marks: '',
          sub2Name: 'Data Structures',
          sub2Marks: '',
          sub3Name: 'Database Management',
          sub3Marks: ''
        });
        fetchData();
        setTimeout(() => setMarksStatus(''), 4000);
      }
    } catch (err) {
      setMarksStatus('Failed to upload grades.');
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      setLeaveStatus('Please fill in leave dates.');
      return;
    }
    setFacultyLeaves([...facultyLeaves, { ...leaveForm, status: 'Pending' }]);
    setLeaveStatus('Leave submitted successfully!');
    setLeaveForm({ startDate: '', endDate: '', reason: '' });
    setTimeout(() => setLeaveStatus(''), 4000);
  };

  const handlePostAssignment = (e) => {
    e.preventDefault();
    if (!assignmentForm.title || !assignmentForm.subject || !assignmentForm.dueDate) {
      setAssignmentStatus('All assignment parameters required.');
      return;
    }
    setPostedAssignments([...postedAssignments, assignmentForm]);
    setAssignmentStatus('Assignment posted successfully to student boards!');
    setAssignmentForm({ title: '', subject: '', dueDate: '', instructions: '' });
    setTimeout(() => setAssignmentStatus(''), 4000);
  };

  const handleUploadNotes = async (e) => {
    e.preventDefault();
    if (!materialForm.title || !materialForm.courseId || !materialForm.subject) {
      setMaterialStatus('Please provide title, course, and subject.');
      return;
    }
    try {
      setMaterialStatus('Uploading study notes...');
      const res = await api.post('/teachers/study-materials', materialForm);
      if (res.data.success) {
        setMaterialStatus('Study notes uploaded and published successfully!');
        setMaterialForm({ title: '', courseId: coursesList[0]?._id || '', subject: '', description: '', fileUrl: '/uploads/mock_pdf.pdf' });
        fetchData();
        setTimeout(() => setMaterialStatus(''), 4000);
      }
    } catch (err) {
      setMaterialStatus('Failed to upload study notes.');
      setTimeout(() => setMaterialStatus(''), 4000);
    }
  };

  const handleDeleteNotes = async (matId) => {
    try {
      setMaterialStatus('Deleting notes...');
      const res = await api.delete(`/teachers/study-materials/${matId}`);
      if (res.data.success) {
        setMaterialStatus('Notes deleted successfully!');
        fetchData();
        setTimeout(() => setMaterialStatus(''), 4000);
      }
    } catch (err) {
      setMaterialStatus('Failed to delete notes.');
      setTimeout(() => setMaterialStatus(''), 4000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus('New password must be at least 6 characters.');
      return;
    }
    try {
      setPasswordStatus('Updating password...');
      const res = await api.put('/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data.success) {
        setPasswordStatus('Password changed successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '' });
        setTimeout(() => setPasswordStatus(''), 4000);
      }
    } catch (err) {
      setPasswordStatus('Failed to change password. Verify old credentials.');
      setTimeout(() => setPasswordStatus(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-red-500 font-semibold">
        {error || 'Faculty profile could not be verified. Contact administrator.'}
      </div>
    );
  }

  const { firstName, lastName, department, qualification, salaryStatus, leaveBalance } = profile;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Sidebar Control Panel */}
      <aside className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2 h-fit">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-3">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">Prof. {firstName} {lastName}</h3>
            <p className="text-[10px] text-slate-455 uppercase font-bold mt-0.5">{department}</p>
          </div>
        </div>

        {[
          { id: 'overview', label: 'Faculty Hub', icon: <Compass className="h-4 w-4" /> },
          { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" /> },
          { id: 'students', label: 'Student Catalog', icon: <Users className="h-4 w-4" /> },
          { id: 'attendance', label: 'Record Attendance', icon: <CheckSquare className="h-4 w-4" /> },
          { id: 'marks', label: 'Marks Grading', icon: <PenTool className="h-4 w-4" /> },
          { id: 'assignments', label: 'Post Homework', icon: <ClipboardList className="h-4 w-4" /> },
          { id: 'materials', label: 'Upload Study Notes', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'salary', label: 'Faculty Salary Slips', icon: <Landmark className="h-4 w-4" /> },
          { id: 'leaves', label: 'Casual Leaves', icon: <Calendar className="h-4 w-4" /> },
          { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-805'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </aside>

      {/* Main Action Area */}
      <main className="lg:col-span-9 space-y-8">
        
        {/* FACULTY HUB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Students Assigned</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{students.length} Students</h3>
                </div>
                <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Salary Status</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{salaryStatus}</h3>
                </div>
                <div className="rounded-full p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                  <Banknote className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Leave Balance</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{leaveBalance} Days</h3>
                </div>
                <div className="rounded-full p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Home Tasks</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{postedAssignments.length} Posted</h3>
                </div>
                <div className="rounded-full p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Quick overview of latest notices */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-450 uppercase">Faculty Circular Board</h3>
              <div className="space-y-3 text-xs text-slate-500">
                <div className="flex gap-2 items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <p><strong>[High Priority]</strong> Submit Internal Assessment Marks sheets by Friday evening.</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  <p><strong>[General]</strong> Faculty development workshop scheduled on NAAC criteria metrics this Wednesday.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Teacher Profile details
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Full Name</p>
                <p className="font-semibold text-slate-850 dark:text-slate-250 mt-1">Prof. {firstName} {lastName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Academic Department</p>
                <p className="font-semibold text-slate-850 dark:text-slate-250 mt-1">{department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Educational Qualification</p>
                <p className="font-semibold text-slate-850 dark:text-slate-250 mt-1">{qualification}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Assigned Subjects / Papers</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(profile.subjects && profile.subjects.length > 0 ? profile.subjects : ['Web Programming', 'Database Management', 'Cloud Computing']).map((sub, idx) => (
                    <span key={idx} className="rounded bg-slate-100 dark:bg-slate-805 px-2 py-0.5 text-xs text-slate-650 dark:text-slate-350">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Registered Mobile</p>
                <p className="font-semibold text-slate-850 dark:text-slate-250 mt-1">{profile.mobile}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Registered Email</p>
                <p className="font-semibold text-slate-850 dark:text-slate-250 mt-1">{profile.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT CATALOG */}
        {activeTab === 'students' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Approved Enrolled Catalog</h2>
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
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-slate-450">No students enrolled.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850">
                        <td className="py-3 font-semibold">ADM-{new Date().getFullYear()}-{student._id?.slice(-4)}</td>
                        <td className="py-3 text-blue-600 font-semibold">{student.rollNumber || student._id?.slice(-4).toUpperCase()}</td>
                        <td className="py-3 font-medium">{student.firstName} {student.lastName}</td>
                        <td className="py-3 text-slate-500">{student.course?.name || 'BCA'}</td>
                        <td className="py-3">{student.email}</td>
                        <td className="py-3 text-emerald-500 font-semibold">{student.attendance || 85}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECORD ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Daily Lectures Attendance Desk
            </h2>

            {attendanceStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${attendanceStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {attendanceStatus}
              </div>
            )}

            <form onSubmit={handleSubmitAttendance} className="space-y-6">
              <div className="max-w-xs">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lecture Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Roll Number</th>
                      <th className="py-2.5">Student Name</th>
                      <th className="py-2.5">Current Attendance</th>
                      <th className="py-2.5 text-center">Status (Check if Present)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-slate-450">No students found.</td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50">
                          <td className="py-3 font-semibold text-blue-600">{student.rollNumber || student._id?.slice(-4).toUpperCase()}</td>
                          <td className="py-3 font-medium">{student.firstName} {student.lastName}</td>
                          <td className="py-3 text-slate-500">{student.attendance || 85}%</td>
                          <td className="py-3 flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={attendanceRecords[student._id] || false}
                              onChange={() => handleCheckboxChange(student._id)}
                              className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {students.length > 0 && (
                <div className="flex justify-end pt-4 border-t dark:border-slate-800">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                  >
                    Save Attendance Logs
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* MARKS GRADING */}
        {activeTab === 'marks' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PenTool className="h-5 w-5 text-blue-600" />
              Upload Student Terminal Grades
            </h2>

            {marksStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${marksStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {marksStatus}
              </div>
            )}

            <form onSubmit={handleUploadMarks} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Student</label>
                  <select
                    value={marksForm.studentId}
                    onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.firstName} {s.lastName} ({s.rollNumber || s._id?.slice(-4).toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Semester</label>
                  <select
                    value={marksForm.semester}
                    onChange={(e) => setMarksForm({ ...marksForm, semester: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">GPA (Semester SGPA)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={marksForm.gpa}
                    onChange={(e) => setMarksForm({ ...marksForm, gpa: e.target.value })}
                    placeholder="e.g. 8.45"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              {/* Subject Marks block */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-450 uppercase">Subject Marks Details (Max Marks: 100)</h3>
                
                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Subject 1 Name</label>
                    <input type="text" value={marksForm.sub1Name} className="w-full rounded border bg-slate-50 dark:bg-slate-955 px-3 py-2 text-xs focus:outline-none" disabled />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      max="100"
                      value={marksForm.sub1Marks}
                      onChange={(e) => setMarksForm({ ...marksForm, sub1Marks: e.target.value })}
                      placeholder="0-100"
                      className="w-full rounded border border-slate-355 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 bg-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Subject 2 Name</label>
                    <input type="text" value={marksForm.sub2Name} className="w-full rounded border bg-slate-50 dark:bg-slate-955 px-3 py-2 text-xs focus:outline-none" disabled />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      max="100"
                      value={marksForm.sub2Marks}
                      onChange={(e) => setMarksForm({ ...marksForm, sub2Marks: e.target.value })}
                      placeholder="0-100"
                      className="w-full rounded border border-slate-355 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 bg-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Subject 3 Name</label>
                    <input type="text" value={marksForm.sub3Name} className="w-full rounded border bg-slate-50 dark:bg-slate-955 px-3 py-2 text-xs focus:outline-none" disabled />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      max="100"
                      value={marksForm.sub3Marks}
                      onChange={(e) => setMarksForm({ ...marksForm, sub3Marks: e.target.value })}
                      placeholder="0-100"
                      className="w-full rounded border border-slate-355 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 bg-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t dark:border-slate-800">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Submit Grades Paper
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POST ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              Post Student Homework Assignments
            </h2>

            {assignmentStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${assignmentStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {assignmentStatus}
              </div>
            )}

            <form onSubmit={handlePostAssignment} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Assignment Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    placeholder="e.g. Dynamic Router configurations task"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Due Date</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Course / Subject</label>
                  <select
                    value={assignmentForm.subject}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>Web Programming</option>
                    <option>Database Management</option>
                    <option>Data Structures</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Detailed Instructions</label>
                  <textarea
                    value={assignmentForm.instructions}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                    placeholder="Detail the scope of assignment tasks..."
                    rows="3"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Publish Homework
                </button>
              </div>
            </form>

            {/* List posted assignments */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Assignments Posted</h3>
              <div className="space-y-4">
                {postedAssignments.map((a, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-blue-600">{a.subject}</span>
                      <span className="font-semibold text-slate-500">Due Date: {new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{a.title}</h4>
                    <p className="text-slate-500">{a.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASUAL LEAVES TRACKER */}
        {activeTab === 'leaves' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Faculty Casual Leave Applications
            </h2>

            {leaveStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${leaveStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {leaveStatus}
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Leave Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Leave End Date</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason for Absence</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Detail your request..."
                  rows="3"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  File Leave Application
                </button>
              </div>
            </form>

            {/* Leave history */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Leaves History Log</h3>
              <div className="space-y-4">
                {facultyLeaves.map((l, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-slate-200">
                        Duration: {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-slate-500 mt-1">Reason: {l.reason}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 font-bold uppercase ${
                      l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD STUDY NOTES */}
        {activeTab === 'materials' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Syllabus Study Materials Publisher
            </h2>

            {materialStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20`}>
                {materialStatus}
              </div>
            )}

            <form onSubmit={handleUploadNotes} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Notes Title</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="e.g. Lecture 4: Redux Actions & Slices"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={materialForm.subject}
                    onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Course Stream</label>
                  <select
                    value={materialForm.courseId}
                    onChange={(e) => setMaterialForm({ ...materialForm, courseId: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  >
                    {coursesList.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Syllabus PDF File Content (Mock URL)</label>
                  <input
                    type="text"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Syllabus Description / Notes specifications</label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  placeholder="Detail notes summary guidelines..."
                  rows="3"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Publish Lecture Notes
                </button>
              </div>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Your Published Study Materials</h3>
              <div className="space-y-4">
                {uploadedMaterials.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No study materials published by you yet.</p>
                ) : (
                  uploadedMaterials.map((mat) => (
                    <div key={mat._id} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{mat.title}</h4>
                        <p className="text-slate-500 mt-1">Subject: {mat.subject} | File: {mat.fileUrl}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotes(mat._id)}
                        className="rounded bg-red-500 text-white px-3 py-1 font-bold hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* FACULTY SALARY SLIPS */}
        {activeTab === 'salary' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-600" />
              Monthly Remuneration Slips
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify monthly compensation payouts, provident funds, income taxes, and additional house-rent allowances.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5">Pay Slip ID</th>
                    <th className="py-2.5">Salary Month</th>
                    <th className="py-2.5">Basic Salary</th>
                    <th className="py-2.5">Net Credit</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-center">Remittance Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySlips.map((slip) => (
                    <tr key={slip.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-3 font-semibold text-blue-600">{slip.id}</td>
                      <td className="py-3 font-medium">{slip.month}</td>
                      <td className="py-3">₹{slip.baseSalary.toLocaleString()}</td>
                      <td className="py-3 font-bold text-emerald-600">₹{slip.netSalary.toLocaleString()}</td>
                      <td className="py-3"><span className="rounded bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">{slip.status}</span></td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => setPrintSlip(slip)}
                          className="rounded bg-blue-50 dark:bg-slate-800 px-2.5 py-1 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 text-[10px]"
                        >
                          Print / View Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SYSTEM ACCESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Portal Access Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Update portal login access codes to secure academic records.
            </p>

            {passwordStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20`}>
                {passwordStatus}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
              >
                Change Access Password
              </button>
            </form>
          </div>
        )}

      </main>

      {/* PRINT SLIP MODAL */}
      {printSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setPrintSlip(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center border-b pb-4 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">METROPOLITAN UNIVERSITY</h3>
              <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Salary Remittance Pay Slip</p>
              <p className="text-[10px] text-slate-400">Statement for: {printSlip.month}</p>
            </div>

            {/* Slip Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <p><strong>Employee:</strong> Prof. {firstName} {lastName}</p>
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Slip reference:</strong> {printSlip.id}</p>
              <p><strong>Payment Date:</strong> {printSlip.paymentDate}</p>
            </div>

            {/* Ledger */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1.5 font-bold uppercase text-[10px] text-slate-400">
                <span>Earning Details</span>
                <span>Amount (INR)</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Basic Salary</span>
                <span>₹{printSlip.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Dearness & House Allowances</span>
                <span>+ ₹{printSlip.allowance.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between border-b pb-1.5 pt-4 font-bold uppercase text-[10px] text-slate-400">
                <span>Deductions</span>
                <span>Amount (INR)</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Provident Fund (PF) Contribution</span>
                <span>- ₹{printSlip.pf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Professional Income Tax</span>
                <span>- ₹{printSlip.tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border dark:border-slate-850 flex justify-between items-center font-bold text-sm">
              <span>Net Remuneration Credited:</span>
              <span className="text-emerald-600 text-base">₹{printSlip.netSalary.toLocaleString()}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
            >
              Print Pay Slip Statement
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyDashboard;
