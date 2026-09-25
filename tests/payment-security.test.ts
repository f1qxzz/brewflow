import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "crypto";
import { signed, verifySigned } from "../src/lib/sign";
import { parsePaymentStatus } from "../src/lib/midtrans";

// jalur duit & keamanan: orderToken HMAC + transisi status pembayaran webhook

test("signed() roundtrip: token valid untuk value asli", () => {
  process.env.ADMIN_PIN = "123456";
  const t = signed(42);
  assert.equal(verifySigned(t, 42), true);
  assert.equal(verifySigned(signed("BRW-7-123"), "BRW-7-123"), true);
});

test("verifySigned() tolak value beda (token dipindah ke order lain)", () => {
  process.env.ADMIN_PIN = "123456";
  const t = signed(42);
  assert.equal(verifySigned(t, 43), false);
  assert.equal(verifySigned(t, "42 "), false);
});

test("verifySigned() tolak token yang dimanipulasi", () => {
  process.env.ADMIN_PIN = "123456";
  const t = signed(42);
  const [payload, mac] = t.split(".");
  assert.equal(verifySigned(`${payload}.${mac.slice(0, -1)}0`, 42), false);
  assert.equal(verifySigned(`43.${mac}`, 42), false);
  assert.equal(verifySigned(mac, 42), false); // tanpa payload
  assert.equal(verifySigned("42", 42), false); // tanpa mac
});

test("verifySigned() tolak token kosong/tanpa kecocokan panjang", () => {
  process.env.ADMIN_PIN = "123456";
  assert.equal(verifySigned(null, 42), false);
  assert.equal(verifySigned(undefined, 42), false);
  assert.equal(verifySigned("", 42), false);
  assert.equal(verifySigned("42.ab", 42), false); // mac kependekan, gak meledak
});

test("putar ADMIN_PIN = token lama mati", () => {
  process.env.ADMIN_PIN = "123456";
  const t = signed(42);
  process.env.ADMIN_PIN = "999999";
  assert.equal(verifySigned(t, 42), false);
  process.env.ADMIN_PIN = "123456";
});

test("webhook signature: urutan input ikut format Midtrans (sha512 order+code+amount+key)", () => {
  process.env.ADMIN_PIN = "123456";
  const sk = "Mid-server-test";
  const expected = createHash("sha512").update("BRW-9-1" + "200" + "150000" + sk).digest("hex");
  // payload diganti = signature beda (route nolak kalau gak cocok)
  const tampered = createHash("sha512").update("BRW-9-2" + "200" + "150000" + sk).digest("hex");
  assert.notEqual(expected, tampered);
});

test("parsePaymentStatus: sukses", () => {
  assert.equal(parsePaymentStatus("settlement", "accept"), "paid");
  assert.equal(parsePaymentStatus("capture", "accept"), "paid");
});

test("parsePaymentStatus: fraud ditolak tetap pending, bukan paid", () => {
  assert.equal(parsePaymentStatus("settlement", "deny"), "pending");
  assert.equal(parsePaymentStatus("capture", "deny"), "pending");
  assert.equal(parsePaymentStatus("capture", "challenge"), "pending");
});

test("parsePaymentStatus: terminal states", () => {
  assert.equal(parsePaymentStatus("pending", ""), "pending");
  assert.equal(parsePaymentStatus("expire", ""), "expired");
  assert.equal(parsePaymentStatus("cancel", ""), "failed");
  assert.equal(parsePaymentStatus("deny", ""), "failed");
  assert.equal(parsePaymentStatus("failure", ""), "failed");
  assert.equal(parsePaymentStatus("gak-dikenal", ""), "pending"); // default aman: gak pernah "paid"
});
