// controllers/marketController.js
const axios = require('axios');
const db = require('../config/db');

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

if (!API_KEY) {
    console.error("FATAL ERROR: Finnhub API key not found in environment variables.");
}

exports.getMarketNews = async (req, res) => {
    // Fetch general news (category=general)
    const category = 'general';
    try {
        const url = `${FINNHUB_BASE_URL}/news?category=${category}&token=${API_KEY}`;
        console.log(`Fetching Finnhub News: ${url}`); // Log URL (without key in production ideally)
        const response = await axios.get(url);
        res.json(response.data); // Send Finnhub data directly to frontend
    } catch (error) {
        console.error("Finnhub API - Error fetching news:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch market news from provider.' });
    }
};

// Fetch Stock Symbols for an Exchange
exports.getStockSymbols = async (req, res) => {
    const exchange = req.query.exchange; // e.g., 'US', 'NS' (NSE), 'BO' (BSE)
    if (!exchange) {
        return res.status(400).json({ message: 'Exchange query parameter is required (e.g., ?exchange=US).' });
    }
    try {
        const url = `${FINNHUB_BASE_URL}/stock/symbol?exchange=${exchange}&token=${API_KEY}`;
        console.log(`Fetching Finnhub Symbols: ${url}`);
        const response = await axios.get(url);
        // Filter out non-common stock types if desired
        const filtered = response.data.filter(s => s.type === 'COMMON STOCK' || s.type === '' || s.type?.includes('STOCK')); // Adjust filter as needed
        res.json(filtered);
    } catch (error) {
        console.error(`Finnhub API - Error fetching symbols for ${exchange}:`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ message: `Failed to fetch stock symbols for ${exchange}.` });
    }
};

// Fetch Quote for a Specific Symbol
exports.getQuote = async (req, res) => {
    const symbol = req.params.symbol?.toUpperCase();
    if (!symbol) {
        return res.status(400).json({ message: 'Stock symbol parameter is required in URL.' });
    }
    try {
        const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
        console.log(`Fetching Finnhub Quote: ${url}`);
        const response = await axios.get(url);
        // Add timestamp to indicate data freshness
        response.data.timestamp = Date.now();
        res.json(response.data);
    } catch (error) {
         console.error(`Finnhub API - Error fetching quote for ${symbol}:`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ message: `Failed to fetch quote for ${symbol}.` });
    }
};

// Fetch Top 100 US Stocks from DB table
exports.getTop100US = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, company_name, ticker_symbol FROM us_top_100 ORDER BY company_name');
        res.json(rows);
    } catch (error) {
        console.error("DB Error - Fetching Top 100 US:", error.message);
        res.status(500).json({ message: 'Failed to fetch US Top 100 stocks.' });
    }
};

// Fetch Top 100 Nifty Stocks from DB table
exports.getTop100Nifty = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, company_name, ticker_symbol FROM nifty_top_100 ORDER BY company_name');
        res.json(rows);
    } catch (error) {
        console.error("DB Error - Fetching Top 100 Nifty:", error.message);
        res.status(500).json({ message: 'Failed to fetch Nifty Top 100 stocks.' });
    }
};

// Fetch Top 100 Sensex Stocks from DB table
exports.getTop100Sensex = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, company_name, ticker_symbol FROM sensex_top_100 ORDER BY company_name');
        res.json(rows);
    } catch (error) {
        console.error("DB Error - Fetching Top 100 Sensex:", error.message);
        res.status(500).json({ message: 'Failed to fetch Sensex Top 100 stocks.' });
    }
}