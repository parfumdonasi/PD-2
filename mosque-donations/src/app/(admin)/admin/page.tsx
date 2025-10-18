import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return <div>Akses ditolak.</div>;
  }

  const [donations, users] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.count(),
  ]);

  const total = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">Total Donasi Terkini: {new Intl.NumberFormat("id-ID").format(total)}</div>
        <div className="border rounded p-4">Donatur Terdaftar: {users}</div>
        <div className="border rounded p-4">Transaksi Terakhir: {donations.length}</div>
      </div>
    </div>
  );
}
