"use client";

import Link from "next/link";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal mendaftar");
      setLoading(false);
      return;
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 dark:bg-neutral-900 rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Daftar</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" type="text" placeholder="Nama (opsional)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full rounded bg-green-800 text-white py-2">{loading ? "Memproses..." : "Daftar"}</button>
        </form>
        <p className="text-sm">Sudah punya akun? <Link className="text-green-700 underline" href="/login">Masuk</Link></p>
      </div>
    </div>
  );
}
