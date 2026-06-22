const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const products = [
  // Electronics
  { name: "Aurora Wireless Headphones", description: "Over-ear ANC headphones with 40h battery life and plush memory-foam cushions.", price: 89.99, category: "Electronics", image: "https://placehold.co/600x600/1e293b/ffffff?text=Headphones", stock: 60 },
  { name: "Pulse Smartwatch", description: "AMOLED smartwatch with heart-rate, SpO2, and 10-day battery.", price: 129.0, category: "Electronics", image: "https://placehold.co/600x600/1e293b/ffffff?text=Smartwatch", stock: 45 },
  { name: "Nimbus Portable SSD 1TB", description: "USB-C external SSD, 1050MB/s read speeds, fits in a pocket.", price: 99.5, category: "Electronics", image: "https://placehold.co/600x600/1e293b/ffffff?text=SSD", stock: 80 },
  { name: "Orbit Mechanical Keyboard", description: "Hot-swappable 75% mechanical keyboard with PBT keycaps.", price: 74.0, category: "Electronics", image: "https://placehold.co/600x600/1e293b/ffffff?text=Keyboard", stock: 50 },
  // Fashion
  { name: "Drift Canvas Jacket", description: "Water-resistant canvas jacket with a quilted lining for cold mornings.", price: 64.99, category: "Fashion", image: "https://placehold.co/600x600/334155/ffffff?text=Jacket", stock: 70 },
  { name: "Sable Leather Wallet", description: "Slim full-grain leather wallet with RFID-blocking lining.", price: 32.0, category: "Fashion", image: "https://placehold.co/600x600/334155/ffffff?text=Wallet", stock: 100 },
  { name: "Trailrunner Sneakers", description: "Lightweight breathable sneakers built for all-day wear.", price: 54.5, category: "Fashion", image: "https://placehold.co/600x600/334155/ffffff?text=Sneakers", stock: 65 },
  // Home & Kitchen
  { name: "Ember Ceramic Mug Set", description: "Set of 4 hand-glazed ceramic mugs, dishwasher safe.", price: 24.0, category: "Home & Kitchen", image: "https://placehold.co/600x600/3f3f46/ffffff?text=Mug+Set", stock: 90 },
  { name: "Halo Desk Lamp", description: "Dimmable LED desk lamp with a wireless charging base.", price: 38.0, category: "Home & Kitchen", image: "https://placehold.co/600x600/3f3f46/ffffff?text=Desk+Lamp", stock: 55 },
  { name: "Verdant Plant Stand", description: "3-tier walnut-finish plant stand for small apartments.", price: 41.0, category: "Home & Kitchen", image: "https://placehold.co/600x600/3f3f46/ffffff?text=Plant+Stand", stock: 40 },
  // Books
  { name: "The Quiet Algorithm", description: "A novel about a programmer untangling a decades-old mystery in legacy code.", price: 15.99, category: "Books", image: "https://placehold.co/600x600/52525b/ffffff?text=Book", stock: 120 },
  { name: "Foundations of Network Defense", description: "A practical guide to detection, logging, and incident response.", price: 28.0, category: "Books", image: "https://placehold.co/600x600/52525b/ffffff?text=Book", stock: 75 },
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopsec.dev" },
    update: {},
    create: {
      name: "Site Admin",
      email: "admin@shopsec.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const demoPassword = await bcrypt.hash("Demo@12345", 12);
  await prisma.user.upsert({
    where: { email: "demo@shopsec.dev" },
    update: {},
    create: {
      name: "Demo Shopper",
      email: "demo@shopsec.dev",
      password: demoPassword,
      role: "USER",
    },
  });

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login  -> admin@shopsec.dev / Admin@12345");
  console.log("Demo login   -> demo@shopsec.dev / Demo@12345");
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
