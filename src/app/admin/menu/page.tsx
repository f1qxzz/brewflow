"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Coffee, Plus, Pencil, Trash2, Circle, UtensilsCrossed, Search } from "lucide-react";
import { useAdminToken } from "../layout";
import MenuFormModal from "@/components/admin/MenuFormModal";
import CategoryManager from "@/components/admin/CategoryManager";
import FadeUp from "@/components/FadeUp";

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
    <div className="min-h-dvh bg-cream-50">
      <div className="relative z-10">
        <header className="sticky top-0 z-30 bg-white border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="w-8 h-8 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center hover:bg-cream-200 transition-colors">
                <ArrowLeft className="w-4 h-4 text-coffee-800/70" />
              </Link>
              <h1 className="font-bold text-coffee-950">Menu</h1>
            </div>
            <button onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-none bg-coffee-500 text-white text-sm font-medium hover:bg-coffee-600 transition-all">
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <FadeUp className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-none bg-white border border-cream-200 flex-1">
              <div className="w-9 h-9 rounded-none bg-amber-50 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-coffee-800/60">Total Menu</p>
                <p className="text-lg font-bold text-coffee-950">{totalItems} item</p>
              </div>
            </div>
            <button onClick={() => setShowCatManager(!showCatManager)}
              className={`px-4 py-3 rounded-none text-sm font-medium border transition-all ${showCatManager ? "bg-coffee-500 text-white border-coffee-500 hover:bg-coffee-600" : "bg-white text-coffee-800/70 border-cream-200 hover:bg-cream-100"}`}>
              Kategori
            </button>
          </FadeUp>

          {showCatManager && (
            <div className="mb-5">
              <CategoryManager categories={menu.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }))} onRefresh={fetchMenu} token={token} />
            </div>
          )}

          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-800/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-none border border-cream-200 bg-white text-sm text-coffee-950 placeholder:text-coffee-800/40 focus:outline-none focus:ring-2 focus:ring-coffee-500/30 transition-all" placeholder="Cari menu..." />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="space-y-2">
                  <div className="skeleton h-5 w-24 rounded" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-16 rounded-none" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-coffee-800/30" />
              </div>
              <p className="text-coffee-800/60 font-medium">{search ? "Menu tidak ditemukan" : "Belum ada menu"}</p>
              {!search && (
                <button onClick={() => { setEditItem(null); setModalOpen(true); }}
                  className="mt-3 px-5 py-2.5 bg-coffee-500 text-white rounded-none text-sm font-medium hover:bg-coffee-600 transition-all">
                  Tambah Menu
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((cat: any, ci: number) => (
                <FadeUp key={cat.id} delay={Math.min(ci, 4) * 0.05}>
                  <div className="flex items-center gap-2 mb-3">
                    <Circle className="w-2.5 h-2.5 fill-coffee-500 text-coffee-500" />
                    <h2 className="font-bold text-coffee-950">{cat.name}</h2>
                    <span className="text-xs text-coffee-800/55 font-normal">({cat.items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-none px-4 py-3 border border-cream-200 hover:border-cream-300 transition-all group">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-none object-cover shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-coffee-950 text-sm truncate">{item.name}</p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                              item.available
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {item.available ? "Tersedia" : "Habis"}
                            </span>
                          </div>
                          <p className="text-xs text-coffee-800/55 font-mono mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                            className="w-8 h-8 rounded-full bg-cream-100 text-coffee-800/60 flex items-center justify-center hover:bg-cream-200 hover:text-coffee-950 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteItem(item.id)}
                            className="w-8 h-8 rounded-full bg-cream-100 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeUp>
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
