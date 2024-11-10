import nodemailer from "nodemailer";
import path from "path";
import { senderMail, passMail } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: passMail,
  },
});

const mailOptions = (reciverMail, fullname) => {
  const welcomeHTML = `
  <html>
  <head>
    <style>
      body {
        font-family: Trebuchet MS;
        color: #333;
      }
      .image {
        display: flex;
        justify-content: center;
      }
      .email-container {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        width: 600px;
        margin: 0 auto;
      }
      .email-header {
        text-align: center;
        font-size: 24px;
        color: #3399ff;
        margin-bottom: 20px;
      }
      .email-body {
        font-size: 16px;
        line-height: 1.6;
      }
      .email-footer {
        margin-top: 20px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="image"><img src="https://cashflowinventory.com/blog/wp-content/uploads/2023/02/inventory-management-system.webp" width="200px" alt="Logo" /></div>
      <div class="email-header"><strong>Welcome to Inventory Management App</strong></div>
      <div class="email-body">
        <p>Hello, <strong>${fullname}</strong>!</p>
        <p>Thank you for registering for our service. We're excited to have you onboard.</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2024 Inventory Management Corporation.</p>
      </div>
    </div>
  </body>
</html>
`;
  const format = {
    from: senderMail,
    to: reciverMail,
    subject: `Welocome ${fullname} to Inventory Management App`,
    html: welcomeHTML,
  };
  return format;
};

function sendMail(reciverMail, fullname) {
  transporter.sendMail(mailOptions(reciverMail, fullname), (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const mailInvoice = (customerName, customerEmail, transactionDate) => {
  const format = {
    from: senderMail,
    to: customerEmail,
    subject: `Invoice ${transactionDate}`,
    text: `Hello ${customerName}, your Invoice of ${transactionDate}`,
    attachments: [
      {
        filename: path.basename("invoice.pdf"),
        path: "invoice.pdf",
      },
    ],
  };
  return format;
};

function sendInvoice(customer, transactionDate) {
  transporter.sendMail(
    mailInvoice(customer.customername, customer.email, transactionDate),
    (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

export default { sendMail, sendInvoice };
