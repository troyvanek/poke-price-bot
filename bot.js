// File: src/ebay.js
const axios = require('axios');

const EBAY_APP_ID = process.env.EBAY_APP_ID;
const BASE_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';
const BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item_summary/search';

const headers = {
  'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.EBAY_OAUTH_TOKEN}`
};

async function getAverageEbayPrice(query) {
  try {
    const url = `${BROWSE_API}?q=${encodeURIComponent(query)}&filter=conditionIds:{1000|3000},priceCurrency:USD&limit=4&sort=price desc`;
    const res = await axios.get(url, { headers });
    const items = res.data.itemSummaries || [];
    const prices = items.map(item => item.price.value).filter(Number);
    const avg = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 'N/A';
    return avg;
  } catch (err) {
    console.error('Error fetching eBay price:', err);
    return 'Error';
  }
}

async function getTopCards() {
  const popular = ['Charizard', 'Pikachu', 'Blastoise', 'Lugia', 'Gengar'];
  const results = [];

  for (const name of popular) {
    const query = `${name} PSA`;
    const soldUrl = `${BROWSE_API}?q=${encodeURIComponent(query)}&filter=buyingOptions:{FIXED_PRICE},conditions:{1000|3000},priceCurrency:USD&sort=price desc&limit=1`; // Last sold
    const binUrl = `${BROWSE_API}?q=${encodeURIComponent(query)}&filter=buyingOptions:{FIXED_PRICE},conditions:{1000|3000}&sort=price asc&limit=1`;
    const aucUrl = `${BROWSE_API}?q=${encodeURIComponent(query)}&filter=buyingOptions:{AUCTION},conditions:{1000|3000}&sort=price asc&limit=1`;

    try {
      const [sold, bin, auc] = await Promise.all([
        axios.get(soldUrl, { headers }),
        axios.get(binUrl, { headers }),
        axios.get(aucUrl, { headers })
      ]);

      results.push({
        name,
        soldPrice: sold.data.itemSummaries?.[0]?.price?.value || 'N/A',
        binPrice: bin.data.itemSummaries?.[0]?.price?.value || 'N/A',
        binLink: bin.data.itemSummaries?.[0]?.itemWebUrl || '#',
        auctionPrice: auc.data.itemSummaries?.[0]?.price?.value || 'N/A',
        auctionLink: auc.data.itemSummaries?.[0]?.itemWebUrl || '#'
      });
    } catch (err) {
      console.error(`Error fetching data for ${name}:`, err.message);
    }
  }

  return results;
}

module.exports = {
  getAverageEbayPrice,
  getTopCards
};
