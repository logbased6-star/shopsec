export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10">
      <div className="trace-divider" />
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-slate">
        <p className="font-display text-base text-ink">
          Shop<span className="text-indigo">Sec</span>
        </p>
        <p>A demo storefront with a built-in security operations panel.</p>
      </div>
    </footer>
  );
}
