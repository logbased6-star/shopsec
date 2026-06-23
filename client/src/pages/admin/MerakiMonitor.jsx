import { useState, useEffect } from 'react';

export default function MerakiMonitor() {
  const [traffic, setTraffic] = useState([]);
  const [clients, setClients] = useState([]);
  const [security, setSecurity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/meraki/traffic', { headers }).then(r => r.json()),
      fetch('/api/meraki/clients', { headers }).then(r => r.json()),
      fetch('/api/meraki/security', { headers }).then(r => r.json()),
    ])
      .then(([t, c, s]) => {
        setTraffic(Array.isArray(t) ? t : []);
        setClients(Array.isArray(c) ? c : []);
        setSecurity(Array.isArray(s?.events) ? s.events : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to Meraki API');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6 text-soc-muted">Loading Meraki data...</p>;

  if (error) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meraki Network Monitor</h1>
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        ⚠️ {error} — Make sure your MERAKI_API_KEY and MERAKI_NETWORK_ID are set correctly in Render environment variables.
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Meraki Network Monitor</h1>

      {/* Ports & Protocols */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Ports & Protocols</h2>
        {traffic.length === 0 ? (
          <p className="text-soc-muted">No traffic data available — no physical Meraki device connected.</p>
        ) : (
          <table className="w-full text-sm border border-soc-border">
            <thead className="bg-soc-panel2">
              <tr>
                <th className="p-2 text-left">Application</th>
                <th className="p-2 text-left">Protocol</th>
                <th className="p-2 text-left">Port</th>
                <th className="p-2 text-left">Sent (KB)</th>
                <th className="p-2 text-left">Received (KB)</th>
              </tr>
            </thead>
            <tbody>
              {traffic.map((t, i) => (
                <tr key={i} className="border-t border-soc-border">
                  <td className="p-2">{t.application}</td>
                  <td className="p-2">{t.protocol}</td>
                  <td className="p-2">{t.port}</td>
                  <td className="p-2">{(t.sent / 1024).toFixed(2)}</td>
                  <td className="p-2">{(t.recv / 1024).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Connected Clients */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Who is Connecting</h2>
        {clients.length === 0 ? (
          <p className="text-soc-muted">No clients found — no physical Meraki device connected.</p>
        ) : (
          <table className="w-full text-sm border border-soc-border">
            <thead className="bg-soc-panel2">
              <tr>
                <th className="p-2 text-left">IP</th>
                <th className="p-2 text-left">MAC</th>
                <th className="p-2 text-left">Usage (KB)</th>
                <th className="p-2 text-left">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={i} className="border-t border-soc-border">
                  <td className="p-2">{c.ip}</td>
                  <td className="p-2">{c.mac}</td>
                  <td className="p-2">{(c.usage?.total / 1024).toFixed(2)}</td>
                  <td className="p-2">{new Date(c.lastSeen).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Security Events */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Attack / Threat Detection</h2>
        {security.length === 0 ? (
          <p className="text-soc-muted">No security events — no physical Meraki device connected.</p>
        ) : (
          <table className="w-full text-sm border border-soc-border">
            <thead className="bg-soc-panel2">
              <tr>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {security.map((e, i) => (
                <tr key={i} className="border-t border-soc-border">
                  <td className="p-2">{new Date(e.occurredAt).toLocaleString()}</td>
                  <td className="p-2">{e.type}</td>
                  <td className="p-2">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
