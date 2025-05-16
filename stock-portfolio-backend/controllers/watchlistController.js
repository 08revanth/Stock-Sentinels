// controllers/watchlistController.js
const db = require('../config/db'); // Assuming your DB connection pool is here

exports.getWatchlist = async (req, res) => {
    // Ensure user id is present (from protect middleware)
    if (!req.user || !req.user.id) {
      console.error("User ID not found in request in getWatchlist.");
      return res.status(401).json({ message: "Unauthorized: User data missing." });
    }
    const userId = req.user.id;

    console.log(`Fetching watchlist for user ID: ${userId}`); // Debugging
    try {
      // Use exact column names from your MySQL 'watchlist' table
      // Example: SELECT id, stock_symbol FROM watchlist WHERE user_id = ?
      const [rows] = await db.query('SELECT id, user_id, stock_symbol FROM watchlist WHERE user_id = ?', [userId]);
      console.log(`Found ${rows.length} watchlist items.`); // Debugging
      res.json(rows); // Send the array of items (even if empty)
    } catch (err) {
      console.error("Error fetching watchlist from DB:", err);
      res.status(500).json({ message: 'Server error getting watchlist' }); // Specific message
    }
};

exports.addToWatchlist = async (req, res) => {
   if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User data missing." });
   }
    const userId = req.user.id;
    // Frontend Dashboard sends { stock_symbol: '...' }
    const { stock_symbol } = req.body;

    if (!stock_symbol) {
        return res.status(400).json({ message: "Stock symbol is required" }); // Matches the 400 error seen
    }
    // Optional: Add check if symbol already exists for this user?
    // Optional: Validate symbol format?

    console.log(`Adding symbol '${stock_symbol}' to watchlist for user ID: ${userId}`); // Debugging
    try {
        // Use exact column names for insert
        const [result] = await db.query('INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)', [userId, stock_symbol.toUpperCase()]); // Save uppercase?
        console.log(`Insert result:`, result);
        // Respond with the newly added item data?
        res.status(201).json({ id: result.insertId, user_id: userId, stock_symbol: stock_symbol.toUpperCase() }); // Return created object
    } catch (err) {
       console.error("Error adding to watchlist:", err);
       // Check for duplicate entry error (e.g., ER_DUP_ENTRY for MySQL)
       if (err.code === 'ER_DUP_ENTRY') {
           return res.status(409).json({ message: `${stock_symbol.toUpperCase()} is already in your watchlist.` }); // Conflict
       }
       res.status(500).json({ message: 'Server error: Failed to add to watchlist' }); // Specific message
    }
};

exports.deleteFromWatchlist = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User data missing." });
     }
    const userId = req.user.id;
    // Get the watchlist item's ID from the route parameter
    const watchlistId = req.params.id; // Match ':id' in the route definition

    if (!watchlistId) {
        return res.status(400).json({ message: "Watchlist item ID is required in URL path." });
    }

    console.log(`Deleting watchlist item ID: ${watchlistId} for user ID: ${userId}`); // Debugging
    try {
        // Use the item's specific ID (primary key) and user ID for deletion
        const [result] = await db.query('DELETE FROM watchlist WHERE id = ? AND user_id = ?', [watchlistId, userId]);

        if (result.affectedRows === 0) {
             // This means either the ID didn't exist or didn't belong to the user
             console.warn(`Watchlist item ID ${watchlistId} not found for user ID ${userId} during delete.`);
            return res.status(404).json({ message: 'Item not found in watchlist or does not belong to user.' });
        }

        console.log(`Delete result:`, result);
        res.status(200).json({ message: 'Removed from watchlist successfully' }); // 200 OK for successful delete

    } catch (err) {
      console.error("Error deleting from watchlist:", err);
      res.status(500).json({ message: 'Server error: Failed to delete from watchlist' }); // Specific message
    }
};

// Note: Make sure the `db` object is correctly configured and exported from `../config/db`