import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email. Reusable for OTP, order confirmation, newsletters, etc.
 * @param {{ to: string, subject: string, html: string }} options
 */
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

/**
 * OTP email template — clean, branded HTML.
 */
export const otpEmailHTML = (otp, purpose = "verification") => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 420px; margin: 0 auto; background: #fff;">
    <div style="background: #111; padding: 24px 28px;">
      <h1 style="color: #fff; font-size: 18px; margin: 0; font-weight: 600; letter-spacing: 1px;">
        WICK &amp; AURA
      </h1>
    </div>
    <div style="padding: 32px 28px;">
      <p style="color: #333; font-size: 15px; margin: 0 0 24px; line-height: 1.5;">
        Your ${purpose} code is:
      </p>
      <div style="background: #f7f7f7; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 24px;">
        <span style="font-family: 'SF Mono', 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111;">
          ${otp}
        </span>
      </div>
      <p style="color: #888; font-size: 13px; margin: 0; line-height: 1.5;">
        This code expires in 10 minutes. If you didn't request this, ignore this email.
      </p>
    </div>
  </div>
`;
