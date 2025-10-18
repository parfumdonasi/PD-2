import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-[var(--color-primary)] text-white p-8">
        <h1 className="text-3xl md:text-4xl font-bold">WangiMasjid — Donasi Parfum untuk Masjid</h1>
        <p className="mt-2 text-white/90">Mudah, aman, dan transparan. Pembayaran via QRIS, e-wallet, atau VA.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/donate" className="bg-white text-[var(--color-primary)] px-5 py-2 rounded font-semibold">Donasi Sekarang</Link>
          <Link href="/dashboard" className="border border-white/70 px-5 py-2 rounded">Lihat Riwayat</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        {[
          { title: "Basic", amt: 50000, desc: "1 botol parfum ruangan" },
          { title: "Regular", amt: 150000, desc: "3 botol + diffuser" },
          { title: "Premium", amt: 300000, desc: "Premium + dispenser otomatis" },
          { title: "Special", amt: 500000, desc: "Impor + 1 bulan maintenance" },
        ].map((p) => (
          <div key={p.title} className="border rounded p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-2xl font-bold">Rp {p.amt.toLocaleString("id-ID")}</div>
            <p className="text-sm text-neutral-600">{p.desc}</p>
            <Link href={{ pathname: "/donate" }} className="mt-3 inline-block btn-primary">Pilih</Link>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold">Sertifikasi Halal</h3>
          <p className="text-sm text-neutral-700">Produk wewangian tersertifikasi halal dan aman untuk asma.</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">Aroma Tahan Lama</h3>
          <p className="text-sm text-neutral-700">Pilihan Musk, Bakhoor, Rose, dan Oud.</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">Transparan</h3>
          <p className="text-sm text-neutral-700">Lihat bukti distribusi parfum ke masjid.</p>
        </div>
      </section>
    </div>
  );
}
