import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { formatCurrencyIDR } from "@/lib/utils";

async function getDonation(id: string) {
  return prisma.donation.findUnique({ where: { id }, include: { payments: true } });
}

export default async function DonationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donation = await getDonation(id);
  if (!donation) return <div>Donasi tidak ditemukan</div>;

  const payment = donation.payments[0];
  let qrDataUrl: string | null = null;
  const raw = payment?.rawResponse as unknown as { actions?: Array<{ name?: string; method?: string; url?: string }>; qr_string?: string } | null;
  if (raw) {
    const actions = raw.actions;
    const qrisAction = actions?.find((a) => a.name === "generate-qr-code" || a.method === "GET");
    const qrString = qrisAction?.url || raw.qr_string;
    if (qrString) qrDataUrl = await QRCode.toDataURL(qrString);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-green-800">Konfirmasi Pembayaran</h1>
      <p>Kode Transaksi: <strong>{donation.transactionCode}</strong></p>
      <p>Nominal: <strong>{formatCurrencyIDR(donation.amount)}</strong></p>
      {qrDataUrl && (
        <div className="mt-4">
          <img src={qrDataUrl} alt="QRIS" className="w-64 h-64" />
          <p className="text-sm text-neutral-600 mt-2">Scan QR ini via aplikasi e-wallet untuk membayar.</p>
        </div>
      )}
      <p className="text-neutral-700">Status saat ini: <strong>{donation.status}</strong></p>
      <p className="text-neutral-600">Halaman ini akan diperbarui otomatis setelah kami menerima notifikasi pembayaran.</p>
    </div>
  );
}
