const db = require('../config/db');

const getPortfolioByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM portfolio WHERE user_id = ?', [userId]);
  return rows;
};

const addStock = async (userId, stock_symbol, quantity, buy_price, buy_date) => {
  await db.query('INSERT INTO portfolio (user_id, stock_symbol, quantity, buy_price, buy_date) VALUES (?, ?, ?, ?, ?)', 
  [userId, stock_symbol, quantity, buy_price, buy_date]);
};

const removeStock = async (stockId, userId) => {
  await db.query('DELETE FROM portfolio WHERE id = ? AND user_id = ?', [stockId, userId]);
};

const updateStock = async (stockId, userId, quantity, buy_price) => {
  await db.query('UPDATE portfolio SET quantity = ?, buy_price = ? WHERE id = ? AND user_id = ?', 
  [quantity, buy_price, stockId, userId]);
};

const getAllPortfolios = async () => {
  const [rows] = await db.query('SELECT * FROM portfolio');
  return rows;
};

module.exports = { getPortfolioByUserId, addStock, removeStock, updateStock, getAllPortfolios };
