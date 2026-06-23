import { useState, useEffect } from 'react';

export default function PortScanner() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/portscan', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setServers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load port scan results');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6 text-soc-muted">Loading scan results...</p>;

  if (error) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Port Scanner</h1>
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        ⚠️ {error}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Port Scan Results</h1>

      {servers.length === 0 ? (
        <div className="bg-soc-panel2 border border-soc-border rounded-lg p-6 text-soc-muted">
          <p className="mb-2">No scan results yet.</p>
          <p className="text-sm">Send scan results from your SOC tool to:</p>
          <code className="text-soc-green text-sm">
            POST https://shopsec-3uzj.onrender.com/api/portscan
          </code>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servers.map(s => (
              <div
                key={s.serverName}
                onClick={() => setSelected(s)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors
                  ${selected?.serverName === s.serverName
                    ? 'border-soc-green bg-soc-panel2'
                    : 'border-soc-border hover:bg-soc-panel2'}`}
              >
                <p className="font-bold text-soc-text">{s.serverName}</p>
                <p className="text-sm text-soc-muted">{s.serverIp}</p>
                <p className="text-sm mt-1">
                  <span className="text-green-400 font-semibold">
                    {s.ports.filter(p => p.status === 'open').length} open
                  </span>
                  {' / '}
                  <span className="text-red-400">
                    {s.ports.filter(p => p.status === 'closed').length} closed
                  </span>
                </p>
                <p className="text-xs text-soc-muted mt-1">
                  Scanned: {new Date(s.scannedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {selected && (
            <div>
              <h2 className="text-xl font-semibold mb-3">
                {selected.serverName} ({selected.serverIp})
              </h2>
              <table className="w-full text-sm border border-soc-border">
                <thead className="bg-soc-panel2">
                  <tr>
                    <th className="p-2 text-left">Port</th>
                    <th className="p-2 text-left">Protocol</th>
                    <th className="p-2 text-left">Service</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.ports
                    .sort((a, b) => a.port - b.port)
                    .map((p, i) => (
                      <tr key={i} className="border-t border-soc-border">
                        <td className="p-2">{p.port}</td>
                        <td className="p-2">{p.protocol}</td>
                        <td className="p-2">{p.service || '—'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold
                            ${p.status === 'open'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'}`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
