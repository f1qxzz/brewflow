"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function CategoryManager({
  categories, onRefresh, token,
}: {
  categories: { id: number; name: string; slug: string }[];
  onRefresh: () => void;
  token: string;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    if (!name.trim()) return;
    setBusy(true);
    await fetch("/api/categories", {
      method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-") }),
    });
    setBusy(false);
    setAdding(false); setName(""); setSlug("");
    onRefresh();
  }

  async function rename(id: number) {
    if (!name.trim()) return;
    setBusy(true);
    await fetch(`/api/categories/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-") }),
    });
    setBusy(false);
    setEditing(null); setName(""); setSlug("");
    onRefresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus kategori ini? Semua item di dalamnya juga akan terhapus.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    onRefresh();
  }

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Kategori</h3>
        <button onClick={() => { setAdding(true); setName(""); setSlug(""); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coffee-500 text-white text-xs font-medium hover:bg-coffee-400 transition-all">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>

      <div className="space-y-1.5">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group">
            {editing === c.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:ring-2 focus:ring-coffee-500/40" placeholder="Nama" />
                <input value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/60 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 font-mono text-xs" placeholder="slug" />
                <button onClick={() => rename(c.id)} disabled={busy}
                  className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-colors">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditing(null)}
                  className="w-7 h-7 rounded-full bg-white/[0.06] text-white/60 flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-coffee-500 shrink-0" />
                  <span className="text-sm text-white truncate">{c.name}</span>
                  <span className="text-[10px] text-white/30 font-mono">/{c.slug}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(c.id); setName(c.name); setSlug(c.slug); }}
                    className="w-7 h-7 rounded-full bg-white/[0.06] text-white/50 flex items-center justify-center hover:bg-white/[0.1] hover:text-white transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(c.id)}
                    className="w-7 h-7 rounded-full bg-white/[0.06] text-red-400/50 flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40" placeholder="Nama kategori" />
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/60 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 font-mono" placeholder="slug-otomatis (opsional)" />
              <div className="flex gap-2">
                <button onClick={() => setAdding(false)}
                  className="flex-1 py-2 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.06] transition-all">Batal</button>
                <button onClick={create} disabled={!name.trim() || busy}
                  className="flex-1 py-2 rounded-xl bg-coffee-500 text-white text-sm font-semibold hover:bg-coffee-400 disabled:opacity-40 transition-all">Tambah</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
