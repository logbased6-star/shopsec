export default function StatCard({ label, value, accent = "text-soc-text", icon: Icon }) {
  return (
    <div className="bg-soc-panel border border-soc-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-soc-muted">{label}</p>
        {Icon && <Icon size={16} className="text-soc-muted" />}
      </div>
      <p className={`font-mono text-2xl mt-2 ${accent}`}>{value}</p>
    </div>
  );
}
