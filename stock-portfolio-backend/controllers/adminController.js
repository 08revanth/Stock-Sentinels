const userModel = require('../models/userModel');
const portfolioModel = require('../models/portfolioModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await portfolioModel.getAllPortfolios();
    res.json(portfolios);
  } catch (error) {
    console.error('Admin get portfolios error:', error);
    res.status(500).json({ error: 'Could not fetch portfolios' });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
      // Dummy dashboard data or admin info
      res.status(200).json({ message: "Welcome to the Admin Dashboard" });
  } catch (error) {
      console.error("Error in Admin Dashboard:", error);
      res.status(500).json({ error: "Server error" });
  }
};
