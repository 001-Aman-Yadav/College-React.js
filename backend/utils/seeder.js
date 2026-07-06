import Course from '../models/course.js';
import User from '../models/user.js';
import Notice from '../models/notice.js';

export const seedData = async () => {
  try {
    // 1. Seed Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding initial courses...');
      const demoCourses = [
        {
          name: 'Bachelor of Computer Applications (BCA)',
          code: 'BCA',
          duration: '3 Years',
          fees: 45000,
          semesterFees: 22500,
          registrationFees: 1000,
          hostelFees: 60000,
          transportFees: 18000,
          eligibility: '10+2 with Mathematics/Computer Science with min 50% marks',
          seats: 60,
          availableSeats: 60,
          placement: ['TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'Cognizant'],
          subjects: ['Programming in C', 'Web Technologies', 'Database Management Systems', 'Data Structures', 'Software Engineering', 'Java Programming'],
        },
        {
          name: 'Bachelor of Technology in Computer Science (B.Tech CSE)',
          code: 'BTECH-CSE',
          duration: '4 Years',
          fees: 95000,
          semesterFees: 47500,
          registrationFees: 1500,
          hostelFees: 60000,
          transportFees: 18000,
          eligibility: '10+2 with Physics, Chemistry, Mathematics with min 60% marks',
          seats: 120,
          availableSeats: 120,
          placement: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'TCS Ninja', 'Capgemini'],
          subjects: ['Engineering Mathematics', 'Digital Electronics', 'Operating Systems', 'Computer Networks', 'Design and Analysis of Algorithms', 'Artificial Intelligence'],
        },
        {
          name: 'Master of Computer Applications (MCA)',
          code: 'MCA',
          duration: '2 Years',
          fees: 60000,
          semesterFees: 30000,
          registrationFees: 1000,
          hostelFees: 60000,
          transportFees: 18000,
          eligibility: 'BCA / B.Sc Computer Science / General Graduate with Math in 10+2',
          seats: 45,
          availableSeats: 45,
          placement: ['Accenture', 'IBM', 'Oracle', 'Cisco', 'HCL'],
          subjects: ['Advanced Java', 'Python Programming', 'Cloud Computing', 'Cryptography and Network Security', 'Data Science', 'Mobile Application Development'],
        },
        {
          name: 'Master of Business Administration (MBA)',
          code: 'MBA',
          duration: '2 Years',
          fees: 75000,
          semesterFees: 37500,
          registrationFees: 1000,
          hostelFees: 60000,
          transportFees: 18000,
          eligibility: 'Graduation in any discipline with min 50% marks',
          seats: 60,
          availableSeats: 60,
          placement: ['HDFC Bank', 'Deloitte', 'ICICI Bank', 'EY', 'KPMG'],
          subjects: ['Organizational Behavior', 'Financial Management', 'Marketing Management', 'Human Resource Management', 'Strategic Management', 'Business Analytics'],
        },
      ];

      await Course.insertMany(demoCourses);
      console.log('Courses seeded successfully!');
    }

    // 2. Seed Admin User
    const adminCount = await User.countDocuments({ role: 'SuperAdmin' });
    if (adminCount === 0) {
      console.log('Seeding default administrator...');
      await User.create({
        email: 'admin@college.edu.in',
        password: 'admin123', // Will be hashed automatically by pre-save middleware
        role: 'SuperAdmin',
        status: 'Active',
      });
      console.log('Default administrator created (admin@college.edu.in / admin123)');
    }

    // 3. Seed Notices
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      console.log('Seeding default notices...');
      const demoNotices = [
        {
          title: 'Admission Registration 2026 Open',
          content: 'The online admission registrations for BCA, B.Tech, MCA, and MBA programs for the academic session 2026-27 are now open. Eligible students can apply through the admission portal.',
          category: 'Admission',
          priority: 'High',
        },
        {
          title: 'Semester End Examination Schedule',
          content: 'The final semester-end examinations for all UG and PG programs will commence from June 15, 2026. Detailed schedules and hall tickets can be accessed in individual student portals.',
          category: 'Exam',
          priority: 'High',
        },
        {
          title: 'Campus Placement Drive: Tata Consultancy Services',
          content: 'TCS is conducting a pool placement drive for final year B.Tech and BCA students on May 20, 2026. Register in the placement cell dashboard by May 18.',
          category: 'Placement',
          priority: 'Medium',
        },
      ];

      await Notice.insertMany(demoNotices);
      console.log('Notices seeded successfully!');
    }
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
  }
};
