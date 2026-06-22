const { verifyToken } = require("../utils/jwt");
const prisma = require("../config/prisma");
const { writeLog } = require("./securityLogger");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: "Invalid session." });
    }
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    await writeLog(req, {
      type: "UNAUTHORIZED",
      severity: "WARNING",
      details: "Invalid or expired JWT presented.",
    });
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    writeLog(req, {
      type: "UNAUTHORIZED",
      severity: "CRITICAL",
      userId: req.user ? req.user.id : null,
      details: `Non-admin attempted to access admin route: ${req.method} ${req.originalUrl}`,
    });
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
