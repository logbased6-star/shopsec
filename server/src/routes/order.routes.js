const express = require("express");
const { checkout, listMyOrders } = require("../controllers/order.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/checkout", checkout);
router.get("/", listMyOrders);

module.exports = router;
