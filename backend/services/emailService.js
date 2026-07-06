import nodemailer from 'nodemailer';

// Helper to create transporter
const getTransporter = async () => {
  // If we have SMTP configs in env, use them, otherwise create a mock Ethereal transporter
  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 585,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Return standard test account transporter or a console transporter
    return {
      sendMail: async (mailOptions) => {
        console.log('\n--- MOCK EMAIL SENT ---');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body: ${mailOptions.text}`);
        console.log('-----------------------\n');
        return { messageId: 'mock-id-12345' };
      },
    };
  }
};

/**
 * Sends a confirmation email when a student submits an admission form
 */
export const sendAdmissionConfirmationEmail = async (email, name, applicationNumber, courseName) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@college.edu',
      to: email,
      subject: 'Admission Application Received - Metropolitan University',
      text: `Hello ${name},\n\nCongratulations! Your admission application for the ${courseName} course has been received successfully.\n\nYour Application Number is: ${applicationNumber}\n\nYour application is currently pending document verification and review. You can log into your student portal to track the status.\n\nBest Regards,\nAdmission Office\nMetropolitan University`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admission confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending admission confirmation email: ${error.message}`);
  }
};

/**
 * Sends an approval email when an admin approves a student's admission
 */
export const sendAdmissionApprovalEmail = async (email, name, admissionNumber, rollNumber) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@college.edu',
      to: email,
      subject: 'Admission Approved! Welcome to Metropolitan University',
      text: `Hello ${name},\n\nWe are pleased to inform you that your admission application has been APPROVED!\n\nYour official details are:\n- Admission Number: ${admissionNumber}\n- Roll Number: ${rollNumber}\n\nYou can now log into your Student Dashboard using your registered email and password to view your profile, download your ID card, pay semester fees, and track your attendance.\n\nWelcome aboard!\n\nBest Regards,\nRegistrar Office\nMetropolitan University`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admission approval email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending admission approval email: ${error.message}`);
  }
};
