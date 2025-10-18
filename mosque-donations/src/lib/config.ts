export type PaymentMethod = "QRIS" | "DANA" | "OVO" | "GOPAY" | "BCA" | "BNI" | "BRI" | "MANDIRI";

export function getEnabledPaymentMethods(): PaymentMethod[] {
  const env = process.env.ENABLED_PAYMENT_METHODS ?? "QRIS,DANA,OVO,GOPAY,BCA,BNI,BRI,MANDIRI";
  return env
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .filter((m): m is PaymentMethod =>
      ["QRIS", "DANA", "OVO", "GOPAY", "BCA", "BNI", "BRI", "MANDIRI"].includes(m)
    );
}
