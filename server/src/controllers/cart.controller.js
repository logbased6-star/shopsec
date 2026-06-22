const prisma = require("../config/prisma");

async function getCart(req, res) {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  res.json({ items });
}

async function addToCart(req, res) {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: "productId is required." });

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return res.status(404).json({ error: "Product not found." });

  const qty = Math.max(1, Number(quantity) || 1);

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId: product.id } },
    update: { quantity: { increment: qty } },
    create: { userId: req.user.id, productId: product.id, quantity: qty },
    include: { product: true },
  });
  res.status(201).json({ item });
}

async function updateCartItem(req, res) {
  const id = Number(req.params.id);
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "quantity must be at least 1." });
  }
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ error: "Cart item not found." });
  }
  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity: Number(quantity) },
    include: { product: true },
  });
  res.json({ item: updated });
}

async function removeCartItem(req, res) {
  const id = Number(req.params.id);
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ error: "Cart item not found." });
  }
  await prisma.cartItem.delete({ where: { id } });
  res.json({ success: true });
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
