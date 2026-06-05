import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT) || 587;
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "DoorTrack";

  const from = process.env.MAIL_FROM_ADDRESS || user;

  try {
    await transport.sendMail({
      from,
      to: email,
      subject: `Reset your ${appName} password`,
      text: [
        `We received a request to reset the password for your ${appName} account.`,
        ``,
        `Click the link below to set a new password (valid for 60 minutes):`,
        resetUrl,
        ``,
        `If you didn't request this, you can safely ignore this email.`,
        ``,
        `— ${appName} Team`,
      ].join("\n"),
      html: [
        `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;max-width:480px">`,
        `<h2>Password Reset</h2>`,
        `<p>We received a request to reset the password for your <strong>${appName}</strong> account.</p>`,
        `<p style="margin:24px 0"><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Reset Password</a></p>`,
        `<p>Or copy this link into your browser:</p>`,
        `<p style="font-size:13px;color:#6b7280;word-break:break-all">${resetUrl}</p>`,
        `<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb">`,
        `<p style="font-size:13px;color:#6b7280">If you didn't request this, you can safely ignore this email.</p>`,
        `<p style="font-size:13px;color:#6b7280">— ${appName} Team</p>`,
        `</body></html>`,
      ].join(""),
    });
    return true;
  } catch {
    return false;
  }
}
