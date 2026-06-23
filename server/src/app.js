const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const { ipBlockGuard, attackScanner } = require("./middleware/securityLogger");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const merakiRoutes = require("./routes/meraki");
const portScanRoutes = require("./routes/portscan");

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", ipBlockGuard);
app.use("/api", generalLimiter);
app.use("/api", attackScanner);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meraki", merakiRoutes);
app.use("/api/portscan", portScanRoutes);

const clientDist = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use(errorHandler);
module.exports = app;

// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// const authRoutes = require("./routes/auth.routes");
// const productRoutes = require("./routes/product.routes");
// const cartRoutes = require("./routes/cart.routes");
// const orderRoutes = require("./routes/order.routes");
// const adminRoutes = require("./routes/admin.routes");

// const { ipBlockGuard, attackScanner } = require("./middleware/securityLogger");
// const { generalLimiter } = require("./middleware/rateLimiter");
// const errorHandler = require("./middleware/errorHandler");

// const app = express();
// import merakiRoutes from './routes/meraki.js';
// app.use('/api/meraki', merakiRoutes);
// // Render/Railway sit behind a reverse proxy - this makes req.ip reflect
// // the real client IP (critical for accurate security logging).
// app.set("trust proxy", 1);

// app.use(helmet({ contentSecurityPolicy: false }));
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN || true,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "1mb" }));
// app.use(morgan("dev"));

// app.use("/api", ipBlockGuard);
// app.use("/api", generalLimiter);
// app.use("/api", attackScanner);

// app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminRoutes);

// // Serve the built React app in production (single-service deploy on Render).
// const clientDist = path.join(__dirname, "../../client/dist");
// app.use(express.static(clientDist));
// app.get("*", (req, res, next) => {
//   if (req.originalUrl.startsWith("/api")) return next();
//   res.sendFile(path.join(clientDist, "index.html"), (err) => {
//     if (err) next();
//   });
// });

// app.use(errorHandler);

// module.exports = app;
