"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon } from "lucide-react";

type FormData = {
  name: string; description: string; price: string; image: string;
  categoryId: number; available: boolean; order: string;
};

export default function MenuFormModal({
  open, onClose, onSubmit, categories, initial,
}: {
  open: boolean; onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  categories: { id: number; name: string }[];
  initial?: FormData | null;
}) {
  const [form, setForm] = useState<FormData>({
    name: "", description: "", price: "", image: "",
    categoryId: categories[0]?.id || 0, available: true, order: "0",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) setForm(initial);
      else setForm({ name: "", description: "", price: "", image: "", categoryId: categories[0]?.id || 0, available: true, order: "0" });
    }
  }, [open, initial, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try { await onSubmit(form); onClose(); } finally { setSaving(false); }
  }

  const images = ["/images/espresso.jpg","/images/latte.jpg","/images/cappuccino.jpg","/images/mocha.jpg","/images/americano.jpg","/images/matcha-latte.jpg","/images/cold-brew.jpg","/images/v60.jpg","/images/croissant.jpg","/images/sandwich.jpg","/images/nasi-goreng.jpg","/images/spaghetti.jpg","/images/chicken-wings.jpg","/images/french-fries.jpg","/images/lemon-tea.jpg","/images/chocolate.jpg","/images/milkshake.jpg","/images/red-velvet.jpg","/images/cookies-cream.jpg"];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 z-50 md:max-w-lg md:w-full overflow-y-auto rounded-2xl bg-[#0C0A09] border border-white/[0.08] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#0C0A09]">
              <h2 className="font-bold text-white">{initial ? "Edit" : "Tambah"} Menu</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Nama Menu</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all" placeholder="Contoh: Espresso" />
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all resize-none" rows={2} placeholder="Deskripsi menu..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Harga (Rp)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all font-mono" placeholder="25000" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Urutan</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Kategori</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all appearance-none">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Ketersediaan</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm({ ...form, available: true })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.available ? "bg-emerald-500 text-white" : "bg-white/[0.04] text-white/50 border border-white/[0.08]"}`}>Tersedia</button>
                  <button type="button" onClick={() => setForm({ ...form, available: false })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${!form.available ? "bg-red-500 text-white" : "bg-white/[0.04] text-white/50 border border-white/[0.08]"}`}>Habis</button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Gambar</label>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-white/30 shrink-0" />
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all" placeholder="/images/espresso.jpg" />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img) => (
                    <button key={img} type="button" onClick={() => setForm({ ...form, image: img })}
                      className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${form.image === img ? "border-coffee-500 ring-2 ring-coffee-500/30" : "border-white/[0.06] hover:border-white/[0.2]"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all">Batal</button>
                <button type="submit" disabled={!form.name.trim() || !form.price || saving}
                  className="flex-1 py-2.5 rounded-xl bg-coffee-500 text-white text-sm font-semibold hover:bg-coffee-400 disabled:opacity-40 transition-all">
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
