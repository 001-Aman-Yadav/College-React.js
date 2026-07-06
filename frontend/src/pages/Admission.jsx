import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice.js';
import api from '../services/api.js';
import { Check, User, MapPin, Award, Lock, FileText, Upload } from 'lucide-react';

const Admission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get('courseId') || '';

  const { courses } = useSelector((state) => state.courses);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    category: 'General',
    religion: '',
    nationality: 'Indian',
    email: '',
    mobile: '',
    address: '',
    state: '',
    district: '',
    pinCode: '',
    courseId: courseIdParam,
    previousQualification: 'High School',
    marks10th: '',
    marks12th: '',
    graduationMarks: '',
    password: '',
    confirmPassword: '',
  });

  const [files, setFiles] = useState({
    photo: null,
    signature: null,
    aadhar: null,
    marksheet: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Pre-fill if courseId changes in query param
  useEffect(() => {
    if (courseIdParam) {
      setFormData((prev) => ({ ...prev, courseId: courseIdParam }));
    }
  }, [courseIdParam]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const nextStep = () => {
    // Validate current step fields before going forward
    if (step === 1) {
      const { firstName, lastName, fatherName, motherName, dob, religion } = formData;
      if (!firstName || !lastName || !fatherName || !motherName || !dob || !religion) {
        setError('Please fill in all personal details.');
        return;
      }
    } else if (step === 2) {
      const { email, mobile, address, state, district, pinCode } = formData;
      if (!email || !mobile || !address || !state || !district || !pinCode) {
        setError('Please fill in all contact details.');
        return;
      }
    } else if (step === 3) {
      const { courseId, previousQualification, marks10th, marks12th } = formData;
      if (!courseId || !previousQualification || !marks10th || !marks12th) {
        setError('Please select a course and enter marksheets details.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sendData = new FormData();
      Object.keys(formData).forEach((key) => {
        sendData.append(key, formData[key]);
      });

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          sendData.append(key, files[key]);
        }
      });

      const response = await api.post('/admission/apply', sendData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSubmittedData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">Application Submitted!</h2>
        <p className="mt-4 text-sm text-slate-500">
          Congratulations! Your admission form has been received successfully.
        </p>

        <div className="mt-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-left space-y-4">
          <h3 className="font-bold border-b border-slate-100 dark:border-slate-800 pb-2">Application Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Application Number</p>
              <p className="font-semibold text-blue-600">{submittedData.applicationNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Course Selected</p>
              <p className="font-semibold text-slate-700 dark:text-slate-250">
                {courses.find((c) => c._id === formData.courseId)?.name || 'Course'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="font-semibold text-slate-750 dark:text-slate-200">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Payment Status</p>
              <p className="font-semibold text-amber-500">Cash Pending (Offline Verification)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 dark:bg-slate-950 p-4 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>Important:</strong> A confirmation email has been dispatched. Once our administration team verifies your marks and uploaded documents, you will receive an approval notification. Use your email and password to log in and pay registration fees.
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/login')}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-md"
          >
            Go to Portal Login
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Personal', icon: <User className="h-4 w-4" /> },
    { num: 2, label: 'Contact', icon: <MapPin className="h-4 w-4" /> },
    { num: 3, label: 'Academic', icon: <Award className="h-4 w-4" /> },
    { num: 4, label: 'Account', icon: <Lock className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Online Admission System</h1>
        <p className="mt-2 text-sm text-slate-500">Complete the four-step application to register for the academic session 2026-27.</p>
      </div>

      {/* Steps Progress bar */}
      <div className="relative flex justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-1.5 flex-1 relative z-10">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
              step >= s.num
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-slate-300 dark:border-slate-700 text-slate-400'
            }`}>
              {s.icon}
            </div>
            <span className={`text-xs font-semibold ${step >= s.num ? 'text-blue-600' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
        {/* Progress line */}
        <div className="absolute top-8 left-12 right-12 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      {/* Main Form Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* STEP 1: Personal details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-850 dark:text-white">
                <User className="h-5 w-5 text-blue-600" />
                Personal Details
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Enter father's name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Enter mother's name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="e.g. Hindu, Muslim, Christian"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Contact details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-850 dark:text-white">
                <MapPin className="h-5 w-5 text-blue-600" />
                Contact Address
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="yourname@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="10-digit number"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Permanent Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Enter street, locality, landmark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="District"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Pin Code"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Academic details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-850 dark:text-white">
                <Award className="h-5 w-5 text-blue-600" />
                Course & Academic Grades
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Program (Course)</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    required
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} (Academic Fee: ₹{c.fees.toLocaleString()}/yr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Previous Qualification</label>
                  <select
                    name="previousQualification"
                    value={formData.previousQualification}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option>High School</option>
                    <option>Intermediate (10+2)</option>
                    <option>Bachelor Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">10th Grade Percentage</label>
                  <input
                    type="number"
                    name="marks10th"
                    value={formData.marks10th}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 84.5"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">12th Grade Percentage</label>
                  <input
                    type="number"
                    name="marks12th"
                    value={formData.marks12th}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 78"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Graduation Score (optional)</label>
                  <input
                    type="number"
                    name="graduationMarks"
                    value={formData.graduationMarks}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Percentage or GPA"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Account & Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-850 dark:text-white">
                <Lock className="h-5 w-5 text-blue-600" />
                Security & Documents Upload
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Portal Access Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Set dashboard password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                {/* File Upload controls */}
                <div className="sm:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Required Documents (JPG, PNG, PDF | Max 5MB)
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Student Photo</label>
                      <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Student Signature</label>
                      <input
                        type="file"
                        name="signature"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Aadhar Card Copy</label>
                      <input
                        type="file"
                        name="aadhar"
                        onChange={handleFileChange}
                        accept=".pdf,image/*"
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">12th Standard Marksheet</label>
                      <input
                        type="file"
                        name="marksheet"
                        onChange={handleFileChange}
                        accept=".pdf,image/*"
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg border border-slate-350 dark:border-slate-750 px-5 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-md"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-md disabled:bg-blue-400"
              >
                {loading ? 'Submitting Form...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admission;
