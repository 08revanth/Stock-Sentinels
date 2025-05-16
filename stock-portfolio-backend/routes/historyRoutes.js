const express = require('express');
const router = express.Router();
// const History = require('../models/History'); // REMOVE: No longer needed for this route
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db'); // <--- IMPORT your MySQL connection pool/promise pool

// @desc    Get user stock history
// @route   GET /api/history
// @access  Private
router.get('/', protect, async (req, res) => {
  // Ensure req.user and req.user.id exist from the 'protect' middleware
  if (!req.user || !req.user.id) {
    console.error('User ID not found in protected route.');
    return res.status(401).json({ message: 'Not authorized, user data missing.' });
  }

  const userId = req.user.id; // Get user ID from middleware

  try {
    console.log(`Fetching history for user ID: ${userId}`); // Debugging

    // --- USE MYSQL QUERY ---
    // Use the SQL query consistent with your controller example and MySQL schema
    // Make sure the column names (user_id, transaction_date) match your MySQL table exactly
    const [rows] = await db.query(
      'SELECT * FROM stock_history WHERE user_id = ? ORDER BY transaction_date DESC',
      [userId]
    );

    console.log(`Found ${rows.length} history records.`); // Debugging
    res.json(rows); // Send the results back

  } catch (err) {
    console.error('Error fetching history from MySQL:', err); // Log the specific error
    res.status(500).json({ message: 'Server error while fetching stock history' });
  }
});

// --- Keep the POST route if you intend to ALSO use Mongoose/MongoDB for adding? ---
// WARNING: Your POST route below STILL uses Mongoose (History model).
// If your entire application should ONLY use MySQL, you need to change
// this POST route as well to use db.query with an INSERT statement.
// If you intend to use BOTH MongoDB and MySQL, that's unusual and complex.
// Assuming you want consistency (MySQL only):
router.post('/', protect, async (req, res) => {
    // THIS ROUTE IS STILL USING MONGOOSE / MONGODB
    // TODO: Refactor this route to use db.query('INSERT INTO stock_history ...')
    // if you want your entire backend to use only MySQL.
    // For now, it will likely fail or interact with a different DB.

    // Example (Conceptual - adapt to your actual table columns):
    /*
    if (!req.user || !req.user.id) {
         return res.status(401).json({ message: 'Not authorized, user data missing.' });
    }
     const userId = req.user.id;
     const { symbol, quantity, price, transaction_type, transaction_date } = req.body; // Adjust fields as needed

     if (!symbol || quantity === undefined || price === undefined || !transaction_type || !transaction_date) {
         return res.status(400).json({ message: 'Missing required fields for history entry.' });
     }

     try {
         const query = 'INSERT INTO stock_history (user_id, stock_symbol, quantity, price, transaction_type, transaction_date) VALUES (?, ?, ?, ?, ?, ?)';
         const [result] = await db.query(query, [userId, symbol, quantity, price, transaction_type, transaction_date]);
         res.status(201).json({ id: result.insertId, userId, symbol, quantity, price, transaction_type, transaction_date }); // Return inserted data
     } catch (err) {
         console.error('Error adding to history (MySQL):', err);
         res.status(500).json({ message: 'Server error while adding to history' });
     }
    */

     // --- Original Mongoose Code (for reference - remove if switching fully to MySQL) ---
     try {
        const History = require('../models/History'); // Temporarily require here if keeping mixed for now
        console.log('Decoded JWT user:', req.user);
        const { symbol, quantity, price, action } = req.body; // Fields based on Mongoose schema
        if (!symbol || quantity == null || price == null || !action ) {
            return res.status(400).json({ message: 'Symbol, quantity, price, and action are required for Mongo history' });
        }
        const newEntry = new History({ // Mongoose instance
             userId: req.user.id, // Assumes req.user.id is compatible with Mongoose ObjectId if mixing DBs - might not be!
             action,
             symbol,
             quantity,
             price,
             date: new Date()
        });
         const saved = await newEntry.save(); // Saves to MongoDB
         res.status(201).json(saved);
    } catch (err) {
        console.error('Error adding to Mongoose history:', err);
        res.status(500).json({ message: 'Server error while adding to Mongoose history' });
    }
     // --- End of Original Mongoose Code ---

});


module.exports = router;