const express = require("express");
const {
  listUsers,
  updateUserRole,
  listLogs,
  getStats,
  listBlockedIps,
  unblockIp,
} = require("../controllers/admin.controller");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);

router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);

router.get("/logs", listLogs);

router.get("/blocked-ips", listBlockedIps);
router.delete("/blocked-ips/:id", unblockIp);

// Convenience aliases so the admin product manager can hit /api/admin/products/*
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
