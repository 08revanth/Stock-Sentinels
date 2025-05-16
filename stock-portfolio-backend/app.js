const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const marketRoutes = require('./routes/marketRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const historyRoutes = require('./routes/historyRoutes');
const marketRoutes = require('./routes/marketRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/history', historyRoutes);
// app.use('/api/market', marketRoutes);
app.use('/api/market', marketRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
