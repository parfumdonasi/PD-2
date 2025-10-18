import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrencyIDR } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email ?? undefined;

  if (!userId && !email) {
    return (
      <div className="space-y-4">
        <p>Silakan <Link className="text-green-800 underline" href="/login">masuk</Link> untuk melihat riwayat donasi Anda.</p>
      </div>
    );
  }

  // Donations by logged-in user or by email as fallback
  const donations = await prisma.donation.findMany({
    where: { OR: [{ userId: userId ?? "" }, { donorEmail: email ?? "" }] },
    orderBy: { createdAt: "desc" },
  });
  const lifetimeTotal = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Donatur</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <div className="text-sm text-neutral-600">Total Donasi</div>
          <div className="text-2xl font-bold">{formatCurrencyIDR(lifetimeTotal)}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-neutral-600">Jumlah Transaksi</div>
          <div className="text-2xl font-bold">{donations.length}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Riwayat Donasi</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-neutral-50">
                <th className="border px-3 py-2 text-left">Tanggal</th>
                <th className="border px-3 py-2 text-left">Nominal</th>
                <th className="border px-3 py-2 text-left">Metode</th>
                <th className="border px-3 py-2 text-left">Status</th>
                <th className="border px-3 py-2 text-left">Kode</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="border px-3 py-2">{d.createdAt.toLocaleString("id-ID")}</td>
                  <td className="border px-3 py-2">{formatCurrencyIDR(d.amount)}</td>
                  <td className="border px-3 py-2">{d.paymentMethod}</td>
                  <td className="border px-3 py-2">{d.status}</td>
                  <td className="border px-3 py-2">{d.transactionCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
