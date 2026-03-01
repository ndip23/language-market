const axios = require('axios');

const payinApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payin' });
const payoutApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payout' });

// 1. Get Admin Token
const login = async () => {
  const { data } = await payinApi.post('/admin/auth', {
    email: process.env.SWYCHR_EMAIL,
    password: process.env.SWYCHR_PASSWORD,
  });
  return data.token;
};

// 2. Create the Luxury Payment Link
const createPaymentLink = async (token, payload) => {
  const { data } = await payinApi.post('/create_payment_links', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // Returns the payment link and transaction ID
};

// 3. Verify Status
const getPaymentStatus = async (token, transactionId) => {
  const { data } = await payinApi.post('/payment_link_status', { 
    transaction_id: transactionId 
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

module.exports = { login, createPaymentLink, getPaymentStatus };