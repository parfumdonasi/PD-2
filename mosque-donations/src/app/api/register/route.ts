import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
