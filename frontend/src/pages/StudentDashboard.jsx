import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, BookOpen, Clock, Banknote, Bell, FileText, Check, X, ShieldAlert, Award, FileSpreadsheet,
  User, CheckCircle, MapPin, Calendar, HelpCircle, GraduationCap, ChevronRight, Lock, Book,
  CreditCard, Compass, CheckSquare, MessageSquare, AlertCircle, FileCheck, CheckCircle2, ChevronDown, ListTodo,
  Briefcase, Settings
} from 'lucide-react';
import api from '../services/api.js';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Student profile state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Placement & Notes states
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [jobDrives, setJobDrives] = useState([]);
  const [placementStatus, setPlacementStatus] = useState('');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState('');

  // Fee payment state
  const [paymentModal, setPaymentModal] = useState({ open: false, type: '', amount: 0 });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' });
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Leave Form state
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [leaveStatus, setLeaveStatus] = useState('');

  // Complaint Form state
  const [complaintForm, setComplaintForm] = useState({ category: 'Academic', subject: '', content: '' });
  const [complaintStatus, setComplaintStatus] = useState('');

  // Library rental state
  const [libraryForm, setLibraryForm] = useState({ bookTitle: '', author: '' });
  const [libraryStatus, setLibraryStatus] = useState('');

  // Online Exam Simulator state
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);

  const quizQuestions = [
    { id: 1, question: "Which HTML5 tag is used to embed javascript?", options: ["<script>", "<javascript>", "<js>", "<code-box>"], correct: "<script>" },
    { id: 2, question: "What is the default port for Express.js server in this project?", options: ["3000", "5000", "8000", "27017"], correct: "5000" },
    { id: 3, question: "Which SQL clause is used to query JSONB columns in PostgreSQL?", options: ["->>", "JSON_QUERY", "EXTRACT", "INNER JOIN"], correct: "->>" },
    { id: 4, question: "What does ORM stand for in database programming?", options: ["Object-Relational Mapping", "Offline Resource Manager", "Operator Relation Mode", "Oracle Repository Maker"], correct: "Object-Relational Mapping" },
    { id: 5, question: "Which package handles file upload in Node/Express route?", options: ["multer", "bcryptjs", "helmet", "cors"], correct: "multer" }
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/profile');
      if (res.data.success) {
        setProfile(res.data.data);
      }

      // Fetch study materials and placement drives
      try {
        const matRes = await api.get('/students/study-materials');
        if (matRes.data.success) {
          setStudyMaterials(matRes.data.data);
        }
        const jobRes = await api.get('/placements');
        if (jobRes.data.success) {
          setJobDrives(jobRes.data.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard extras:', e.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      setLeaveStatus('All leave inputs are required.');
      return;
    }
    try {
      const res = await api.post('/students/leave', leaveForm);
      if (res.data.success) {
        setLeaveStatus('Leave application submitted successfully!');
        setLeaveForm({ startDate: '', endDate: '', reason: '' });
        fetchProfile();
      }
    } catch (err) {
      setLeaveStatus(err.message || 'Failed to submit leave.');
    }
  };

  const handleApplyComplaint = async (e) => {
    e.preventDefault();
    if (!complaintForm.subject || !complaintForm.content) {
      setComplaintStatus('Please enter a subject and content.');
      return;
    }
    try {
      const res = await api.post('/students/complaint', complaintForm);
      if (res.data.success) {
        setComplaintStatus('Complaint filed successfully. Ticket generated.');
        setComplaintForm({ category: 'Academic', subject: '', content: '' });
        fetchProfile();
      }
    } catch (err) {
      setComplaintStatus(err.message || 'Failed to submit complaint.');
    }
  };

  const handleRentBook = async (e) => {
    e.preventDefault();
    if (!libraryForm.bookTitle || !libraryForm.author) {
      setLibraryStatus('Please fill in book details.');
      return;
    }
    try {
      const res = await api.post('/students/library', libraryForm);
      if (res.data.success) {
        setLibraryStatus('Book issued successfully for 14 days!');
        setLibraryForm({ bookTitle: '', author: '' });
        fetchProfile();
      }
    } catch (err) {
      setLibraryStatus(err.message || 'Failed to issue book.');
    }
  };

  const handleSimulationPayment = async () => {
    setPaying(true);
    try {
      // Create payment on the backend
      const res = await api.post('/payments', {
        studentId: profile._id,
        amount: paymentModal.amount,
        type: paymentModal.type,
        method: paymentMethod,
      });

      if (res.data.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentModal({ open: false, type: '', amount: 0 });
          setPaymentSuccess(false);
          fetchProfile();
          // Trigger file receipt download automatically
          window.open(`http://localhost:5000/api/payments/${res.data.data._id}/receipt`, '_blank');
        }, 2000);
      }
    } catch (err) {
      alert(err.message || 'Payment simulation failed.');
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadIDCard = () => {
    if (!profile) return;
    window.open(`http://localhost:5000/api/students/${profile._id}/idcard`, '_blank');
  };

  const handleDownloadBonafide = () => {
    if (!profile) return;
    window.open(`http://localhost:5000/api/students/${profile._id}/bonafide`, '_blank');
  };

  const handleQuizAnswer = (qid, answer) => {
    setAnswers({ ...answers, [qid]: answer });
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        score++;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
  };

  const handleApplyPlacement = async (driveId) => {
    try {
      setPlacementStatus('Applying for placement drive...');
      const res = await api.post(`/students/placements/${driveId}/apply`);
      if (res.data.success) {
        setPlacementStatus('Successfully registered for this placement drive!');
        fetchProfile();
        setTimeout(() => setPlacementStatus(''), 4000);
      }
    } catch (err) {
      setPlacementStatus(err.response?.data?.message || 'Failed to apply.');
      setTimeout(() => setPlacementStatus(''), 4000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus('New password must be at least 6 characters.');
      return;
    }
    try {
      setPasswordStatus('Changing password...');
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
      setPasswordStatus(err.response?.data?.message || 'Failed to change password. Make sure old password is correct.');
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
        {error || 'Student profile could not be loaded. Contact administrator.'}
      </div>
    );
  }

  const { firstName, lastName, rollNumber, admissionNumber, course, attendance, results, leaves, complaints, libraryBooks, hostelRoomNumber, hostelAllocated, transportAllocated, transportRoute } = profile;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Sidebar Control Panel */}
      <aside className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-2 h-fit">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-3">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{firstName} {lastName}</h3>
            <p className="text-[10px] text-slate-450 uppercase font-bold mt-0.5">{course?.code || 'Student'}</p>
          </div>
        </div>

        {[
          { id: 'overview', label: 'Dashboard Hub', icon: <Compass className="h-4 w-4" /> },
          { id: 'profile', label: 'My Profile Desk', icon: <User className="h-4 w-4" /> },
          { id: 'attendance', label: 'Attendance logs', icon: <CheckSquare className="h-4 w-4" /> },
          { id: 'grades', label: 'Grade cards / Results', icon: <FileCheck className="h-4 w-4" /> },
          { id: 'fees', label: 'Fees & Payments', icon: <Banknote className="h-4 w-4" /> },
          { id: 'quiz', label: 'Online Exams Console', icon: <GraduationCap className="h-4 w-4" /> },
          { id: 'leaves', label: 'Apply Leave', icon: <Calendar className="h-4 w-4" /> },
          { id: 'complaints', label: 'Helpdesk Tickets', icon: <MessageSquare className="h-4 w-4" /> },
          { id: 'hostel', label: 'Hostel & Transport', icon: <MapPin className="h-4 w-4" /> },
          { id: 'library', label: 'Library Catalog', icon: <Book className="h-4 w-4" /> },
          { id: 'certs', label: 'Digital Certificates', icon: <FileSpreadsheet className="h-4 w-4" /> },
          { id: 'materials', label: 'Study Notes Desk', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'placements', label: 'Corporate Placement', icon: <Briefcase className="h-4 w-4" /> },
          { id: 'notifications', label: 'Alerts & Messages', icon: <Bell className="h-4 w-4" /> },
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
        
        {/* OVERVIEW HUB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Class Attendance</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{attendance || 85}%</h3>
                </div>
                <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600">
                  <CheckSquare className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Academic GPA</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {results && results.length > 0 ? (results.reduce((acc, r) => acc + r.gpa, 0) / results.length).toFixed(2) : 'N/A'}
                  </h3>
                </div>
                <div className="rounded-full p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Issued Books</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{libraryBooks?.length || 0} Books</h3>
                </div>
                <div className="rounded-full p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600">
                  <Book className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Leaves Requested</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{leaves?.length || 0} Leaves</h3>
                </div>
                <div className="rounded-full p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Timetable Desk */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Today's Class Schedule</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { time: '09:00 AM - 10:30 AM', subject: 'CS101: Web Programming', teacher: 'Dr. Neha Sen', loc: 'Room 304' },
                  { time: '11:00 AM - 12:30 PM', subject: 'CS102: Data Structures', teacher: 'Prof. J. Kumar', loc: 'Lab Block A' },
                  { time: '02:00 PM - 03:30 PM', subject: 'CS103: Database Management', teacher: 'Dr. Vivek Roy', loc: 'Auditorium Annex' }
                ].map((cls, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border dark:border-slate-850 space-y-2">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded font-bold">{cls.time}</span>
                    <h4 className="font-bold text-sm mt-1">{cls.subject}</h4>
                    <div className="text-xs text-slate-500">
                      <p>{cls.teacher}</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-400 mt-1">{cls.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE DESK */}
        {activeTab === 'profile' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Student Profile Information
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Admission Number</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{admissionNumber || 'PENDING'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Roll Number</p>
                <p className="font-semibold text-blue-600 mt-1">{rollNumber || 'PENDING'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Father's Name</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{profile.fatherName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Mother's Name</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{profile.motherName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Registered Email</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Registered Mobile</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">{profile.mobile}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400 uppercase font-bold">Permanent Address</p>
                <p className="font-semibold text-slate-850 dark:text-slate-200 mt-1">
                  {profile.address}, {profile.district}, {profile.state} - {profile.pinCode}
                </p>
              </div>
            </div>

            {/* Documents preview links */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Submitted Uploads</h3>
              <div className="flex flex-wrap gap-4 text-xs">
                {profile.documents?.aadhar && (
                  <a href={`http://localhost:5000${profile.documents.aadhar}`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-blue-600 dark:text-blue-400 font-semibold">
                    Aadhar ID PDF
                  </a>
                )}
                {profile.documents?.marksheet && (
                  <a href={`http://localhost:5000${profile.documents.marksheet}`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-blue-600 dark:text-blue-400 font-semibold">
                    Marksheet PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TRACKER */}
        {activeTab === 'attendance' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Subject-wise Academic Attendance Logs
            </h2>

            <div className="space-y-6">
              {[
                { code: 'CS101', name: 'Web Programming & Javascript', pct: 88, classes: '35/40' },
                { code: 'CS102', name: 'Data Structures & Algorithms', pct: 76, classes: '38/50' },
                { code: 'CS103', name: 'Database Management Systems', pct: 90, classes: '27/30' },
                { code: 'CS104', name: 'Computer Networks', pct: 82, classes: '41/50' },
              ].map((sub, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-slate-850 dark:text-slate-200">{sub.code}: {sub.name} ({sub.classes} Lectures)</span>
                    <span className={sub.pct >= 75 ? 'text-emerald-500' : 'text-red-500'}>{sub.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${sub.pct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${sub.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-slate-950 p-4 border dark:border-slate-850 text-xs text-blue-800 dark:text-blue-450 leading-relaxed">
              <strong>Requirement:</strong> Maintain a minimum of 75% attendance across all core academic subjects to be eligible for terminal semester exams.
            </div>
          </div>
        )}

        {/* RESULTS DESK */}
        {activeTab === 'grades' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              Semester Grade Cards & Transcripts
            </h2>

            {results && results.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">No terminal exam results published for your catalog yet.</p>
            ) : (
              <div className="space-y-8">
                {results.map((res, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">Semester {res.semester} Result</h3>
                      <span className="rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 text-xs font-extrabold">
                        SGPA: {res.gpa.toFixed(2)}
                      </span>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-semibold border-b dark:border-slate-850 pb-2">
                          <th className="py-2">Subject Title</th>
                          <th className="py-2 text-center">Max Marks</th>
                          <th className="py-2 text-center">Obtained</th>
                          <th className="py-2 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.subjects && res.subjects.map((sub, sidx) => (
                          <tr key={sidx} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850">
                            <td className="py-2.5 font-medium">{sub.subjectName}</td>
                            <td className="py-2.5 text-center text-slate-500">{sub.maxMarks || 100}</td>
                            <td className="py-2.5 text-center font-semibold">{sub.marksObtained}</td>
                            <td className="py-2.5 text-center font-extrabold text-blue-600">{sub.grade || 'A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FEES & PAYMENTS DESK */}
        {activeTab === 'fees' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Banknote className="h-5 w-5 text-blue-600" />
              Tuition Fees Outstanding Desk
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: 'Academic Tuition Fee', type: 'Semester', amount: course?.semesterFees || 25000, desc: 'Includes academic, library, and examination fees.' },
                { title: 'Campus Hostel Rent', type: 'Hostel', amount: course?.hostelFees || 60000, desc: 'Covers hostel boarding, security, and mess plans.' },
                { title: 'Bus Transport Routes', type: 'Transport', amount: course?.transportFees || 18000, desc: 'Covers door-to-door shuttle bus service fee.' }
              ].map((fee, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{fee.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{fee.desc}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-950 dark:text-white">₹{fee.amount.toLocaleString()}</p>
                    <button
                      onClick={() => setPaymentModal({ open: true, type: fee.type, amount: fee.amount })}
                      className="w-full mt-4 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                    >
                      Pay Online Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payments history */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-450 uppercase">Your Transaction History</h3>
              
              <button 
                onClick={async () => {
                  try {
                    setLoading(true);
                    await api.post('/payments', {
                      studentId: profile._id,
                      amount: course?.semesterFees || 25000,
                      type: 'Semester',
                      method: 'Cash'
                    });
                    fetchProfile();
                  } catch (err) {
                    alert(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="hidden inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                Seed a mock payment history item
              </button>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5">Receipt No</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Method</th>
                      <th className="py-2.5">Txn ID</th>
                      <th className="py-2.5 text-center">Receipt PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Simulated payments since student can trigger */}
                    {profile.paymentsHistory && profile.paymentsHistory.length > 0 ? (
                      profile.paymentsHistory.map((p, idx) => (
                        <tr key={idx} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50">
                          <td className="py-3 font-semibold">{p.receiptNumber}</td>
                          <td className="py-3 text-slate-500">{p.type}</td>
                          <td className="py-3 font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                          <td className="py-3">{p.method}</td>
                          <td className="py-3 text-slate-500">{p.transactionId}</td>
                          <td className="py-3 text-center">
                            <a
                              href={`http://localhost:5000/api/payments/${p._id}/receipt`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-slate-800 px-2 py-1 text-blue-600 font-semibold text-[10px]"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-slate-450">No paid transaction history found. Proceed with UPI/Card simulation to test receipt creation.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ONLINE EXAMS CONSOLE */}
        {activeTab === 'quiz' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Interactive Online Examination Desk
            </h2>

            {!examStarted ? (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-6 border dark:border-slate-850 space-y-4">
                <h3 className="font-bold text-base">CS101: Web Programming - Mock Evaluation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This mock evaluation tests structural HTML, JavaScript routes, PostgreSQL syntax, and server modules. Once started, you must answer all 5 questions.
                </p>
                <div className="text-xs text-slate-650 dark:text-slate-350 space-y-2">
                  <p><strong>Questions:</strong> 5 Multiple Choice Questions</p>
                  <p><strong>Duration:</strong> No strict limits (Practice Mock)</p>
                  <p><strong>Negative Marking:</strong> None</p>
                </div>
                <button
                  onClick={() => {
                    setExamStarted(true);
                    setExamSubmitted(false);
                    setAnswers({});
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Start Exam Console
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-lg border border-slate-150 dark:border-slate-850 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Q{idx + 1}. {q.question}</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={examSubmitted}
                            onClick={() => handleQuizAnswer(q.id, opt)}
                            className={`text-left text-xs p-3 rounded-lg border font-medium transition ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {examSubmitted && (
                      <div className="text-xs font-semibold mt-2">
                        {answers[q.id] === q.correct ? (
                          <span className="text-emerald-500 flex items-center gap-1">Correct Answer: {q.correct}</span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            Incorrect. Selected: {answers[q.id] || 'None'} | Correct: {q.correct}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {!examSubmitted ? (
                  <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                    <button
                      onClick={() => setExamStarted(false)}
                      className="rounded border px-4 py-2 text-xs font-semibold hover:bg-slate-100"
                    >
                      Quit Exam
                    </button>
                    <button
                      onClick={handleQuizSubmit}
                      className="rounded bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow"
                    >
                      Submit Exam Paper
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 p-6 text-center space-y-4">
                    <h3 className="font-bold text-lg text-emerald-600">Exam Results Summarized</h3>
                    <p className="text-sm font-extrabold">Your Score: {examScore} / {quizQuestions.length}</p>
                    <p className="text-xs text-slate-500">Practice score generated automatically. Transcripts will not be permanently appended.</p>
                    <button
                      onClick={() => setExamStarted(false)}
                      className="rounded bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow"
                    >
                      Return to Console Home
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* APPLY LEAVE */}
        {activeTab === 'leaves' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Apply for Leave Absence
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
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason for Leave</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Enter detailed reason (e.g. medical illness, family emergency)..."
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
                  Submit Application
                </button>
              </div>
            </form>

            {/* Leave history */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Your Leave Applications</h3>
              <div className="space-y-4">
                {leaves && leaves.length > 0 ? (
                  leaves.map((l, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-slate-850 dark:text-slate-200">
                          Duration: {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-slate-500 mt-1">Reason: {l.reason}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 font-bold uppercase ${
                        l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        l.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No leave applications filed.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HELPDESK / COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Helpdesk Complaint Ticket generator
            </h2>

            {complaintStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${complaintStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {complaintStatus}
              </div>
            )}

            <form onSubmit={handleApplyComplaint} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>Academic</option>
                    <option>Hostel</option>
                    <option>Transport</option>
                    <option>Library</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject / Issue Title</label>
                  <input
                    type="text"
                    value={complaintForm.subject}
                    onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                    placeholder="e.g. WiFi not working in Room 102"
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Detailed Content</label>
                <textarea
                  value={complaintForm.content}
                  onChange={(e) => setComplaintForm({ ...complaintForm, content: e.target.value })}
                  placeholder="Explain your problem in detail..."
                  rows="3"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Generate Ticket
                </button>
              </div>
            </form>

            {/* Complaint list */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Historical Ticket logs</h3>
              <div className="space-y-4">
                {complaints && complaints.length > 0 ? (
                  complaints.map((c, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-blue-600">Category: {c.category}</span>
                        <span className={`rounded-full px-2 py-0.5 font-bold uppercase ${c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{c.subject}</h4>
                      <p className="text-slate-500">{c.content}</p>
                      {c.reply && (
                        <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-850 italic text-slate-650">
                          <strong>Admin Reply:</strong> {c.reply}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No ticket logs filed.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HOSTEL & TRANSPORT */}
        {activeTab === 'hostel' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hostel details */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base">Hostel Allocation</h3>
              {hostelAllocated ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Room Assigned:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">{hostelRoomNumber || 'Room 102'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Mess Plan:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">North-South Combined Diet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Wi-Fi Password:</span>
                    <span className="font-mono bg-slate-100 dark:bg-slate-955 px-1.5 py-0.5 rounded text-blue-600">MU_Hostel_5G</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Hostel accommodation is not yet allocated to your profile.</p>
                  <p className="text-xs font-bold text-blue-600">Please pay hostel fees under the Payments tab to activate.</p>
                </div>
              )}
            </div>

            {/* Transport details */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base">Bus Transport Details</h3>
              {transportAllocated ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Bus Route:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">{transportRoute || 'Route-4'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Vehicle Plate:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">DL-1CA-5421</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-medium">Driver Contact:</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200">+91 99999 88888 (Shri. Devinder)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Transport bus pass is not active for this student.</p>
                  <p className="text-xs font-bold text-blue-600">Apply & pay shuttle bus fees under the Payments tab to allocate.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIBRARY HUB */}
        {activeTab === 'library' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Rent Library Books Simulator
            </h2>

            {libraryStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold ${libraryStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {libraryStatus}
              </div>
            )}

            <form onSubmit={handleRentBook} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Book Title</label>
                <input
                  type="text"
                  value={libraryForm.bookTitle}
                  onChange={(e) => setLibraryForm({ ...libraryForm, bookTitle: e.target.value })}
                  placeholder="e.g. Introduction to Algorithms"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Author Name</label>
                <input
                  type="text"
                  value={libraryForm.author}
                  onChange={(e) => setLibraryForm({ ...libraryForm, author: e.target.value })}
                  placeholder="e.g. Thomas H. Cormen"
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md"
                >
                  Issue/Rent Book
                </button>
              </div>
            </form>

            {/* Issued books */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-slate-455 uppercase mb-4">Books Currently Issued</h3>
              <div className="space-y-4">
                {libraryBooks && libraryBooks.length > 0 ? (
                  libraryBooks.map((book, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{book.bookTitle}</h4>
                        <p className="text-slate-500 mt-1">Author: {book.author}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Issue Date: {new Date(book.issueDate).toLocaleDateString()} | Due Date: {new Date(book.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="rounded bg-amber-50 text-amber-600 px-2 py-0.5 font-bold uppercase text-[9px]">
                        {book.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No library books issued yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DIGITAL CERTIFICATES */}
        {activeTab === 'certs' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Download Digital Certificates (PDF Kit)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate and download electronic copies of student identification cards and institution bonafide credentials. Documents are legally valid for scholarship and verification purposes.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base">Digital Student ID Card</h3>
                  <p className="text-xs text-slate-500 mt-2">Downloads A6-sized landscape printable ID card containing roll numbers and barcode parameters.</p>
                </div>
                <button
                  onClick={handleDownloadIDCard}
                  className="rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                >
                  Download ID Card PDF
                </button>
              </div>

              <div className="rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base">Academic Bonafide Certificate</h3>
                  <p className="text-xs text-slate-500 mt-2">Downloads A4 letterhead certificate declaring student status, parentage, and course structure details.</p>
                </div>
                <button
                  onClick={handleDownloadBonafide}
                  className="rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                >
                  Download Bonafide PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STUDY NOTES */}
        {activeTab === 'materials' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Syllabus Study Materials Desk
            </h2>
            <p className="text-xs text-slate-500">
              Access and download core academic lecture notes, laboratory manuals, and worksheets shared by your subject faculty.
            </p>

            {studyMaterials.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">No study materials uploaded for your course syllabus yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {studyMaterials.map((mat) => (
                  <div key={mat._id} className="rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {mat.subject}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2.5">{mat.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{mat.description || 'No additional specifications provided.'}</p>
                    </div>
                    <div className="border-t border-slate-200/50 dark:border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Shared by: <strong>{mat.uploadedBy}</strong></span>
                      <a
                        href={mat.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-500"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CORPORATE PLACEMENTS */}
        {activeTab === 'placements' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Corporate Recruitment Placement Desk
            </h2>
            <p className="text-xs text-slate-500">
              Review active placement drives matching your specialization. Apply directly and monitor verification/shortlisting updates.
            </p>

            {placementStatus && (
              <div className={`rounded-lg p-4 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400`}>
                {placementStatus}
              </div>
            )}

            {jobDrives.length === 0 ? (
              <p className="text-xs text-slate-400 py-12 text-center">No active placement drives scheduled currently. Check back later.</p>
            ) : (
              <div className="space-y-4">
                {jobDrives.map((drive) => {
                  const studentApplication = drive.applicants?.find(
                    (app) => app.student === profile._id || app.student?._id === profile._id
                  );
                  return (
                    <div key={drive._id} className="rounded-xl border border-slate-150 dark:border-slate-800 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{drive.companyName}</h3>
                          <span className="rounded bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            ₹{drive.packageAmount} LPA
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">{drive.role} | Drive Date: {new Date(drive.driveDate).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl"><strong className="text-slate-650 dark:text-slate-350">Criteria:</strong> {drive.eligibility}</p>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{drive.description}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {studentApplication ? (
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`rounded px-3 py-1 text-xs font-bold ${
                              studentApplication.status === 'Selected' ? 'bg-emerald-500 text-white' :
                              studentApplication.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                            }`}>
                              Applied ({studentApplication.status})
                            </span>
                            <span className="text-[10px] text-slate-400">Registered {new Date(studentApplication.appliedAt).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApplyPlacement(drive._id)}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md"
                          >
                            Register Drive
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALERTS & MESSAGES */}
        {activeTab === 'notifications' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Administrative Bulletins & Inbox
            </h2>
            
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-455 uppercase border-b pb-2">Broadcast Notices</h3>
              {[
                { title: 'Odd Semester Exams Registration Deadline Extension', date: 'Yesterday', sender: 'Exam Office', body: 'The registration deadline with normal fees has been extended to 15th July 2026. Submit your subject choices in the console.' },
                { title: 'Hostel Biometric Re-enrollment Circular', date: '04 July 2026', sender: 'Warden Block B', body: 'All block residents must complete their fingerprint scan verification at the gate security counter by Saturday.' },
              ].map((note, idx) => (
                <div key={idx} className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 space-y-2 bg-slate-50 dark:bg-slate-950">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{note.title}</span>
                    <span className="text-slate-450">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{note.body}</p>
                  <p className="text-[10px] text-blue-500 font-semibold">Origin: {note.sender}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-sm text-slate-455 uppercase border-b pb-2">Direct Chats</h3>
              <div className="rounded-lg border border-slate-150 dark:border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs">Academic Helpdesk Ticket Chat System (Simulated)</span>
                </div>
                <div className="h-48 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-955 p-3 rounded border text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded shadow-sm max-w-sm mr-auto space-y-1">
                    <p className="text-slate-500 font-semibold text-[10px]">Admin Support (10:15 AM)</p>
                    <p className="text-slate-850 dark:text-slate-200">Hello! We have reviewed your bonafide query. Your document is now approved and ready to print from the Certificates desk.</p>
                  </div>
                  <div className="bg-blue-600 text-white p-2.5 rounded shadow-sm max-w-sm ml-auto text-right space-y-1">
                    <p className="font-semibold text-[10px] text-blue-200">You (10:20 AM)</p>
                    <p>Thank you very much. I have downloaded the PDF.</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Type message to Academic Admin desk..."
                    className="flex-1 rounded border px-3 py-2 bg-transparent dark:border-slate-800 focus:outline-none"
                  />
                  <button className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500">Send</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Portal Access Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Configure login parameters, update authentication codes, or modify primary contact credentials.
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

      {/* FEES PAYMENT SIMULATION MODAL OVERLAY */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setPaymentModal({ open: false, type: '', amount: 0 })}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-lg">Simulated Payment Desk</h3>
            <p className="text-xs text-slate-500 mt-1">Paying <strong>{paymentModal.type} Fees</strong>: <span className="font-bold text-blue-600">₹{paymentModal.amount.toLocaleString()}</span></p>

            {paymentSuccess ? (
              <div className="mt-6 py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-emerald-600">Payment Processed Successfully!</h4>
                <p className="text-[11px] text-slate-450">Generating receipt PDF & closing portal desk...</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {/* Method selector tabs */}
                <div className="flex gap-2 border-b dark:border-slate-800 pb-2">
                  {['UPI', 'Card'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                        paymentMethod === method ? 'bg-blue-600 text-white' : 'text-slate-550 dark:text-slate-400'
                      }`}
                    >
                      {method === 'UPI' ? 'UPI QR Code Scan' : 'Credit/Debit Card'}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'UPI' ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-4 bg-slate-50 dark:bg-slate-955 rounded-lg">
                    {/* Simulated visual QR Code layout */}
                    <div className="h-32 w-32 bg-white p-2 border border-slate-200 rounded flex flex-col justify-between items-center relative cursor-pointer" onClick={handleSimulationPayment}>
                      {/* Standard mock QR pattern */}
                      <div className="absolute inset-2 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="h-6 w-6 bg-slate-900" />
                          <div className="h-6 w-6 bg-slate-900" />
                        </div>
                        <div className="flex justify-between">
                          <div className="h-6 w-6 bg-slate-900" />
                          <div className="h-4 w-4 bg-slate-600" />
                        </div>
                      </div>
                      <div className="text-[9px] font-bold text-blue-600 z-10 bg-white/90 px-1 py-0.5 rounded shadow mt-10">Click QR to Pay</div>
                    </div>
                    <p className="text-[10px] text-slate-450">Scan QR Code using PhonePe/GPay or click it to simulate instant success.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4221 5689 7412 5556"
                        className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                    <div className="grid gap-3 grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="•••"
                          maxLength="3"
                          className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-xs focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                          required
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSimulationPayment}
                      disabled={paying}
                      className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md disabled:bg-blue-450 mt-2"
                    >
                      {paying ? 'Processing...' : `Pay ₹${paymentModal.amount.toLocaleString()}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
