import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, ShoppingBag, DollarSign, ShieldOff, AlertTriangle } from "lucide-react";
import api from "../../api/client";
import StatCard from "../../components/StatCard";
import LogRow from "../../components/LogRow";
import useLiveLogs from "../../hooks/useLiveLogs";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { liveLogs, connected } = useLiveLogs();

  useEffect(() => {
    const load = () => api.get("/admin/stats").then(({ data }) => setStats(data));
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <div className="p-8 text-soc-muted">Loading dashboard...</div>;
  }

  const chartData = stats.timeline.map((t) => ({
    ...t,
    label: new Date(t.time).toLocaleTimeString([], { hour: "2-digit" }),
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-soc-text">Security overview</h1>
          <p className="text-sm text-soc-muted mt-1">Live status across the last 24 hours.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-soc-muted">
          <span className={`pulse-dot w-2 h-2 rounded-full ${connected ? "text-soc-green" : "text-soc-red"}`} />
          {connected ? "LIVE" : "DISCONNECTED"}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Orders" value={stats.totalOrders} icon={ShoppingBag} />
        <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard
          label="Attacks (24h)"
          value={stats.criticalToday}
          icon={AlertTriangle}
          accent="text-soc-red"
        />
        <StatCard label="Blocked IPs" value={stats.blockedIps} icon={ShieldOff} accent="text-soc-amber" />
      </div>

      <div className="mt-8 bg-soc-panel border border-soc-border rounded-xl p-5">
        <p className="text-sm text-soc-muted mb-4">Events per hour</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="crit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5C5C" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#FF5C5C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="warn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="info" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3DDC84" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3DDC84" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#232938" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#7C8699" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#7C8699" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#131722", border: "1px solid #232938", borderRadius: 8 }}
              labelStyle={{ color: "#D7DCE5" }}
            />
            <Area type="monotone" dataKey="CRITICAL" stroke="#FF5C5C" fill="url(#crit)" strokeWidth={2} />
            <Area type="monotone" dataKey="WARNING" stroke="#F5A623" fill="url(#warn)" strokeWidth={2} />
            <Area type="monotone" dataKey="INFO" stroke="#3DDC84" fill="url(#info)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-soc-panel border border-soc-border rounded-xl p-5">
          <p className="text-sm text-soc-muted mb-4">Top attacking IPs (24h)</p>
          {stats.topAttackingIps.length === 0 ? (
            <p className="text-sm text-soc-muted">No attack signatures detected. All quiet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.topAttackingIps.map((row) => (
                <li key={row.ip} className="flex justify-between font-mono text-sm">
                  <span className="text-soc-text">{row.ip}</span>
                  <span className="text-soc-red">{row.count} hits</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 bg-soc-panel border border-soc-border rounded-xl overflow-hidden">
          <p className="text-sm text-soc-muted px-5 pt-5 pb-3">Live feed</p>
          <div className="max-h-72 overflow-y-auto divide-y divide-soc-border/60">
            {liveLogs.length === 0 ? (
              <p className="text-sm text-soc-muted px-5 pb-5">Waiting for new events...</p>
            ) : (
              liveLogs.slice(0, 12).map((log) => <LogRow key={log.id} log={log} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
