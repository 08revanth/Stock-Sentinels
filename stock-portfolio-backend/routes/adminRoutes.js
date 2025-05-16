const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController'); 

router.get('/dashboard', authenticateToken, authorizeRole(1), adminController.getAdminDashboard); 

router.get('/users', authenticateToken, authorizeRole(1), adminController.getAllUsers);

router.get('/portfolios', authenticateToken, authorizeRole(1), adminController.getAllPortfolios);


module.exports = router;
