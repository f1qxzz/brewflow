import { NextResponse } from "next/server";
import { revokeSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (token) revokeSession(token);
  return NextResponse.json({ ok: true });
}
