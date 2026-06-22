const express = require("express");
const { getCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cart.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

module.exports = router;
