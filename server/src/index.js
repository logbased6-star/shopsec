require("dotenv").config();
const http = require("http");
const app = require("./app");
const { initSocket } = require("./sockets/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server, process.env.CLIENT_ORIGIN || true);

server.listen(PORT, () => {
  console.log(`ShopSec server listening on port ${PORT}`);
});
