const express = require('express');
const router = express.Router();
// const Watchlist = require('../models/Watchlist'); // <-- REMOVE: No Mongoose model needed here
const watchlistController = require('../controllers/watchlistController'); // <-- IMPORT the controller
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
// --- USE THE CONTROLLER FUNCTION ---
router.get('/', protect, watchlistController.getWatchlist); // Use the MySQL function

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
// --- USE THE CONTROLLER FUNCTION ---
router.post('/', protect, watchlistController.addToWatchlist); // Use the MySQL function

// @desc    Delete stock from watchlist
// @route   DELETE /api/watchlist/:id  <-- Define the parameter :id
// @access  Private
// --- USE THE CONTROLLER FUNCTION ---
router.delete('/:id', protect, watchlistController.deleteFromWatchlist); // Use the MySQL function

module.exports = router;