// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Input, Button, VStack, Text, HStack, useToast, Spinner,
  SimpleGrid, FormControl, FormLabel, Icon, InputGroup, InputLeftElement,
  Divider, Center
} from '@chakra-ui/react';
import { FaPlus, FaRegSave, FaListAlt, FaHistory, FaHome, FaBriefcase, FaEye, FaTimesCircle, FaDollarSign } from 'react-icons/fa';
import { addStockToPortfolio, getWatchlist, deleteFromWatchlist, getStockHistory, addToWatchlist } from '../services/api';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => { if (price === null || price === undefined) return 'N/A'; const n = Number(price); if (isNaN(n)) return 'N/A'; return `$${n.toFixed(2)}`; };
const formatDateTime = (dateString) => { if (!dateString) return 'N/A'; try { return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return 'Invalid Date'; } };

function Dashboard() {
  const [portfolioSymbol, setPortfolioSymbol] = useState('');
  const [portfolioQuantity, setPortfolioQuantity] = useState('');
  const [portfolioBuyPrice, setPortfolioBuyPrice] = useState('');
  const [watchlistSymbol, setWatchlistSymbol] = useState('');

  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);
  const [isSubmittingWatchlist, setIsSubmittingWatchlist] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const sectionCardBg = "gray.800";
  const formCardBg = "gray.750";
  const inputBg = "gray.700";
  const pageSectionBorderColor = "gray.700";
  const formCardInputBorderColor = "gray.600";
  const focusBorderColor = "brand.400";
  const headingColor = "brand.300";
  const primaryTextColor = "whiteAlpha.900";
  const formLabelColor = "gray.300";
  const subtleTextColor = "gray.400";
  const listDividerColor = "gray.700";

  const fetchWatchlist = useCallback(async () => {
    setIsWatchlistLoading(true);
    try { const d = await getWatchlist(); setWatchlist(Array.isArray(d) ? d : []); }
    catch (err) { toast({ title: 'Failed to load watchlist', description: err.response?.data?.message || err.message, status: 'error', duration: 3000, isClosable: true }); setWatchlist([]); }
    finally { setIsWatchlistLoading(false); }
  }, [toast]);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try { const d = await getStockHistory(); setHistory(Array.isArray(d) ? d : []); }
    catch (err) { toast({ title: 'Failed to load stock history', description: err.response?.data?.message || err.message, status: 'error', duration: 3000, isClosable: true }); setHistory([]); }
    finally { setIsHistoryLoading(false); }
  }, [toast]);

  useEffect(() => { fetchWatchlist(); fetchHistory(); }, [fetchWatchlist, fetchHistory]);

  const handleAddPortfolioSubmit = async (e) => {
    e.preventDefault();
    if (!portfolioSymbol || !portfolioQuantity) {
        toast({ title: 'Symbol and Quantity are required for portfolio.', status: 'warning', duration: 3000, isClosable: true }); return;
    }
    setIsSubmittingPortfolio(true);
    try {
      await addStockToPortfolio({
        stock_symbol: portfolioSymbol.toUpperCase(),
        quantity: Number(portfolioQuantity),
        buy_price: portfolioBuyPrice ? Number(portfolioBuyPrice) : 0,
        buy_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
      toast({ title: 'Stock added to portfolio!', status: 'success', duration: 3000 });
      setPortfolioSymbol(''); setPortfolioQuantity(''); setPortfolioBuyPrice('');
    } catch (err) {
       toast({ title: 'Failed to add stock.', description: err.response?.data?.message || 'Please try again.', status: 'error', duration: 5000 });
    } finally {
       setIsSubmittingPortfolio(false);
    }
  };

  const handleWatchlistAddSubmit = async (e) => {
     e.preventDefault();
     if (!watchlistSymbol) { toast({ title: 'Symbol is required for watchlist.', status: 'warning', duration: 3000, isClosable: true }); return; }
     setIsSubmittingWatchlist(true);
     try {
       await addToWatchlist({ stock_symbol: watchlistSymbol.toUpperCase() });
       toast({ title: 'Added to Watchlist!', status: 'success', duration: 3000 });
       setWatchlistSymbol('');
       fetchWatchlist();
     } catch (err) {
       toast({ title: 'Failed to add to Watchlist.', description: err.response?.data?.message || 'Symbol might already exist.', status: 'error', duration: 5000 });
     } finally {
        setIsSubmittingWatchlist(false);
     }
   };

   const handleMoveToPortfolio = async (item) => {
     if (!item || !item.stock_symbol || !item.id) return;
     try {
       await addStockToPortfolio({ stock_symbol: item.stock_symbol, quantity: 1, buy_price: 0, buy_date: new Date().toISOString().slice(0, 19).replace('T', ' ') });
       await deleteFromWatchlist(item.id);
       toast({ title: `${item.stock_symbol} moved to portfolio`, status: 'success' });
       fetchWatchlist();
     } catch (err) {
        toast({ title: 'Failed to move stock.', description: err.response?.data?.message || 'Error occurred.', status: 'error' });
     }
   };

   const handleDeleteWatchlistItem = async (id) => {
      if (!id) return;
      try {
       await deleteFromWatchlist(id);
       toast({ title: 'Removed from watchlist', status: 'info' });
       fetchWatchlist();
     } catch (err) {
       toast({ title: 'Failed to remove.', description: err.response?.data?.message || 'Error occurred.', status: 'error' });
     }
   };

  return (
    <VStack spacing={{base: 4, md: 6}} align="stretch" py={6} px={{ base: 2, md: 4 }} w="full" maxW="container.xl" mx="auto">
      <Heading textAlign="center" color={headingColor} size="xl">
        Dashboard Actions
      </Heading>

      <Box p={{base:4, md:6}} bg={sectionCardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={pageSectionBorderColor}>
        <Heading size="lg" color={headingColor} mb={6} textAlign="center">Manage Your Investments</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8}}>
            <VStack as="form" onSubmit={handleAddPortfolioSubmit} spacing={4} p={5} bg={formCardBg} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={formCardInputBorderColor}>
                <Heading size="sm" color={primaryTextColor} mb={1} alignSelf="flex-start">Add to Portfolio</Heading>
                <FormControl isRequired>
                    <FormLabel color={formLabelColor} fontSize="xs">Stock Symbol</FormLabel>
                    <Input placeholder="e.g., AAPL" value={portfolioSymbol} onChange={(e) => setPortfolioSymbol(e.target.value.toUpperCase())} bg={inputBg} borderColor={formCardInputBorderColor} color={primaryTextColor} _placeholder={{ color: subtleTextColor }} _focus={{borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}`}} size="sm" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color={formLabelColor} fontSize="xs">Quantity</FormLabel>
                    <Input placeholder="No. of shares" type="number" value={portfolioQuantity} onChange={(e) => setPortfolioQuantity(e.target.value)} bg={inputBg} borderColor={formCardInputBorderColor} color={primaryTextColor} min={1} _placeholder={{ color: subtleTextColor }} _focus={{borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}`}} size="sm" />
                </FormControl>
                <FormControl>
                    <FormLabel color={formLabelColor} fontSize="xs">Buy Price (Opt.)</FormLabel>
                    <InputGroup size="sm">
                        <InputLeftElement pointerEvents='none' color={subtleTextColor} fontSize="0.8em" children='$' />
                        <Input placeholder="Price/share" type="number" step="0.01" value={portfolioBuyPrice} onChange={(e) => setPortfolioBuyPrice(e.target.value)} bg={inputBg} borderColor={formCardInputBorderColor} color={primaryTextColor} min={0} pl="1.8rem" _placeholder={{ color: subtleTextColor }} _focus={{borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}`}} />
                    </InputGroup>
                </FormControl>
                <Button type="submit" colorScheme="brand" width="full" isLoading={isSubmittingPortfolio} leftIcon={<FaRegSave />} size="sm">Add to Portfolio</Button>
            </VStack>

            <VStack as="form" onSubmit={handleWatchlistAddSubmit} spacing={4} p={5} bg={formCardBg} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={formCardInputBorderColor}>
                <Heading size="sm" color={primaryTextColor} mb={1} alignSelf="flex-start">Quick Add to Watchlist</Heading>
                <FormControl isRequired>
                    <FormLabel color={formLabelColor} fontSize="xs">Stock Symbol</FormLabel>
                    <Input placeholder="Enter symbol (e.g., MSFT)" value={watchlistSymbol} onChange={(e) => setWatchlistSymbol(e.target.value.toUpperCase())} bg={inputBg} borderColor={formCardInputBorderColor} color={primaryTextColor} _placeholder={{ color: subtleTextColor }} _focus={{borderColor: focusBorderColor, boxShadow: `0 0 0 1px ${focusBorderColor}`}} size="sm"/>
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full" isLoading={isSubmittingWatchlist} leftIcon={<FaEye />} size="sm">Add to Watchlist</Button>
                <Text fontSize="xs" color={subtleTextColor} textAlign="center" pt={{base:1, md:7}}>
                    Enter symbol and click to add to your watchlist.
                </Text>
            </VStack>
        </SimpleGrid>
      </Box>

      <Box p={5} bg={sectionCardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={pageSectionBorderColor}>
        <Heading size="md" color={headingColor} mb={5} textAlign="center">Explore Your App</Heading>
        <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3}>
            <Button leftIcon={<FaHome />} variant="outline" colorScheme="cyan" _hover={{bg: "cyan.700", color: "whiteAlpha.900"}} borderColor="cyan.600" color="cyan.400" onClick={() => navigate('/home')} size="sm">Home</Button>
            <Button leftIcon={<FaBriefcase />} variant="outline" colorScheme="cyan" _hover={{bg: "cyan.700", color: "whiteAlpha.900"}} borderColor="cyan.600" color="cyan.400" onClick={() => navigate('/portfolio')} size="sm">Portfolio</Button>
            <Button leftIcon={<FaEye />} variant="outline" colorScheme="cyan" _hover={{bg: "cyan.700", color: "whiteAlpha.900"}} borderColor="cyan.600" color="cyan.400" onClick={() => navigate('/watchlist')} size="sm">Watchlist</Button>
            <Button leftIcon={<FaHistory />} variant="outline" colorScheme="cyan" _hover={{bg: "cyan.700", color: "whiteAlpha.900"}} borderColor="cyan.600" color="cyan.400" onClick={() => navigate('/stock-history')} size="sm">History</Button>
        </SimpleGrid>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={5} bg={sectionCardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={pageSectionBorderColor}>
            <Heading size="md" color={headingColor} mb={4} display="flex" alignItems="center"><Icon as={FaListAlt} mr={2} /> Your Watchlist</Heading>
            {isWatchlistLoading ? (<Center py={3}><Spinner color={headingColor} size="sm"/></Center>) : ( watchlist.length === 0 ? ( <Text color={subtleTextColor} textAlign="center" py={3} fontSize="sm">Your watchlist is empty.</Text> ) : ( <VStack align="stretch" spacing={0}> {watchlist.map((item, index) => ( <React.Fragment key={item.id || item.stock_symbol}> <HStack justify="space-between" py={2} px={1} _hover={{bg: formCardBg}} borderRadius="md"> <Text color={primaryTextColor} fontWeight="medium" fontSize="sm">{item.stock_symbol}</Text> <HStack spacing={1}> <Button size="xs" colorScheme="green" variant="ghost" onClick={() => handleMoveToPortfolio(item)} leftIcon={<FaPlus fontSize="0.8em"/>} _hover={{bg:"green.600", color:"white"}}>Portfolio +</Button> <Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleDeleteWatchlistItem(item.id)} leftIcon={<FaTimesCircle fontSize="0.8em"/>} _hover={{bg:"red.600", color:"white"}}>Remove</Button> </HStack> </HStack> {index < watchlist.length - 1 && <Divider borderColor={listDividerColor} />} </React.Fragment> ))} </VStack> ) )}
        </Box>
        <Box p={5} bg={sectionCardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={pageSectionBorderColor}>
            <Heading size="md" color={headingColor} mb={4} display="flex" alignItems="center"><Icon as={FaHistory} mr={2}/>Recent Stock History</Heading>
            {isHistoryLoading ? (<Center py={3}><Spinner color={headingColor} size="sm"/></Center>) : ( <VStack align="stretch" spacing={0}> {history.length === 0 ? (<Text color={subtleTextColor} textAlign="center" py={3} fontSize="sm">No transaction history yet.</Text>) : ( history.slice(0, 5).map((h, index) => ( <React.Fragment key={h.id}> <HStack justify="space-between" py={2} px={1} _hover={{bg: formCardBg}} borderRadius="md"> <VStack align="start" spacing={0}> <Text color={primaryTextColor} textTransform="capitalize" fontWeight="medium" fontSize="sm">{h.transaction_type} — {h.stock_symbol} ({h.quantity})</Text> <Text fontSize="xs" color={subtleTextColor}>{formatDateTime(h.transaction_date)}</Text> </VStack> <Text fontWeight="medium" fontSize="sm">{formatPrice(h.price)}</Text> </HStack> {index < history.slice(0, 5).length - 1 && <Divider borderColor={listDividerColor} />} </React.Fragment> )) )} {history.length > 5 && (<Button variant="link" colorScheme="brand" onClick={() => navigate('/stock-history')} mt={3} alignSelf="flex-end" size="xs">View All History...</Button>)} </VStack> )}
        </Box>
      </SimpleGrid>
    </VStack>
  );
}
export default Dashboard;