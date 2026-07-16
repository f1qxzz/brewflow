"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Coffee, Plus, Pencil, Trash2, Circle, UtensilsCrossed, Search } from "lucide-react";
import { useAdminToken } from "../layout";
import MenuFormModal from "@/components/admin/MenuFormModal";
import CategoryManager from "@/components/admin/CategoryManager";

export default function MenuPage() {
  const token = useAdminToken();
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [showCatManager, setShowCatManager] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu?all=true", { headers: { "x-admin-token": token } });
    setMenu(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const totalItems = menu.reduce((s: number, c: any) => s + (c.items?.length || 0), 0);

  async function saveItem(data: any) {
    const url = editItem ? `/api/menu/${editItem.id}` : "/api/menu";
    const method = editItem ? "PUT" : "POST";
    await fetch(url, {
      method, headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ ...data, price: Number(data.price), order: Number(data.order), categoryId: Number(data.categoryId) }),
    });
    setEditItem(null);
    fetchMenu();
  }

  async function deleteItem(id: number) {
    if (!confirm("Hapus item ini?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    fetchMenu();
  }

  const filtered = menu.map((cat: any) => ({
    ...cat,
    items: cat.items.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase())),
  })).filter((c: any) => c.items.length > 0);

  return (
    <div className="min-h-dvh bg-[#0C0A09]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
      <div className="fixed top-1/3 right-0 w-[20rem] h-[20rem] rounded-full bg-coffee-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-[#0C0A09]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                <ArrowLeft className="w-4 h-4 text-white/60" />
              </Link>
              <h1 className="font-bold text-white">Menu</h1>
            </div>
            <button onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-400 transition-all">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          {/* Stats + Cat Manager toggle */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex-1">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-xs text-white/40">Total Menu</p>
                <p className="text-lg font-bold text-white">{totalItems} item</p>
              </div>
            </div>
            <button onClick={() => setShowCatManager(!showCatManager)}
              className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${showCatManager ? "bg-coffee-500 text-white border-coffee-500" : "bg-white/[0.03] text-white/60 border-white/[0.06] hover:bg-white/[0.06]"}`}>
              Kategori
            </button>
          </div>

          {/* Category Manager */}
          {showCatManager && (
            <div className="mb-5">
              <CategoryManager categories={menu.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))} onRefresh={fetchMenu} token={token} />
            </div>
          )}

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-coffee-500/40 transition-all" placeholder="Cari menu..." />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="space-y-2">
                  <div className="skeleton h-5 w-24 rounded bg-white/[0.06]" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-16 rounded-xl bg-white/[0.04]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/[0.04] flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-white/50 font-medium">{search ? "Menu tidak ditemukan" : "Belum ada menu"}</p>
              {!search && (
                <button onClick={() => { setEditItem(null); setModalOpen(true); }}
                  className="mt-3 px-5 py-2.5 bg-coffee-500 text-white rounded-xl text-sm font-medium hover:bg-coffee-400 transition-all">
                  Tambah Menu
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((cat: any) => (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Circle className="w-2.5 h-2.5 fill-coffee-500 text-coffee-500" />
                    <h2 className="font-bold text-white">{cat.name}</h2>
                    <span className="text-xs text-white/40 font-normal">({cat.items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white text-sm truncate">{item.name}</p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                              item.available
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : "bg-red-500/10 text-red-300 border-red-500/20"
                            }`}>
                              {item.available ? "Tersedia" : "Habis"}
                            </span>
                          </div>
                          <p className="text-xs text-white/40 font-mono mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                            className="w-8 h-8 rounded-full bg-white/[0.06] text-white/50 flex items-center justify-center hover:bg-white/[0.1] hover:text-white transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteItem(item.id)}
                            className="w-8 h-8 rounded-full bg-white/[0.06] text-red-400/50 flex items-center justify-center hover:bg-red-500/20 hover:text-red-300 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <MenuFormModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSubmit={saveItem}
          categories={menu.map((c: any) => ({ id: c.id, name: c.name }))}
          initial={editItem ? { name: editItem.name, description: editItem.description, price: String(editItem.price), image: editItem.image, categoryId: editItem.categoryId, available: editItem.available, order: String(editItem.order) } : null}
        />
      </div>
    </div>
  );
}
