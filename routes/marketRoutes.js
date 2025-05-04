// routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
// Add authentication if needed, but market data might be public
// const { protect } = require('../middleware/authMiddleware');

// General Market News (could be public)
router.get('/news', marketController.getMarketNews);

// Stock Symbols by exchange (could be public or protected)
router.get('/symbols', marketController.getStockSymbols); // Takes ?exchange=XX query

// Stock Quote (could be public or protected)
router.get('/quote/:symbol', marketController.getQuote);

module.exports = router;