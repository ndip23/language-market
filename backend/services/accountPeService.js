const axios = require('axios');

const payinApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payin', timeout: 15000 });
const payoutApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payout', timeout: 15000 });

const accountPeService = {
  login: async () => {
    try {
      const { data } = await payinApi.post('/admin/auth', {
        email: process.env.SWYCHR_EMAIL,
        password: process.env.SWYCHR_PASSWORD,
      });
      return data.token;
    } catch (error) {
      console.error("AccountPe Login Error");
      throw error;
    }
  },

  getFiatRate: async (token, countryCode, amount) => {
    try {
      const { data } = await payoutApi.post('/pusd_to_fiat_rate', 
        { country_code: countryCode, amount: Number(amount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.data.local_amount;
    } catch (err) {
      console.error("Rate Fetch Error:", err.message);
      return null;
    }
  },

  createLink: async (token, payload) => {
    try {
      const { data } = await payinApi.post('/create_payment_links', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error("Link Generation Error:", error.response?.data);
      throw error;
    }
  },

  getSupportedMethods: async (token, countryCode) => {
    const { data } = await payoutApi.post('/payout_methods', { country_code: countryCode }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  },

  createPayout: async (token, payload) => {
    const { data } = await payoutApi.post('/create_transaction', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};

module.exports = accountPeService; // ✅ Exports the entire object