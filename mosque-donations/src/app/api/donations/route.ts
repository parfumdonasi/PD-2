import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateTransactionCode } from "@/lib/utils";
import { createQrisCharge, createVaCharge } from "@/lib/midtrans";
import { getEnabledPaymentMethods } from "@/lib/config";

const requestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  amount: z.number().int().min(10000),
  message: z.string().optional(),
  method: z.enum(["QRIS", "DANA", "OVO", "GOPAY", "BCA", "BNI", "BRI", "MANDIRI"]).default("QRIS"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const { name, email, amount, message, method } = parsed.data;
    const enabled = getEnabledPaymentMethods();
    if (!enabled.includes(method)) {
      return NextResponse.json({ error: "Metode pembayaran tidak tersedia" }, { status: 400 });
    }
    const transactionCode = generateTransactionCode();

    const donation = await prisma.donation.create({
      data: {
        donorEmail: email,
        donorName: name,
        amount,
        message,
        paymentMethod: method as unknown as "QRIS" | "DANA" | "OVO" | "GOPAY" | "BCA" | "BNI" | "BRI" | "MANDIRI",
        transactionCode,
      },
    });

    let midtransRes: unknown;
    if (method === "QRIS") {
      midtransRes = await createQrisCharge({ orderId: transactionCode, grossAmount: amount, customerEmail: email, customerName: name });
    } else if (["BCA", "BNI", "BRI", "MANDIRI"].includes(method)) {
      const bank = method.toLowerCase() as "bca" | "bni" | "bri" | "mandiri";
      midtransRes = await createVaCharge({ orderId: transactionCode, grossAmount: amount, customerEmail: email, customerName: name, bank });
    } else {
      // For e-wallets, you can add separate flows/deeplinks later
      midtransRes = await createQrisCharge({ orderId: transactionCode, grossAmount: amount, customerEmail: email, customerName: name });
    }

    await prisma.payment.create({
      data: {
        donationId: donation.id,
        gateway: "midtrans",
        status: "PENDING",
        rawResponse: midtransRes as unknown as import("@/generated/prisma").Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ donationId: donation.id, transactionCode, midtrans: midtransRes });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
