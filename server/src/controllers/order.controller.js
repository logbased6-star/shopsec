const prisma = require("../config/prisma");

async function checkout(req, res) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      return res.status(400).json({ error: `Not enough stock for ${item.product.name}.` });
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  // This is a mock checkout - there's no real payment gateway wired up.
  // It's here to demonstrate the order flow end-to-end for the project.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: req.user.id,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
    return created;
  });

  res.status(201).json({ order });
}

async function listMyOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
}

module.exports = { checkout, listMyOrders };
