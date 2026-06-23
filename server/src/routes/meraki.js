const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getNetworkTraffic, getConnectedClients, getSecurityEvents } = require('../utils/meraki');
 
const router = express.Router();
router.use(requireAuth, requireAdmin);
 
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
