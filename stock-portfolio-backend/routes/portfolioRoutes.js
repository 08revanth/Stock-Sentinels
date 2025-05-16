/*const express = require('express');
const axios = require('axios');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/authMiddleware');
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const { protect } = require('../middleware/authMiddleware');
const { deleteStock } = require('../controllers/portfolioController');
const {
  getPortfolio,
  addStockToPortfolio,
  deleteStock  // ✅ Make sure this matches exactly with the export name
} = require('../controllers/portfolioController');

router.get('/stock/:symbol/chart', async (req, res) => {
    try {
      const { symbol } = req.params;
      const response = await axios.get(`https://finnhub.io/api/v1/stock/candle`, {
        params: {
          symbol,
          resolution: 'D',
          from: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // last 30 days
          to: Math.floor(Date.now() / 1000),
          token: FINNHUB_API_KEY,
        },
      });
      res.json(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch chart' });
    }
  });
  
router.get('/', authenticateToken, portfolioController.getPortfolio);
router.post('/', authenticateToken, portfolioController.addStock);
router.delete('/:id', authenticateToken, portfolioController.removeStock);
router.put('/:id', authenticateToken, portfolioController.updateStock);
router.delete('/:id', protect, deleteStock);

module.exports = router;*/

const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  getPortfolio,
  addStock,
  removeStock,
  updateStock,
  deleteStock,
} = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/authMiddleware');
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Chart route
router.get('/stock/:symbol/chart', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`https://finnhub.io/api/v1/stock/candle`, {
      params: {
        symbol,
        resolution: 'D',
        from: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30,
        to: Math.floor(Date.now() / 1000),
        token: FINNHUB_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch chart' });
  }
});

// Portfolio routes
router.get('/', authenticateToken, getPortfolio);
router.post('/', authenticateToken, addStock);
router.put('/:id', authenticateToken, updateStock);

// Use the custom "deleteStock" logic that also logs to history
router.delete('/:id', authenticateToken, deleteStock);

module.exports = router;

