"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";

export type MenuForm = {
  name: string; description: string; price: string; image: string;
  categoryId: number; available: boolean; order: string;
};

const EMPTY: MenuForm = {
  name: "", description: "", price: "", image: "",
  categoryId: 0, available: true, order: "0",
};

export default function MenuFormModal({
  open, onClose, onSubmit, categories, initial,
}: {
  open: boolean; onClose: () => void;
  onSubmit: (data: MenuForm) => Promise<void>;
  categories: { id: number; name: string }[];
  initial?: MenuForm | null;
}) {
  // ponytail: reset via `key` di parent (edit-{id}/new) → gak perlu effect sync state
  const [form, setForm] = useState<MenuForm>(() => initial ?? { ...EMPTY, categoryId: categories[0]?.id || 0 });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try { await onSubmit(form); onClose(); } finally { setSaving(false); }
  }

  const images = ["/images/espresso.jpg","/images/latte.jpg","/images/cappuccino.jpg","/images/mocha.jpg","/images/americano.jpg","/images/matcha-latte.jpg","/images/cold-brew.jpg","/images/v60.jpg","/images/croissant.jpg","/images/sandwich.jpg","/images/nasi-goreng.jpg","/images/spaghetti.jpg","/images/chicken-wings.jpg","/images/french-fries.jpg","/images/lemon-tea.jpg","/images/chocolate.jpg","/images/milkshake.jpg","/images/red-velvet.jpg","/images/cookies-cream.jpg"];

  const inputCls = "w-full px-3.5 py-2.5 rounded-none border border-cream-200 bg-white text-sm text-coffee-950 placeholder:text-coffee-800/60 focus:outline-none focus:ring-2 focus:ring-coffee-500/30 transition-all";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 z-50 md:max-w-lg md:w-full overflow-y-auto rounded-none bg-white border border-cream-200 shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-cream-200 bg-white rounded-t-none">
              <h2 className="font-bold text-coffee-950">{initial ? "Edit" : "Tambah"} Menu</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
                <X className="w-4 h-4 text-coffee-800/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-xs text-coffee-800/70 mb-1.5 block">Nama Menu</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls} placeholder="Contoh: Espresso" />
              </div>

              <div>
                <label className="text-xs text-coffee-800/70 mb-1.5 block">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputCls + " resize-none"} rows={2} placeholder="Deskripsi menu..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-coffee-800/70 mb-1.5 block">Harga (Rp)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputCls + " font-mono"} placeholder="25000" />
                </div>
                <div>
                  <label className="text-xs text-coffee-800/70 mb-1.5 block">Urutan</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className={inputCls} placeholder="0" />
                </div>
              </div>

              <div>
                <label className="text-xs text-coffee-800/70 mb-1.5 block">Kategori</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className={inputCls + " appearance-none"}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-coffee-800/70 mb-1.5 block">Ketersediaan</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm({ ...form, available: true })}
                    className={`flex-1 py-2.5 rounded-none text-sm font-medium transition-all ${form.available ? "bg-emerald-600 text-white" : "bg-cream-50 text-coffee-800/70 border border-cream-200 hover:bg-cream-100"}`}>Tersedia</button>
                  <button type="button" onClick={() => setForm({ ...form, available: false })}
                    className={`flex-1 py-2.5 rounded-none text-sm font-medium transition-all ${!form.available ? "bg-red-500 text-white" : "bg-cream-50 text-coffee-800/70 border border-cream-200 hover:bg-cream-100"}`}>Habis</button>
                </div>
              </div>

              <div>
                <label className="text-xs text-coffee-800/70 mb-1.5 block">Gambar</label>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-coffee-800/70 shrink-0" />
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className={inputCls} placeholder="/images/espresso.jpg" />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img) => (
                    <button key={img} type="button" onClick={() => setForm({ ...form, image: img })}
                      className={`shrink-0 w-12 h-12 rounded-none overflow-hidden border-2 transition-all ${form.image === img ? "border-coffee-500 ring-2 ring-coffee-500/30" : "border-cream-200 hover:border-cream-300"}`}>
                      <Image src={img} alt="" width={48} height={48} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-none border border-cream-200 text-coffee-800/70 text-sm font-medium hover:bg-cream-100 transition-all">Batal</button>
                <button type="submit" disabled={!form.name.trim() || !form.price || saving}
                  className="flex-1 py-2.5 rounded-none bg-coffee-500 text-white text-sm font-semibold hover:bg-coffee-600 disabled:opacity-40 transition-all">
                  {saving ? "Menyimpan..." : initial ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
