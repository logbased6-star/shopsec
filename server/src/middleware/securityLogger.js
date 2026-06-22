const prisma = require("../config/prisma");
const { detectAttack } = require("../utils/attackPatterns");

function getClientIp(req) {
  // app.js sets `trust proxy` so req.ip reflects the real client IP when
  // deployed behind Render/Railway's load balancer.
  return req.ip || req.connection?.remoteAddress || "unknown";
}

/**
 * Writes one row to SecurityLog and broadcasts it to connected admins.
 * `extra` may include: type, severity, username, userId, details
 */
async function writeLog(req, extra = {}) {
  try {
    const log = await prisma.securityLog.create({
      data: {
        type: extra.type || "INFO",
        severity: extra.severity || "INFO",
        ip: getClientIp(req),
        userAgent: req.headers["user-agent"] || null,
        username: extra.username || null,
        userId: extra.userId || null,
        path: req.originalUrl,
        method: req.method,
        details: extra.details || null,
      },
    });
    // Lazy require avoids a circular dependency between socket.js <-> middleware.
    const { emitLog } = require("../sockets/socket");
    emitLog(log);
    return log;
  } catch (err) {
    console.error("Failed to write security log:", err.message);
    return null;
  }
}

/** Rejects requests from IPs that have already been auto-blocked. */
async function ipBlockGuard(req, res, next) {
  const ip = getClientIp(req);
  try {
    const blocked = await prisma.blockedIp.findUnique({ where: { ip } });
    if (blocked) {
      await writeLog(req, {
        type: "BLOCKED_IP_REQUEST",
        severity: "WARNING",
        details: `Request from a previously blocked IP (reason: ${blocked.reason || "n/a"}).`,
      });
      return res.status(403).json({ error: "Your network address has been temporarily blocked due to suspicious activity." });
    }
  } catch (err) {
    console.error("ipBlockGuard error:", err.message);
  }
  next();
}

/**
 * Scans body/query/params for SQLi / XSS / path-traversal signatures.
 * Logs and blocks the request on a match, then escalates to a full IP
 * block if the same IP trips this several times in a short window.
 */
async function attackScanner(req, res, next) {
  const result = detectAttack(req);
  if (!result.matched) return next();

  const ip = getClientIp(req);
  await writeLog(req, {
    type: result.type,
    severity: "CRITICAL",
    details: `Blocked a likely ${result.type.replace("_", " ").toLowerCase()} on ${req.method} ${req.originalUrl}`,
  });

  try {
    const since = new Date(Date.now() - 10 * 60 * 1000);
    const recentCritical = await prisma.securityLog.count({
      where: { ip, severity: "CRITICAL", createdAt: { gte: since } },
    });
    if (recentCritical >= 3) {
      await prisma.blockedIp.upsert({
        where: { ip },
        update: {},
        create: { ip, reason: `Auto-blocked after ${recentCritical} attack signatures in 10 minutes.` },
      });
    }
  } catch (err) {
    console.error("attackScanner escalation error:", err.message);
  }

  return res.status(400).json({ error: "Request blocked by security filter." });
}

module.exports = { writeLog, ipBlockGuard, attackScanner, getClientIp };
