import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/portscan — your SOC tool sends results here
router.post('/', async (req, res) => {
  try {
    const { serverName, serverIp, ports } = req.body;

    // ports = [{ port: 80, protocol: "tcp", status: "open", service: "http" }]
    await prisma.portScan.deleteMany({
      where: { serverName } // clear old results for this server
    });

    await prisma.portScan.createMany({
      data: ports.map(p => ({
        serverName,
        serverIp,
        port: p.port,
        protocol: p.protocol,
        status: p.status,
        service: p.service || null
      }))
    });

    res.json({ success: true, message: `Saved ${ports.length} ports for ${serverName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/portscan — admin panel fetches results
router.get('/', async (req, res) => {
  try {
    const scans = await prisma.portScan.findMany({
      orderBy: { scannedAt: 'desc' }
    });

    // Group by server name
    const grouped = scans.reduce((acc, scan) => {
      if (!acc[scan.serverName]) {
        acc[scan.serverName] = {
          serverName: scan.serverName,
          serverIp: scan.serverIp,
          scannedAt: scan.scannedAt,
          ports: []
        };
      }
      acc[scan.serverName].ports.push({
        port: scan.port,
        protocol: scan.protocol,
        status: scan.status,
        service: scan.service
      });
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
