import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { signed } from "@/lib/sign";

// Kumpulan s = signed(table) buat QR meja 1..10 (konsumen: /admin/qr) —
// bikin /menu?table=N&s=... jadi cuma pemegang QR yang bisa lihat riwayat meja itu (pentest L3)
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const out: Record<string, string> = {};
  for (let t = 1; t <= 10; t++) out[t] = signed(String(t));
  return NextResponse.json(out);
}
