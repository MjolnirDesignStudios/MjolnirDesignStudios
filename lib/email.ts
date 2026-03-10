// lib/email.ts — Resend transactional email service
// Docs: https://resend.com/docs
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@mjolnirdesignstudios.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@mjolnirdesignstudios.com";

// ─── Subscription Confirmation ───────────────────────────────────────────────
export async function sendSubscriptionConfirmation({
  toEmail,
  toName,
  tier,
  amount,
  billingCycle,
}: {
  toEmail: string;
  toName?: string;
  tier: string;
  amount: number;
  billingCycle: "monthly" | "annual";
}) {
  const displayName = toName || toEmail.split("@")[0];
  const period = billingCycle === "annual" ? "year" : "month";

  return resend.emails.send({
    from: `Mjolnir Design Studios <${FROM_EMAIL}>`,
    to: [toEmail],
    subject: `⚡ Welcome to Mjolnir ${tier} — Your Subscription is Active`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Mjolnir ${tier}</title></head>
<body style="background:#0a0a0a;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#065f46,#0d9488);padding:40px 40px 30px;text-align:center;">
        <h1 style="margin:0;font-size:32px;font-weight:900;letter-spacing:2px;">⚡ MJÖLNIR</h1>
        <p style="margin:8px 0 0;font-size:14px;opacity:0.85;letter-spacing:1px;">DESIGN STUDIOS</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:40px;">
        <h2 style="color:#34d399;margin:0 0 16px;font-size:24px;">Whosoever holds this hammer...</h2>
        <p style="color:#9ca3af;line-height:1.7;margin:0 0 24px;">
          Welcome, ${displayName}! You're now wielding the power of Mjolnir <strong style="color:#fff;">${tier}</strong>.
          Your subscription is active and your forge is ready.
        </p>
        <!-- Plan Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;margin-bottom:24px;">
          <tr>
            <td style="padding:24px;">
              <table width="100%">
                <tr>
                  <td style="color:#6b7280;font-size:13px;">Plan</td>
                  <td style="text-align:right;color:#fff;font-weight:700;">${tier}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding-top:8px;">Amount</td>
                  <td style="text-align:right;color:#34d399;font-weight:700;padding-top:8px;">$${amount}/${period}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding-top:8px;">Status</td>
                  <td style="text-align:right;padding-top:8px;"><span style="background:#065f46;color:#34d399;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;">ACTIVE</span></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!-- CTA -->
        <div style="text-align:center;margin:32px 0;">
          <a href="https://www.mjolnirdesignstudios.com/blocks"
             style="display:inline-block;background:linear-gradient(135deg,#10b981,#84cc16);color:#000;font-weight:900;font-size:16px;padding:16px 40px;border-radius:999px;text-decoration:none;letter-spacing:1px;">
            ⚡ Enter Your Dashboard
          </a>
        </div>
        <p style="color:#6b7280;font-size:13px;line-height:1.7;">
          Questions? Reply to this email or reach us at <a href="mailto:contact@mjolnirdesignstudios.com" style="color:#34d399;">contact@mjolnirdesignstudios.com</a>
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#0a0a0a;padding:24px 40px;text-align:center;border-top:1px solid #222;">
        <p style="color:#4b5563;font-size:12px;margin:0;">Mjolnir Design Studios · Tampa, FL · Lightning Capital of the World</p>
        <p style="color:#374151;font-size:11px;margin:8px 0 0;">Forged in the heart of a dying star.</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

// ─── Workshop Booking Confirmation ───────────────────────────────────────────
export async function sendWorkshopConfirmation({
  toEmail,
  toName,
  workshopType,
  scheduledDate,
  calendlyLink,
}: {
  toEmail: string;
  toName: string;
  workshopType: "live" | "webinar";
  scheduledDate?: string;
  calendlyLink?: string;
}) {
  const isLive = workshopType === "live";
  const workshopLabel = isLive ? "Live In-Person Workshop" : "Live Webinar";
  const price = isLive ? "$500" : "$250";
  const dateDisplay = scheduledDate
    ? new Date(scheduledDate).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "To be confirmed";

  return resend.emails.send({
    from: `Mjolnir Forge <${FROM_EMAIL}>`,
    to: [toEmail],
    subject: `🔨 Your Mjolnir ${workshopLabel} is Confirmed — ${dateDisplay}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">
    <tr>
      <td style="background:linear-gradient(135deg,#78350f,#d97706);padding:40px 40px 30px;text-align:center;">
        <h1 style="margin:0;font-size:32px;font-weight:900;letter-spacing:2px;">🔨 MJÖLNIR FORGE</h1>
        <p style="margin:8px 0 0;font-size:14px;opacity:0.85;letter-spacing:1px;">WORKSHOP CONFIRMED</p>
      </td>
    </tr>
    <tr>
      <td style="padding:40px;">
        <h2 style="color:#f59e0b;margin:0 0 16px;font-size:24px;">Your forge session is locked in, ${toName}!</h2>
        <p style="color:#9ca3af;line-height:1.7;margin:0 0 24px;">
          You're registered for the <strong style="color:#fff;">${workshopLabel}</strong>.
          Get ready to forge something extraordinary.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;margin-bottom:24px;">
          <tr>
            <td style="padding:24px;">
              <table width="100%">
                <tr>
                  <td style="color:#6b7280;font-size:13px;">Workshop</td>
                  <td style="text-align:right;color:#fff;font-weight:700;">${workshopLabel}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding-top:8px;">Date & Time</td>
                  <td style="text-align:right;color:#f59e0b;font-weight:700;padding-top:8px;">${dateDisplay}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding-top:8px;">Investment</td>
                  <td style="text-align:right;color:#34d399;font-weight:700;padding-top:8px;">${price}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        ${
          calendlyLink
            ? `<div style="text-align:center;margin:24px 0;">
            <a href="${calendlyLink}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#000;font-weight:900;font-size:15px;padding:14px 36px;border-radius:999px;text-decoration:none;">
              📅 View / Manage Booking
            </a>
          </div>`
            : ""
        }
        <p style="color:#9ca3af;font-size:14px;line-height:1.7;">
          <strong style="color:#fff;">What to prepare:</strong><br>
          • Bring any branding materials, logos, or existing assets<br>
          • Come with your business goals and target audience in mind<br>
          • We'll handle everything else at the forge
        </p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">
          Need to reschedule? Reply to this email or contact us at
          <a href="mailto:contact@mjolnirdesignstudios.com" style="color:#f59e0b;">contact@mjolnirdesignstudios.com</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#0a0a0a;padding:24px 40px;text-align:center;border-top:1px solid #222;">
        <p style="color:#4b5563;font-size:12px;margin:0;">Mjolnir Design Studios · Tampa, FL · Lightning Capital of the World</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

// ─── Admin Notification ───────────────────────────────────────────────────────
export async function sendAdminNotification({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: `Mjolnir Alerts <${FROM_EMAIL}>`,
    to: [ADMIN_EMAIL],
    subject,
    html,
  });
}
