import { useState, useEffect } from 'react';

export default function PortScanner() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/portscan', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setServers(data); setLoading(false); });
  }, []);

  if (loading) return <p className="p-6">Loading scan results...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Port Scan Results</h1>

      {/* Server List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {servers.map(s => (
          <div
            key={s.serverName}
            onClick={() => setSelected(s)}
            className={`p-4 border rounded cursor-pointer hover:bg-blue-50 
              ${selected?.serverName === s.serverName ? 'border-blue-500 bg-blue-50' : ''}`}
          >
            <p className="font-bold">{s.serverName}</p>
            <p className="text-sm text-gray-500">{s.serverIp}</p>
            <p className="text-sm mt-1">
              <span className="text-green-600 font-semibold">
                {s.ports.filter(p => p.status === 'open').length} open
              </span>
              {' / '}
              <span className="text-red-500">
                {s.ports.filter(p => p.status === 'closed').length} closed
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Scanned: {new Date(s.scannedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Port Details */}
      {selected && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            {selected.serverName} ({selected.serverIp}) — Port Details
          </h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
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
                  <tr key={i} className="border-t">
                    <td className="p-2">{p.port}</td>
                    <td className="p-2">{p.protocol}</td>
                    <td className="p-2">{p.service || '—'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${p.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
