const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

/**
 * Sends an email. Fails silently (logs only) so email issues never break
 * the main request flow.
 */
async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}`, err.message);
  }
}

const templates = {
  applicationReceived: (job) => ({
    subject: `Application received: ${job.title}`,
    html: `<p>Your application for <strong>${job.title}</strong> has been received.</p>`,
  }),
  statusUpdate: (job, status) => ({
    subject: `Update on your application: ${job.title}`,
    html: `<p>Your application status for <strong>${job.title}</strong> is now: <strong>${status}</strong>.</p>`,
  }),
};

module.exports = { sendEmail, templates };
