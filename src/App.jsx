import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import AdminPanel from './pages/AdminPanel';
import PageWrapper from './components/PageWrapper';
import Watchlist from './pages/Watchlist';
import StockHistory from './pages/StockHistory';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/stock-history" element={<StockHistory />} />
          <Route path="/home" element={<PageWrapper><HomePage /></PageWrapper>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
export default App;
