import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
import { sendDonationConfirmation } from "@/lib/mailer";
import { formatCurrencyIDR } from "@/lib/utils";

function verifySignature({ orderId, statusCode, grossAmount, signatureKey }: { orderId: string; statusCode: string; grossAmount: string; signatureKey: string; }) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const input = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(input).digest("hex");
  return hash === signatureKey;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, status_code, gross_amount, signature_key } = body;

    if (!verifySignature({ orderId: order_id, statusCode: status_code, grossAmount: gross_amount, signatureKey: signature_key })) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const donation = await prisma.donation.findFirst({ where: { transactionCode: order_id } });
    if (!donation) return NextResponse.json({ error: "Donation not found" }, { status: 404 });

    let newStatus: "SUCCESS" | "PENDING" | "FAILED" | "EXPIRED" | "CANCELLED" = "PENDING";
    if (["capture", "settlement", "success"].includes(String(transaction_status))) newStatus = "SUCCESS";
    if (["deny", "cancel"].includes(String(transaction_status))) newStatus = "FAILED";
    if (["expire"].includes(String(transaction_status))) newStatus = "EXPIRED";

    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { donationId: donation.id },
        data: { status: newStatus, rawResponse: body, paidAt: newStatus === "SUCCESS" ? new Date() : null },
      }),
      prisma.donation.update({ where: { id: donation.id }, data: { status: newStatus } }),
    ]);
    if (newStatus === "SUCCESS") {
      const amountFormatted = formatCurrencyIDR(donation.amount);
      await sendDonationConfirmation({ to: donation.donorEmail, donorName: donation.donorName, amountFormatted, transactionCode: donation.transactionCode });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
