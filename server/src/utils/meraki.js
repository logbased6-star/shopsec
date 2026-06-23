const MERAKI_KEY = process.env.MERAKI_API_KEY;
const NETWORK_ID = process.env.MERAKI_NETWORK_ID;
const BASE_URL = 'https://api.meraki.com/api/v1';

const headers = {
  'X-Cisco-Meraki-API-Key': MERAKI_KEY,
  'Content-Type': 'application/json'
};

async function getNetworkTraffic() {
  const res = await fetch(
    `${BASE_URL}/networks/${NETWORK_ID}/traffic?timespan=3600`,
    { headers }
  );
  return res.json();
}

async function getConnectedClients() {
  const res = await fetch(
    `${BASE_URL}/networks/${NETWORK_ID}/clients?timespan=3600`,
    { headers }
  );
  return res.json();
}

async function getSecurityEvents() {
  const res = await fetch(
    `${BASE_URL}/networks/${NETWORK_ID}/events?productType=appliance&includedEventTypes[]=ids_alerted`,
    { headers }
  );
  return res.json();
}

module.exports = { getNetworkTraffic, getConnectedClients, getSecurityEvents };

// const MERAKI_KEY = process.env.MERAKI_API_KEY;
// const NETWORK_ID = process.env.MERAKI_NETWORK_ID;
// const BASE_URL = 'https://api.meraki.com/api/v1';

// const headers = {
//   'X-Cisco-Meraki-API-Key': MERAKI_KEY,
//   'Content-Type': 'application/json'
// };

// // Get network traffic (ports & protocols)
// export async function getNetworkTraffic() {
//   const res = await fetch(
//     `${BASE_URL}/networks/${NETWORK_ID}/traffic?timespan=3600`,
//     { headers }
//   );
//   return res.json();
// }

// // Get clients connected to network
// export async function getConnectedClients() {
//   const res = await fetch(
//     `${BASE_URL}/networks/${NETWORK_ID}/clients?timespan=3600`,
//     { headers }
//   );
//   return res.json();
// }

// // Get security events / attack detection
// export async function getSecurityEvents() {
//   const res = await fetch(
//     `${BASE_URL}/networks/${NETWORK_ID}/events?productType=appliance&includedEventTypes[]=ids_alerted`,
//     { headers }
//   );
//   return res.json();
// }
