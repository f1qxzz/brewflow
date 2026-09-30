/* ponytail: satu spinner global di root — nav ke /menu, /admin, /payment gak pernah kosong */
export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="anim-fade-up flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden
          className="size-9 animate-spin rounded-full border-2 border-coffee-500 border-t-transparent"
        />
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-coffee-800/70">
          Memuat
        </p>
      </div>
    </main>
  );
}
