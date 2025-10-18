import midtransClient from "midtrans-client";
import { isTrue } from "./utils";

const isProduction = isTrue(process.env.MIDTRANS_IS_PRODUCTION);
const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

export type CreateQrisChargeParams = {
  orderId: string;
  grossAmount: number;
  customerEmail: string;
  customerName?: string | null;
};

export async function createQrisCharge(params: CreateQrisChargeParams): Promise<unknown> {
  const { orderId, grossAmount, customerEmail, customerName } = params;
  const payload = {
    payment_type: "qris",
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    customer_details: {
      email: customerEmail,
      first_name: customerName ?? "Donor",
    },
    // qris: { acquirer: "gopay" }, // optional
  };
  return coreApi.charge(payload as unknown as Record<string, unknown>);
}

export type CreateVaChargeParams = {
  orderId: string;
  grossAmount: number;
  bank: "bca" | "bni" | "bri" | "mandiri";
  customerEmail: string;
  customerName?: string | null;
};

export async function createVaCharge(params: CreateVaChargeParams): Promise<unknown> {
  const { orderId, grossAmount, bank, customerEmail, customerName } = params;
  const payload = {
    payment_type: "bank_transfer",
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    bank_transfer: {
      bank,
    },
    customer_details: {
      email: customerEmail,
      first_name: customerName ?? "Donor",
    },
  };
  return coreApi.charge(payload as unknown as Record<string, unknown>);
}
