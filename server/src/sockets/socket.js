const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const prisma = require("../config/prisma");

let ioInstance = null;

function initSocket(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  });

  // Only logged-in admins may join the "admin-room" that receives live logs.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || user.role !== "ADMIN") {
        return next(new Error("Admin access required"));
      }
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join("admin-room");
    socket.on("disconnect", () => {});
  });

  ioInstance = io;
  return io;
}

function getIO() {
  return ioInstance;
}

// Broadcasts a freshly-created SecurityLog row to every connected admin.
function emitLog(log) {
  if (ioInstance) {
    ioInstance.to("admin-room").emit("new-log", log);
  }
}

module.exports = { initSocket, getIO, emitLog };
