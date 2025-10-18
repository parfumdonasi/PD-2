"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

const donationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  amount: z.number().int().min(10000),
  message: z.string().optional(),
  method: z.enum(["QRIS", "DANA", "OVO", "GOPAY", "BCA", "BNI", "BRI", "MANDIRI"]).default("QRIS"),
});

type DonationForm = z.infer<typeof donationSchema>;

const preset = [50000, 100000, 200000, 500000];

export default function DonatePage() {
  const [form, setForm] = useState<DonationForm>({ email: "", amount: 100000, method: "QRIS" });
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState<DonationForm["method"][]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/config/payments");
        const data = await res.json();
        setMethods(data.methods as DonationForm["method"][]);
        // Default to first enabled method if current is not allowed
        if (!data.methods.includes(form.method)) {
          setForm((f) => ({ ...f, method: (data.methods[0] ?? "QRIS") as DonationForm["method"] }));
        }
      } catch {
        // ignore
      }
    })();
  }, []);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = donationSchema.safeParse({ ...form });
    if (!payload.success) {
      setError("Input tidak valid");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Gagal membuat donasi");
      return;
    }
    // Redirect to confirmation page
    window.location.href = `/donate/${data.donationId}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-800">Donasi Parfum Masjid</h1>
      <p className="text-neutral-700">Pilih nominal donasi atau masukkan sendiri. Pembayaran utama melalui QRIS.</p>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block">Nama (opsional)</label>
          <input className="w-full border rounded px-3 py-2" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="block">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="block">Pesan/Doa (opsional)</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.message ?? ""} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {preset.map((amt) => (
              <button type="button" key={amt} className={`border rounded px-3 py-2 ${form.amount === amt ? "border-green-800" : ""}`} onClick={() => setForm({ ...form, amount: amt })}>
                Rp {amt.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span>Nominal lain:</span>
            <input className="border rounded px-3 py-2 w-48" type="number" min={10000} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          </div>
          <label className="block">Metode Pembayaran</label>
          <select className="w-full border rounded px-3 py-2" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as DonationForm["method"] })}>
            {methods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Memproses..." : "Donasi Sekarang"}</button>
        </div>
      </form>
    </div>
  );
}
