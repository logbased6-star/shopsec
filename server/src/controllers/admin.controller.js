const prisma = require("../config/prisma");

// Admins see login attempts, attack signatures, and account metadata -
// never plaintext passwords. Passwords are excluded from every select below.

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ users });
}

async function updateUserRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;
  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ error: "role must be USER or ADMIN." });
  }
  if (id === req.user.id) {
    return res.status(400).json({ error: "You can't change your own role." });
  }
  const user = await prisma.user
    .update({ where: { id }, data: { role }, select: { id: true, name: true, email: true, role: true } })
    .catch(() => null);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
}

async function listLogs(req, res) {
  const { severity, type, page = 1, pageSize = 50 } = req.query;
  const where = {};
  if (severity) where.severity = severity;
  if (type) where.type = type;

  const take = Math.min(Number(pageSize) || 50, 200);
  const skip = (Number(page) - 1) * take;

  const [logs, total] = await Promise.all([
    prisma.securityLog.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
    prisma.securityLog.count({ where }),
  ]);

  res.json({ logs, total, page: Number(page), pageSize: take });
}

async function getStats(req, res) {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [totalUsers, totalOrders, revenueAgg, blockedIps, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.blockedIp.count(),
    prisma.securityLog.findMany({
      where: { createdAt: { gte: since24h } },
      select: { severity: true, type: true, ip: true, createdAt: true },
    }),
  ]);

  const criticalToday = recentLogs.filter((l) => l.severity === "CRITICAL").length;
  const failedLoginsToday = recentLogs.filter((l) => l.type === "LOGIN_FAILED").length;

  // Bucket the last 24h of logs into hourly counts per severity for the chart.
  const buckets = {};
  for (const log of recentLogs) {
    const hour = new Date(log.createdAt);
    hour.setMinutes(0, 0, 0);
    const key = hour.toISOString();
    if (!buckets[key]) buckets[key] = { time: key, INFO: 0, WARNING: 0, CRITICAL: 0 };
    buckets[key][log.severity] += 1;
  }
  const timeline = Object.values(buckets).sort((a, b) => new Date(a.time) - new Date(b.time));

  // Top attacking IPs (critical events) in the last 24h.
  const ipCounts = {};
  for (const log of recentLogs) {
    if (log.severity !== "CRITICAL") continue;
    ipCounts[log.ip] = (ipCounts[log.ip] || 0) + 1;
  }
  const topAttackingIps = Object.entries(ipCounts)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: revenueAgg._sum.total || 0,
    blockedIps,
    criticalToday,
    failedLoginsToday,
    timeline,
    topAttackingIps,
  });
}

async function listBlockedIps(req, res) {
  const ips = await prisma.blockedIp.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ ips });
}

async function unblockIp(req, res) {
  const id = Number(req.params.id);
  await prisma.blockedIp.delete({ where: { id } }).catch(() => null);
  res.json({ success: true });
}

module.exports = { listUsers, updateUserRole, listLogs, getStats, listBlockedIps, unblockIp };
