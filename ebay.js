const axios = require('axios');

const EBAY_APP_ID = process.env.EBAY_APP_ID;
const EBAY_OAUTH_TOKEN = process.env.EBAY_OAUTH_TOKEN;
//const BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
const BROWSE_API = 'https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search';


async function fetchCardData(query) {
  try {
    const response = await axios.get(`${BROWSE_API}?q=${encodeURIComponent(query)}&limit=10`, {
      headers: {
        Authorization: `Bearer ${EBAY_OAUTH_TOKEN}`,
      },
    });

    const items = response.data.itemSummaries || [];

    if (items.length === 0) {
      console.warn(`No sold items found for: ${query}`);
      return null;
    }

    const prices = items
      .filter(item => item.price && item.price.value)
      .map(item => parseFloat(item.price.value));

    const averagePrice =
      prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 'N/A';

    return {
      averagePrice,
      itemCount: prices.length,
    };
  } catch (error) {
    console.error('Error fetching eBay sold data:', error.message);
    return null;
  }
}

async function fetchLowestPrices(query) {
  try {
    const binUrl = `${BROWSE_API}?q=${encodeURIComponent(
      query
    )}&filter=buyingOptions:{FIXED_PRICE},conditionIds:{1000|3000}&sort=price asc&limit=1`;

    const aucUrl = `${BROWSE_API}?q=${encodeURIComponent(
      query
    )}&filter=buyingOptions:{AUCTION},conditionIds:{1000|3000}&sort=price asc&limit=1`;

    const [binRes, aucRes] = await Promise.all([
      axios.get(binUrl, {
        headers: { Authorization: `Bearer ${EBAY_OAUTH_TOKEN}` },
      }),
      axios.get(aucUrl, {
        headers: { Authorization: `Bearer ${EBAY_OAUTH_TOKEN}` },
      }),
    ]);

    const binItem = binRes.data.itemSummaries?.[0];
    const aucItem = aucRes.data.itemSummaries?.[0];

    return {
      buyNow: binItem
        ? {
            title: binItem.title,
            price: `${binItem.price.value} ${binItem.price.currency}`,
            url: binItem.itemWebUrl,
          }
        : null,
      auction: aucItem
        ? {
            title: aucItem.title,
            price: `${aucItem.price.value} ${aucItem.price.currency}`,
            url: aucItem.itemWebUrl,
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching eBay lowest prices:', error.message);
    return { buyNow: null, auction: null };
  }
}

module.exports = {
  fetchCardData,
  fetchLowestPrices,
};
