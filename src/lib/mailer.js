import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInquiryEmail = async (inquiryData) => {
  // Only attempt to send if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('SMTP is not configured. Email notification skipped.');
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_TO || process.env.SMTP_USER,
    subject: `New Website Inquiry from ${inquiryData.name}`,
    html: `
      <h2>New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${inquiryData.name}</p>
      <p><strong>Email:</strong> ${inquiryData.email}</p>
      <p><strong>Phone:</strong> ${inquiryData.phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${inquiryData.company || 'N/A'}</p>
      <h3>Message:</h3>
      <p>${inquiryData.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
