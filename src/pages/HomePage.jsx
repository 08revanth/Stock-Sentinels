
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Heading, HStack, Text, Spinner, Center, Input, Select,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, TagLabel,
  IconButton, Tooltip as ChakraTooltip
} from '@chakra-ui/react';
import { FaSync } from 'react-icons/fa';
import { fetchStockSymbols, fetchQuote } from '../services/api';

const getPriceChangeColor = (change) => { /* ... */
    if (change > 0) return 'green.400';
     if (change < 0) return 'red.400'; 
     return 'gray.500';};
const formatPrice = (price) => { /* ... */
     if (price === null || price === undefined || price === 0) return '-';
      const numericPrice = Number(price); 
      if (isNaN(numericPrice)) return '-'; 
     return `$${numericPrice.toFixed(2)}`;};

const HomePage = () => {
    const [exchange, setExchange] = useState('US');
    const [symbols, setSymbols] = useState([]);
    const [filteredSymbols, setFilteredSymbols] = useState([]);
    const [quotes, setQuotes] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingSymbols, setLoadingSymbols] = useState(true);
    const [loadingQuotes, setLoadingQuotes] = useState(false);
    const [error, setError] = useState(null);
    const quoteFetchIntervalRef = useRef(null);

    const EXCHANGES = [
        { value: 'US', label: 'USA (NYSE, NASDAQ, etc.)' }, { value: 'NS', label: 'India (NSE)' }, { value: 'BO', label: 'India (BSE)' },];

    const loadSymbols = useCallback(async (selectedExchange) => { /* ... keep implementation ... */
        setLoadingSymbols(true); setError(null); setSymbols([]); 
        setFilteredSymbols([]); setQuotes({});
         try { console.log(`Fetching symbols for ${selectedExchange}...`); 
            const data = await fetchStockSymbols(selectedExchange); 
            console.log(`Received ${data.length} symbols.`); 
            setSymbols(data); setFilteredSymbols(data); 
            if (data.length > 0) { fetchQuotesBatch(data.slice(0, 25)); 
            } } catch (err) { console.error("Error fetching symbols:", err); 
                const msg = err.response?.data?.message || err.message || `Could not load symbols for ${selectedExchange}.`; 
                setError(msg); } finally { setLoadingSymbols(false); } }, []);

    const fetchQuotesBatch = async (symbolsToFetch, isRefresh = false) => { /* ... keep implementation ... */
         if (symbolsToFetch.length === 0) return; 
         if (!isRefresh) setLoadingQuotes(true); 
         console.log(`Fetching quotes for ${symbolsToFetch.length} symbols...`);
         const quotePromises = symbolsToFetch.map(stock => fetchQuote(stock.symbol).catch(err => { 
            console.warn(`Failed to fetch quote for ${stock.symbol}:`, err.message); 
            return null; 
        }) );
        try { const results = await Promise.all(quotePromises); 
            const newQuotes = {}; 
        results.forEach((quote, index) => { const symbol = symbolsToFetch[index].symbol; 
            if (quote) { newQuotes[symbol] = quote; 
        } }); 
        setQuotes(prevQuotes => ({ ...prevQuotes, ...newQuotes })); 
        console.log("Quotes updated for batch."); 
    } catch (error) { console.error("Error in batch quote fetching logic:", error); 
    } finally { 
        if (!isRefresh) setLoadingQuotes(false); 
    } };

    useEffect(() => { loadSymbols(exchange); 
        return () => { if (quoteFetchIntervalRef.current) { 
            clearInterval(quoteFetchIntervalRef.current); 
        } }; 
    }, [exchange, loadSymbols]);

     useEffect(() => { const lowerSearchTerm = searchTerm.toLowerCase(); 
        const filtered = symbols.filter(stock => stock.symbol.toLowerCase().includes(lowerSearchTerm) || stock.description?.toLowerCase().includes(lowerSearchTerm) ); 
        setFilteredSymbols(filtered); 
    }, [searchTerm, symbols]);

     useEffect(() => { 
        if (quoteFetchIntervalRef.current) { clearInterval(quoteFetchIntervalRef.current); 
        } 
        const intervalId = setInterval(() => { 
            const symbolsToRefresh = filteredSymbols.filter(s => quotes[s.symbol]);
            if (symbolsToRefresh.length > 0) { 
                console.log(`Refreshing quotes for ${symbolsToRefresh.length} symbols...`); 
                fetchQuotesBatch(symbolsToRefresh, true); 
            } }, 60000); 
            quoteFetchIntervalRef.current = intervalId; return () => clearInterval(intervalId); 
        }, [filteredSymbols, quotes]);

    return ( 
    <Box p={6} color="white" bg="gray.900" minH="100vh"> 
    <Heading mb={4} color="teal.300">Market Stocks</Heading> 
    <HStack spacing={4} mb={6} wrap="wrap"> 
        <Select value={exchange} onChange={(e) => setExchange(e.target.value)} bg="gray.700" borderColor="gray.600" w={{ base: '100%', md: '300px' }} > {
        EXCHANGES.map(ex => ( 
        <option key={ex.value} value={ex.value} style={{ backgroundColor: '#2D3748' }}>{ex.label}</option> ))} 
        </Select> 
        <Input placeholder="Search Symbol or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg="gray.700" borderColor="gray.600" flexGrow={1} minW="200px" /> 
        <ChakraTooltip label="Refresh Quotes" placement="top"> 
            <IconButton aria-label="Refresh quotes" icon={
                <FaSync />} isLoading={loadingQuotes} onClick={() => { const symbolsToRefresh = filteredSymbols.filter(s => quotes[s.symbol]); if(symbolsToRefresh.length > 0) { fetchQuotesBatch(symbolsToRefresh, true); } else if (filteredSymbols.length > 0) { fetchQuotesBatch(filteredSymbols.slice(0, 25), false); } }} colorScheme="blue" /> 
                </ChakraTooltip> </HStack> {loadingSymbols ? ( 
                    <Center h="200px">
                        <Spinner size="xl" color="teal.300" />
                        </Center> ) : error ? ( 
                            <Center h="200px"><Text color="red.400" fontSize="lg">Error: {error}
                            </Text>
                            </Center> ) : filteredSymbols.length === 0 ? ( 
                                <Center h="200px">
                                    <Text color="gray.500" fontSize="lg">{searchTerm ? 'No matching stocks found.' : 'No stocks listed for this exchange.'}
                                    </Text>
                                    </Center> ) : ( 
                                        <TableContainer> 
                                            <Table variant="simple" size="sm"> 
                                                <Thead> 
                                                    <Tr> 
                                                        <Th color="gray.400">Symbol</Th> 
                                                        <Th color="gray.400">Description</Th> 
                                                        <Th color="gray.400" isNumeric>Price</Th> 
                                                        <Th color="gray.400" isNumeric>Change (%)</Th> 
                                                        </Tr> 
                                                        </Thead> 
                                                        <Tbody> {filteredSymbols.slice(0, 100).map(stock => { const quote = quotes[stock.symbol]; const changeColor = quote ? getPriceChangeColor(quote.dp) : 'gray.500'; return ( 
                                                            <Tr key={stock.symbol} _hover={{ bg: 'gray.700' }}> 
                                                            <Td fontWeight="medium">{stock.symbol}</Td> 
                                                            <Td maxW="300px" isTruncated title={stock.description}>{stock.description || '-'}</Td> 
                                                            <Td isNumeric> {quote ? formatPrice(quote.c) : 
                                                                <Spinner size="xs" speed="0.8s" />} </Td> 
                                                                <Td isNumeric> {quote ? ( 
                                                                    <Tag size="sm" colorScheme={changeColor === 'green.400' ? 'green' : changeColor === 'red.400' ? 'red' : 'gray'}> 
                                                                    <TagLabel color={changeColor}>{quote.dp?.toFixed(2) ?? '-'}%</TagLabel> 
                                                                    </Tag> ) : '-'} 
                                                                    </Td> 
                                                                    </Tr> ); })} 
                                                                    </Tbody> 
                                                                    </Table> {filteredSymbols.length > 100 && ( 
                                                                        <Text mt={4} textAlign="center" color="gray.500">Displaying first 100 results. Use search to refine.</Text> )} 
                                                                        {(loadingQuotes && !loadingSymbols) && ( 
                                                                            <Center mt={4}>
                                                                                <Spinner size="md" color="blue.300" /><
                                                                                    Text ml={2}>Loading quotes...</Text>
                                                                                    </Center> )} 
                                                                                    </TableContainer> )} 
                                                                                    </Box> );}; 
                                                                                    export default HomePage;