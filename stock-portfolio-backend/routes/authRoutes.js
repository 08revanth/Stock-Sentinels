const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', authenticateToken, authController.getProfile); 
router.put('/profile/update', authenticateToken, authController.updateProfile); 

router.get('/admin/dashboard', authenticateToken, authorizeRole(1), authController.getAdminDashboard);  
router.post('/change-password', authenticateToken, authController.changePassword); 

module.exports = router;
