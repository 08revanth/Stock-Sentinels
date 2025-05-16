const jwt = require('jsonwebtoken');

// Authenticate Token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Access denied!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token!" });
        req.user = user; // attaching user to request
        next();
    });
};

// Admin authorization middleware
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.is_admin !== role) {
        return res.status(403).json({ error: "Forbidden: You don't have permission!" });
    }
    next();
};

// Protect middleware to authenticate user
const protect = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after 'Bearer'
    
    // If no token is provided, deny access
    if (!token) {
      return res.status(403).json({ message: 'Access denied! No token provided.' });
    }
  
    // Verify the token and decode the payload (i.e., user data)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // If the token is invalid or expired
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token!' });
      }
  
      // Attach the decoded user information to req.user
      req.user = user; 
  
      // Allow the request to proceed to the next middleware or route handler
      next();
    });
  };

module.exports = { authenticateToken, authorizeRole, protect };
