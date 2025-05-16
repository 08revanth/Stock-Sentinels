const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
  return rows[0];
};

const createUser = async (username, email, hashedPassword) => {
  await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
};

const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, username, email, isAdmin FROM users');
  return rows;
};

module.exports = { findByEmail, findById, createUser, getAllUsers };
