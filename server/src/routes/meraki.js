const express = require('express');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getNetworkTraffic, getConnectedClients, getSecurityEvents } = require('../utils/meraki');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/traffic', async (req, res) => {
  try {
    const data = await getNetworkTraffic();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Meraki traffic' });
  }
});

router.get('/clients', async (req, res) => {
  try {
    const data = await getConnectedClients();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Meraki clients' });
  }
});

router.get('/security', async (req, res) => {
  try {
    const data = await getSecurityEvents();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Meraki security events' });
  }
});

module.exports = router;
// import express from 'express';
// import { requireAuth, requireAdmin } from '../middleware/auth.js';
// import {
//   getNetworkTraffic,
//   getConnectedClients,
//   getSecurityEvents
// } from '../utils/meraki.js';

// const router = express.Router();

// // All routes require admin
// router.use(requireAuth, requireAdmin);

// router.get('/traffic', async (req, res) => {
//   try {
//     const data = await getNetworkTraffic();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch Meraki traffic' });
//   }
// });

// router.get('/clients', async (req, res) => {
//   try {
//     const data = await getConnectedClients();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch Meraki clients' });
//   }
// });

// router.get('/security', async (req, res) => {
//   try {
//     const data = await getSecurityEvents();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch Meraki security events' });
//   }
// });

// export default router;
