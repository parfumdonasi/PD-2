import crypto from "node:crypto";

export function generateTransactionCode(): string {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `DON-${stamp}-${rand}`;
}

export function formatCurrencyIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

export function isTrue(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}
