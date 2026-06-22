const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const { signToken } = require("../utils/jwt");
const { writeLog, getClientIp } = require("../middleware/securityLogger");

const BRUTE_FORCE_WINDOW_MS = 5 * 60 * 1000;
const BRUTE_FORCE_THRESHOLD = 5;

async function checkBruteForce(req, email) {
  const ip = getClientIp(req);
  const since = new Date(Date.now() - BRUTE_FORCE_WINDOW_MS);
  const recentFailures = await prisma.securityLog.count({
    where: {
      type: "LOGIN_FAILED",
      ip,
      username: email,
      createdAt: { gte: since },
    },
  });

  if (recentFailures >= BRUTE_FORCE_THRESHOLD) {
    await writeLog(req, {
      type: "BRUTE_FORCE",
      severity: "CRITICAL",
      username: email,
      details: `${recentFailures + 1} failed login attempts for this account from this IP in 5 minutes.`,
    });
    await prisma.blockedIp.upsert({
      where: { ip },
      update: {},
      create: { ip, reason: `Brute-force login attempts against ${email}.` },
    });
    return true;
  }
  return false;
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await writeLog(req, {
      type: "REGISTER",
      severity: "INFO",
      username: email,
      details: "Registration attempted with an email that's already in use.",
    });
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "USER" },
  });

  await writeLog(req, { type: "REGISTER", severity: "INFO", username: email, userId: user.id });

  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const isBlocked = await checkBruteForce(req, email);
  if (isBlocked) {
    return res.status(429).json({ error: "Too many failed attempts. This IP has been temporarily blocked." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    await writeLog(req, {
      type: "LOGIN_FAILED",
      severity: "WARNING",
      username: email,
      details: user ? "Incorrect password." : "No account exists with this email.",
    });
    // Same generic message either way - don't reveal whether the email exists.
    return res.status(401).json({ error: "Invalid email or password." });
  }

  await writeLog(req, { type: "LOGIN_SUCCESS", severity: "INFO", username: email, userId: user.id });

  const token = signToken({ id: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
