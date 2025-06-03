// ebay.js
const axios = require('axios');

async function getAverageEbayPrice(query) {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1&LH_Complete=1`;
    const response = await axios.get(url);
    const matches = [...response.data.matchAll(/\$([\d,]+\.\d{2})/g)];
    const prices = matches.map(m => parseFloat(m[1].replace(/,/g, '')));
    const filtered = prices.filter(p => p > 1 && p < 1000); // filter junk
    const avg = (filtered.reduce((a, b) => a + b, 0) / filtered.length).toFixed(2);
    return avg || 'N/A';
}

module.exports = { getAverageEbayPrice };
