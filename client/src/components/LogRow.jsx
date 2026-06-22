const severityStyles = {
  INFO: "border-soc-green/40 text-soc-green",
  WARNING: "border-soc-amber/40 text-soc-amber",
  CRITICAL: "border-soc-red/40 text-soc-red",
};

export default function LogRow({ log }) {
  const style = severityStyles[log.severity] || severityStyles.INFO;
  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 border-l-2 ${style} bg-soc-panel2/40 text-sm`}>
      <span className="font-mono text-soc-muted shrink-0 w-[150px]">
        {new Date(log.createdAt).toLocaleString()}
      </span>
      <span className={`font-mono shrink-0 w-[150px] ${style.split(" ")[1]}`}>{log.type}</span>
      <span className="font-mono text-soc-muted shrink-0 w-[120px]">{log.ip}</span>
      <span className="text-soc-text/90 truncate">
        {log.username && <span className="font-mono text-soc-text/70 mr-2">[{log.username}]</span>}
        {log.details || `${log.method} ${log.path}`}
      </span>
    </div>
  );
}
