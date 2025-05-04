import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  useToast,
  Spinner // Added for loading states potentially
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  addStockToPortfolio,
  getWatchlist,
  deleteFromWatchlist,
  getStockHistory, // Make sure this function returns the array of history items
  addToWatchlist
} from '../services/api'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

// Helper function to safely format price
const formatPrice = (price) => {
  if (price === null || price === undefined) return 'N/A';
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return 'Invalid'; // Or 'N/A'
  }
  return `$${numericPrice.toFixed(2)}`;
};

// Helper function to safely format date/time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  // Check if dateString looks valid before creating Date object
  try {
      return new Date(dateString).toLocaleString();
  } catch (e) {
      return 'Invalid Date';
  }
};


function Dashboard() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Defined within component or wrapped in useCallback if needed elsewhere
  const fetchWatchlist = async () => {
    setIsWatchlistLoading(true);
    try {
      const watchlistData = await getWatchlist();
      setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
    } catch (err) {
      console.error("Watchlist fetch error:", err);
      toast({
        title: 'Failed to load watchlist', description: err.response?.data?.message || err.message, status: 'error', duration: 3000, isClosable: true });
      setWatchlist([]);
    } finally {
        setIsWatchlistLoading(false);
    }
  };

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const historyData = await getStockHistory();
      console.log("Fetched history data (Dashboard):", historyData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error("History fetch error:", err);
      toast({ title: 'Failed to load stock history', description: err.response?.data?.message || err.message, status: 'error', duration: 3000, isClosable: true });
      setHistory([]);
    } finally {
        setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    fetchHistory();
  }, []); // Intentionally keeping dependencies empty to fetch once

  const handleAdd = async () => {
    if (!symbol || !quantity) {
        toast({ title: 'Symbol and Quantity are required.', status: 'warning', duration: 3000, isClosable: true }); return;
    }
    try {
      await addStockToPortfolio({
        stock_symbol: symbol.toUpperCase(), quantity: Number(quantity),
        buy_price: buyPrice ? Number(buyPrice) : 0,
        buy_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      toast({ title: 'Stock added to portfolio!', status: 'success' });
      setSymbol(''); setQuantity(''); setBuyPrice('');
      // Consider navigation or refreshing specific data instead of full fetches
    } catch (err) {
       console.error(err); toast({ title: 'Failed to add stock.', description: err.response?.data?.message || 'Please try again.', status: 'error' });
    }
  };

  const handleWatchlistAdd = async () => {
     if (!symbol) { toast({ title: 'Symbol is required.', status: 'warning', duration: 3000, isClosable: true }); return; }
     try {
       await addToWatchlist({ stock_symbol: symbol.toUpperCase() });
       toast({ title: 'Added to Watchlist!', status: 'success' });
       setSymbol('');
       fetchWatchlist(); // Refresh this component's watchlist view
     } catch (err) {
       console.error(err); toast({ title: 'Failed to add to Watchlist.', description: err.response?.data?.message || 'Symbol might already exist or server error.', status: 'error' });
     }
   };

   const handleMoveToPortfolio = async (item) => {
     if (!item || !item.stock_symbol || !item.id) return;
     try {
       await addStockToPortfolio({ stock_symbol: item.stock_symbol, quantity: 1, buy_price: 0, buy_date: new Date().toISOString().slice(0, 19).replace('T', ' ') });
       await deleteFromWatchlist(item.id);
       toast({ title: `${item.stock_symbol} moved to portfolio (Default Qty: 1)`, status: 'success' });
       fetchWatchlist(); // Refresh watchlist
     } catch (err) {
        console.error(err); toast({ title: 'Failed to move stock.', description: err.response?.data?.message || 'Please try again.', status: 'error' });
     }
   };

   const handleDeleteWatchlistItem = async (id) => {
      if (!id) return;
      try {
       await deleteFromWatchlist(id);
       toast({ title: 'Removed from watchlist', status: 'info' });
       fetchWatchlist();
     } catch (err) {
       console.error(err); toast({ title: 'Failed to remove.', description: err.response?.data?.message || 'Please try again.', status: 'error' });
     }
   };


  return (
    <Box p={6} maxW="3xl" mx="auto" mt={10} bg="gray.800" borderRadius="lg" boxShadow="xl">
      <Heading mb={6} textAlign="center" color="white"> Dashboard Actions </Heading>
      <VStack spacing={4} as="form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
         <Input placeholder="Stock Symbol (e.g., AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value)} bg="gray.700" color="white" borderColor="gray.600" isRequired />
         <Input placeholder="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} bg="gray.700" color="white" borderColor="gray.600" min={1} isRequired />
         <Input placeholder="Buy Price (optional, defaults to 0)" type="number" step="0.01" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} bg="gray.700" color="white" borderColor="gray.600" min={0} />
         <Button type="submit" colorScheme="teal" width="full">Add to Portfolio</Button>
          <Button colorScheme="blue" onClick={handleWatchlistAdd} width="full">Add Symbol to Watchlist Only</Button>
        <HStack spacing={4} pt={4} borderTop="1px" borderColor="gray.700" width="full" justifyContent="center">
          <Button variant="outline" colorScheme="cyan" onClick={() => navigate('/home')}> Go to Home </Button>
          <Button variant="outline" colorScheme="cyan" onClick={() => navigate('/portfolio')}> Go to Portfolio </Button>
          <Button variant="outline" colorScheme="cyan" onClick={() => navigate('/watchlist')}> Go to Watchlist </Button>
          <Button variant="outline" colorScheme="cyan" onClick={() => navigate('/stock-history')}> Go to Stock History </Button>
        </HStack>
      </VStack>

      <Heading mt={10} mb={4} size="md" color="teal.300">Your Watchlist</Heading>
        {isWatchlistLoading ? (<Spinner color="teal.300" /> ) : (
        <VStack align="stretch" spacing={3}>
          {watchlist.length === 0 ? ( <Text color="gray.400">Watchlist is empty.</Text> ) : (
            watchlist.map((item) => ( <Box key={item.id || item.stock_symbol} bg="gray.700" p={3} borderRadius="md" shadow="sm" border="1px solid" borderColor="gray.600" > <HStack justify="space-between"> <Text color="white" fontWeight="medium">{item.stock_symbol}</Text> <HStack> <Button size="xs" colorScheme="green" variant="outline" onClick={() => handleMoveToPortfolio(item)}> Portfolio + </Button> <Button size="xs" colorScheme="red" variant="outline" onClick={() => handleDeleteWatchlistItem(item.id)}> Remove </Button> </HStack> </HStack> </Box> ))
          )}
        </VStack>
      )}

      <Heading mt={10} mb={4} size="md" color="teal.300"> Recent Stock History </Heading>
        {isHistoryLoading ? ( <Spinner color="teal.300" /> ) : (
          <VStack align="stretch" spacing={3}>
          {history.length === 0 ? ( <Text color="gray.400">No transaction history yet.</Text> ) : (
             history.slice(0, 5).map((h) => ( <Box key={h.id} bg="gray.700" p={3} borderRadius="md" border="1px solid" borderColor="gray.600" > <HStack justify="space-between"> <Text color="white" textTransform="capitalize"> {h.transaction_type} — {h.stock_symbol} ({h.quantity}) </Text> <Text color="gray.300" fontWeight="medium"> {formatPrice(h.price)} </Text> </HStack> <Text fontSize="sm" color="gray.400"> {formatDateTime(h.transaction_date)} </Text> </Box> ))
          )}
          {history.length > 5 && ( <Button variant="link" colorScheme="teal" onClick={() => navigate('/stock-history')} mt={2}> View All History... </Button> )}
          </VStack>
      )}
    </Box>
  );
}
export default Dashboard;