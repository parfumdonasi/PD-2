"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
    if (res?.error) setError(res.error);
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900 rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Masuk</h1>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full rounded bg-green-700 text-white py-2">
          Lanjutkan dengan Google
        </button>
        <div className="text-center text-sm text-neutral-500">atau</div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full rounded bg-green-800 text-white py-2">{loading ? "Memproses..." : "Masuk"}</button>
        </form>
        <p className="text-sm">Belum punya akun? <Link className="text-green-700 underline" href="/register">Daftar</Link></p>
      </div>
    </div>
  );
}
