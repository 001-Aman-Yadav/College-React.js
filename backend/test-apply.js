async function run() {
  try {
    console.log('Sending admission application request...');
    const res = await fetch('http://localhost:5000/api/admission/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Student',
        fatherName: 'Father Name',
        motherName: 'Mother Name',
        dob: '2004-05-15',
        gender: 'Male',
        category: 'General',
        religion: 'Hindu',
        nationality: 'Indian',
        email: 'student2@gmail.com',
        mobile: '9876543210',
        address: '123 Test St',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        pinCode: '221005',
        courseId: 'cdca3f82-3c51-4726-bc54-daca37146591',
        previousQualification: 'Intermediate (10+2)',
        marks10th: 85,
        marks12th: 82,
        password: 'password123'
      })
    });
    
    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

run();
