import { NextResponse } from "next/server";
import { getEnabledPaymentMethods } from "@/lib/config";

export async function GET() {
  const methods = getEnabledPaymentMethods();
  return NextResponse.json({ methods });
}
