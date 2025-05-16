// src/App.jsx (or your router file)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import StockHistory from './pages/StockHistory';
import Watchlist from './pages/Watchlist';
import TopStocksPage from './pages/TopStocksPage';
import AdminPanel from './pages/AdminPanel'; // Assuming you have this
import NotFound from './pages/NotFound'; // Assuming you have this
import PageWrapper from './components/PageWrapper'; // Your layout wrapper with Navbar

// --- New Page Imports ---
import MarketTrendChartPage from './pages/MarketTrendChartPage';
import MarketNewsPage from './pages/MarketNewsPage';
// --- End New Page Imports ---

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes requiring PageWrapper (which includes Navbar) */}
        <Route path="/home" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/top-stocks" element={<PageWrapper><TopStocksPage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
        <Route path="/watchlist" element={<PageWrapper><Watchlist /></PageWrapper>} />
        <Route path="/stock-history" element={<PageWrapper><StockHistory /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />

        {/* --- New Routes for Market section --- */}
        <Route path="/market-chart" element={<PageWrapper><MarketTrendChartPage /></PageWrapper>} />
        <Route path="/market-news" element={<PageWrapper><MarketNewsPage /></PageWrapper>} />
        {/* --- End New Routes --- */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;