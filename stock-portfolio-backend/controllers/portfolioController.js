const portfolioModel = require('../models/portfolioModel');
const db = require('../config/db'); 

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioModel.getPortfolioByUserId(req.user.id);
    res.json(portfolio);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ error: 'Could not fetch portfolio' });
  }
};

exports.addStock = async (req, res) => {
  const { stock_symbol, quantity, buy_price, buy_date } = req.body;

  try {
    await portfolioModel.addStock(req.user.id, stock_symbol, quantity, buy_price, buy_date);
    res.json({ message: 'Stock added successfully!' });
  } catch (error) {
    console.error('Add stock error:', error);
    res.status(500).json({ error: 'Could not add stock' });
  }
};

exports.removeStock = async (req, res) => {
  const stockId = req.params.id;

  try {
    await portfolioModel.removeStock(stockId, req.user.id);
    res.json({ message: 'Stock removed successfully!' });
  } catch (error) {
    console.error('Remove stock error:', error);
    res.status(500).json({ error: 'Could not remove stock' });
  }
};

exports.updateStock = async (req, res) => {
  const stockId = req.params.id;
  const { quantity, buy_price } = req.body;

  try {
    await portfolioModel.updateStock(stockId, req.user.id, quantity, buy_price);
    res.json({ message: 'Stock updated successfully!' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Could not update stock' });
  }
};

exports.deleteStock = async (req, res) => {
  const userId = req.user.id;
  const stockId = req.params.id;

  try {
    const [stock] = await db.query('SELECT * FROM portfolio WHERE id = ? AND user_id = ?', [stockId, userId]);
    if (!stock.length) return res.status(404).json({ message: 'Stock not found' });

    const s = stock[0];
    await db.query(
      'INSERT INTO stock_history (user_id, stock_symbol, quantity, price, transaction_type, transaction_date) VALUES (?, ?, ?, ?, "SELL", ?)',
      [userId, s.stock_symbol, s.quantity, s.buy_price, new Date()]
    );

    await db.query('DELETE FROM portfolio WHERE id = ? AND user_id = ?', [stockId, userId]);
    res.json({ message: 'Stock sold and moved to history' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

