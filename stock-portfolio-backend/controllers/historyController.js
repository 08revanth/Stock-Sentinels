exports.getStockHistory = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const [rows] = await db.query('SELECT * FROM stock_history WHERE user_id = ? ORDER BY transaction_date DESC', [userId]);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch history' });
    }
  };
  