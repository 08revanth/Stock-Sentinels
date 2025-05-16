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
router.get('/top100/us', marketController.getTop100US);
router.get('/top100/nifty', marketController.getTop100Nifty);
router.get('/top100/sensex', marketController.getTop100Sensex);

module.exports = router;