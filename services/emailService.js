import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email address
    pass: "your-email-password", // Replace with your email password (or app-specific password for Gmail)
  },
});

// Setup email data
const mailOptions = {
  from: "your-email@gmail.com", // Sender address
  to: "recipient-email@example.com", // List of receivers
  subject: "Test Email from Node.js", // Subject line
  text: "Hello, this is a test email sent from Nodemailer!", // Plain text body
  // html: '<b>Hello, this is a test email sent from Nodemailer!</b>', // If you want to send HTML content
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
