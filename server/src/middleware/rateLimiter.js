const rateLimit = require("express-rate-limit");
const { writeLog } = require("./securityLogger");

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await writeLog(req, {
      type: "RATE_LIMITED",
      severity: "WARNING",
      details: "General API rate limit exceeded (120 req/min).",
    });
    res.status(429).json({ error: "Too many requests. Please slow down." });
  },
});

// Tighter limit on login/register: this is the first line of defense
// against credential-stuffing / brute-force bots.
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await writeLog(req, {
      type: "RATE_LIMITED",
      severity: "CRITICAL",
      username: req.body?.email,
      details: "Auth rate limit exceeded (15 req/5min) - possible brute force.",
    });
    res.status(429).json({ error: "Too many authentication attempts. Try again later." });
  },
});

module.exports = { generalLimiter, authLimiter };
