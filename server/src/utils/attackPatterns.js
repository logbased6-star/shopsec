// NOTE: This is a teaching-grade pattern matcher for a portfolio / learning
// project. It is intentionally simple (regex over request input) so the
// detection logic is easy to read and demo. It is NOT a substitute for a
// real WAF (e.g. ModSecurity, Cloudflare, a Meraki MX with IDS/IPS enabled)
// in a production system.
//
// Patterns are written to require real attack *shape* (a quote chained
// with a SQL keyword, a comment terminator, a tag, etc.) rather than single
// punctuation marks, so that ordinary input - apostrophes in names like
// "O'Brien", hex colors like "#4338CA", em dashes, etc. - doesn't get
// flagged. Tune these further if you see false positives in your own data.

const SQLI_PATTERNS = [
  /\bunion\b\s+(\ball\b\s+)?\bselect\b/i,
  /\bselect\b[\s\S]{0,80}\bfrom\b[\s\S]{0,80}\bwhere\b/i,
  /\binsert\b\s+\binto\b[\s\S]{0,40}\bvalues\b/i,
  /\bdrop\b\s+\btable\b/i,
  /\bor\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\s*(--|#|;|$)/i,
  /\band\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\s*(--|#)/i,
  /'\s*(or|and|union|select|insert|drop|delete|update|exec)\b/i,
  /;\s*(drop|delete|shutdown|update|exec)\b/i,
  /\bxp_cmdshell\b/i,
  /\bsleep\(\s*\d+\s*\)/i,
];

const XSS_PATTERNS = [
  /<script\b[^>]*>/i,
  /on\w+\s*=\s*["']?\s*javascript:/i,
  /<img[^>]+src\s*=\s*["']?\s*javascript:/i,
  /<iframe\b[^>]*>/i,
  /<svg[^>]*on\w+\s*=/i,
  /document\.cookie/i,
];

const PATH_TRAVERSAL_PATTERNS = [/\.\.\/\.\.\//, /\.\.\\\.\.\\/, /etc\/passwd/i, /\bwin\.ini\b/i];

// Fields we never scan: free-form secrets/text where ordinary punctuation
// is expected and Prisma's parameterized queries already make them safe
// from injection regardless of detection.
const EXCLUDED_KEYS = new Set(["password", "description", "details"]);

function scanValue(value, patterns) {
  if (typeof value !== "string") return false;
  return patterns.some((re) => re.test(value));
}

function deepScan(obj, patterns, depth = 0) {
  if (depth > 4 || obj === null || obj === undefined) return false;
  if (typeof obj === "string") return scanValue(obj, patterns);
  if (Array.isArray(obj)) return obj.some((v) => deepScan(v, patterns, depth + 1));
  if (typeof obj === "object") {
    return Object.entries(obj).some(([key, value]) => {
      if (EXCLUDED_KEYS.has(key.toLowerCase())) return false;
      return deepScan(value, patterns, depth + 1);
    });
  }
  return false;
}

/**
 * Inspects a request's body/query/params for known attack signatures.
 * Returns { matched: boolean, type: 'SQLI_ATTEMPT' | 'XSS_ATTEMPT' | 'PATH_TRAVERSAL_ATTEMPT' | null }
 */
function detectAttack(req) {
  const targets = [req.body, req.query, req.params];
  for (const target of targets) {
    if (deepScan(target, SQLI_PATTERNS)) return { matched: true, type: "SQLI_ATTEMPT" };
    if (deepScan(target, XSS_PATTERNS)) return { matched: true, type: "XSS_ATTEMPT" };
    if (deepScan(target, PATH_TRAVERSAL_PATTERNS)) return { matched: true, type: "PATH_TRAVERSAL_ATTEMPT" };
  }
  return { matched: false, type: null };
}

module.exports = { detectAttack };
