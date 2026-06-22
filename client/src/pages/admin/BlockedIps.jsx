import { useEffect, useState } from "react";
import api from "../../api/client";

export default function BlockedIps() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/admin/blocked-ips")
      .then(({ data }) => setIps(data.ips))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function unblock(id) {
    await api.delete(`/admin/blocked-ips/${id}`);
    load();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-soc-text">Blocked IPs</h1>
      <p className="text-sm text-soc-muted mt-1">
        Addresses auto-blocked after repeated brute-force attempts or attack signatures.
      </p>

      <div className="mt-6 bg-soc-panel border border-soc-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-soc-muted border-b border-soc-border">
              <th className="px-4 py-3 font-normal">IP address</th>
              <th className="px-4 py-3 font-normal">Reason</th>
              <th className="px-4 py-3 font-normal">Blocked at</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border/60">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-soc-muted">
                  Loading...
                </td>
              </tr>
            ) : ips.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-soc-muted">
                  No IPs are currently blocked.
                </td>
              </tr>
            ) : (
              ips.map((row) => (
                <tr key={row.id} className="text-soc-text">
                  <td className="px-4 py-3 font-mono text-soc-red">{row.ip}</td>
                  <td className="px-4 py-3 text-soc-muted">{row.reason}</td>
                  <td className="px-4 py-3 font-mono text-soc-muted">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => unblock(row.id)}
                      className="text-xs font-mono text-soc-muted hover:text-soc-green border border-soc-border rounded px-2 py-1"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
