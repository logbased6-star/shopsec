import { useEffect, useState } from "react";
import api from "../../api/client";
import LogRow from "../../components/LogRow";
import useLiveLogs from "../../hooks/useLiveLogs";

const SEVERITIES = ["", "INFO", "WARNING", "CRITICAL"];

export default function Logs() {
  const { liveLogs, connected } = useLiveLogs();
  const [history, setHistory] = useState([]);
  const [severity, setSeverity] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/logs", { params: { severity: severity || undefined, page, pageSize: 50 } })
      .then(({ data }) => {
        setHistory(data.logs);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [severity, page]);

  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-soc-text">Live logs</h1>
          <p className="text-sm text-soc-muted mt-1">
            Every login, registration, and detected attack signature, in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-soc-muted">
          <span className={`pulse-dot w-2 h-2 rounded-full ${connected ? "text-soc-green" : "text-soc-red"}`} />
          {connected ? "LIVE" : "DISCONNECTED"}
        </div>
      </div>

      <div className="bg-soc-panel border border-soc-border rounded-xl overflow-hidden mb-6">
        <p className="text-sm text-soc-muted px-4 pt-4 pb-2">Streaming now</p>
        <div className="max-h-64 overflow-y-auto divide-y divide-soc-border/60">
          {liveLogs.length === 0 ? (
            <p className="text-sm text-soc-muted px-4 pb-4">Waiting for new events...</p>
          ) : (
            liveLogs.map((log) => <LogRow key={`live-${log.id}`} log={log} />)
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {SEVERITIES.map((s) => (
          <button
            key={s || "ALL"}
            onClick={() => {
              setSeverity(s);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase border transition-colors ${
              severity === s
                ? "bg-soc-panel2 border-soc-green/50 text-soc-green"
                : "border-soc-border text-soc-muted hover:text-soc-text"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="bg-soc-panel border border-soc-border rounded-xl overflow-hidden">
        <p className="text-sm text-soc-muted px-4 pt-4 pb-2">History</p>
        <div className="divide-y divide-soc-border/60">
          {loading ? (
            <p className="text-sm text-soc-muted px-4 pb-4">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-soc-muted px-4 pb-4">No logs match this filter.</p>
          ) : (
            history.map((log) => <LogRow key={log.id} log={log} />)
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-soc-border text-xs font-mono text-soc-muted">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 rounded border border-soc-border disabled:opacity-30"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 rounded border border-soc-border disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
