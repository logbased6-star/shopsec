const prisma = require("../config/prisma");

async function listProducts(req, res) {
  const { category, search } = req.query;
  const where = {};
  if (category && category !== "all") where.category = category;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  const categories = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });
  res.json({ products, categories: categories.map((c) => c.category) });
}

async function getProduct(req, res) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json({ product });
}

async function createProduct(req, res) {
  const { name, description, price, category, image, stock } = req.body;
  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ error: "name, description, price, and category are required." });
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      category,
      image: image || "https://placehold.co/600x600?text=Product",
      stock: stock !== undefined ? Number(stock) : 100,
    },
  });
  res.status(201).json({ product });
}

async function updateProduct(req, res) {
  const id = Number(req.params.id);
  const { name, description, price, category, image, stock } = req.body;
  const product = await prisma.product
    .update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(stock !== undefined && { stock: Number(stock) }),
      },
    })
    .catch(() => null);
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json({ product });
}

async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } }).catch(() => null);
  res.json({ success: true });
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
