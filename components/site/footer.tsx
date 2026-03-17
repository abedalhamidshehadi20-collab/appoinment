export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-white/80 py-10">
      <div className="container flex flex-col justify-between gap-4 text-sm text-[var(--muted)] md:flex-row">
        <p>MedAxis Care Solutions. Better systems for better care.</p>
        <p>© {new Date().getFullYear()} MedAxis. All rights reserved.</p>
      </div>
    </footer>
  );
}