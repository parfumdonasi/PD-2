import nodemailer from "nodemailer";

const host = process.env.EMAIL_SERVER_HOST || "";
const port = Number(process.env.EMAIL_SERVER_PORT || 587);
const user = process.env.EMAIL_SERVER_USER || "";
const pass = process.env.EMAIL_SERVER_PASSWORD || "";
const from = process.env.EMAIL_FROM || "donations@example.com";

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

export async function sendDonationConfirmation(params: {
  to: string;
  donorName?: string | null;
  amountFormatted: string;
  transactionCode: string;
}) {
  const { to, donorName, amountFormatted, transactionCode } = params;
  const subject = `Terima kasih atas donasi Anda - ${transactionCode}`;
  const html = `
    <p>Assalamu'alaikum ${donorName || "Donatur"},</p>
    <p>Terima kasih atas donasi parfum masjid Anda sebesar <strong>${amountFormatted}</strong>.</p>
    <p>Kode transaksi: <strong>${transactionCode}</strong></p>
    <p>Semoga Allah membalas kebaikan Anda. Aamiin.</p>
  `;
  await transporter.sendMail({ from, to, subject, html });
}
