import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  await transporter.verify();

  const result = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER, // Sends a test to yourself
    subject: "Wick & Aura — SMTP Test",
    text: "Your backend email configuration is working.",
  });

  console.log("Email sent:", result.messageId);
} catch (error) {
  console.error("Email test failed:", error.message);
}
