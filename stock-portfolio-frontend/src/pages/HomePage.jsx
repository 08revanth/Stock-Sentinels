// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Heading, HStack, Text, Spinner, Center, Input, Select,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, TagLabel,
  IconButton, Tooltip as ChakraTooltip, Button, Flex, Icon,
  InputGroup, InputLeftElement,
  VStack
} from '@chakra-ui/react';
import { FaSync, FaChartBar, FaSearch, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchStockSymbols, fetchQuote } from '../services/api';

const getPriceChangeColor = (change) => { if (change > 0) return 'green.400'; if (change < 0) return 'red.400'; return 'gray.500';};
const formatPrice = (price) => { if (price === null || price === undefined || price === 0) return '-'; const n = Number(price); if (isNaN(n)) return '-'; return `$${n.toFixed(2)}`;};

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
    const navigate = useNavigate();

    const headingColor = "brand.300";
    const controlBg = "gray.700";
    const controlBorderColor = "gray.600";
    const controlFocusBorderColor = "brand.400";
    const tableBg = "gray.800";
    const tableHeaderBg = "gray.750";
    const tableHeaderColor = "gray.400";
    const tableRowHoverBg = "gray.700";
    const primaryTableTextColor = "whiteAlpha.900";
    const subtleTextColor = "gray.500";

    // THIS IS THE OBJECT WE WILL USE FOR OPTION STYLES
    const optionStyle = {
        backgroundColor: "gray.800", // Using a common dark color, e.g., Chakra's gray.800
        color: "whiteAlpha.800",   // Light text for options
    };
    const selectButtonTextColor = "whiteAlpha.900"; // Text color for the select button face

    const EXCHANGES = [
        { value: 'US', label: 'USA (NYSE, NASDAQ)' },
        { value: 'NS', label: 'India (NSE)' },
        { value: 'BO', label: 'India (BSE)' },
    ];

    const loadSymbols = useCallback(async (selectedExchange) => { setLoadingSymbols(true); setError(null); setSymbols([]); setFilteredSymbols([]); setQuotes({}); try { const data = await fetchStockSymbols(selectedExchange); setSymbols(data); setFilteredSymbols(data); if (data.length > 0) { fetchQuotesBatch(data.slice(0, 25)); } } catch (err) { const msg = err.response?.data?.message || err.message || `Could not load symbols.`; setError(msg); } finally { setLoadingSymbols(false); } }, []);
    const fetchQuotesBatch = async (symbolsToFetch, isRefresh = false) => { if (symbolsToFetch.length === 0) return; if (!isRefresh) setLoadingQuotes(true); const quotePromises = symbolsToFetch.map(stock => fetchQuote(stock.symbol).catch(err => {return null;}) ); try { const results = await Promise.all(quotePromises); const newQuotes = {}; results.forEach((quote, index) => { const symbol = symbolsToFetch[index].symbol; if (quote) { newQuotes[symbol] = quote; } }); setQuotes(prevQuotes => ({ ...prevQuotes, ...newQuotes })); } catch (error) { console.error("Error batch quote fetch:", error); } finally { if (!isRefresh) setLoadingQuotes(false); } };
    useEffect(() => { loadSymbols(exchange); return () => { if (quoteFetchIntervalRef.current) { clearInterval(quoteFetchIntervalRef.current); } }; }, [exchange, loadSymbols]);
    useEffect(() => { const lowerSearchTerm = searchTerm.toLowerCase(); const filtered = symbols.filter(stock => stock.symbol.toLowerCase().includes(lowerSearchTerm) || stock.description?.toLowerCase().includes(lowerSearchTerm) ); setFilteredSymbols(filtered); }, [searchTerm, symbols]);
    useEffect(() => { if (quoteFetchIntervalRef.current) { clearInterval(quoteFetchIntervalRef.current); } const intervalId = setInterval(() => { const symbolsToRefresh = filteredSymbols.filter(s => quotes[s.symbol]); if (symbolsToRefresh.length > 0) { fetchQuotesBatch(symbolsToRefresh, true); } }, 60000); quoteFetchIntervalRef.current = intervalId; return () => clearInterval(intervalId); }, [filteredSymbols, quotes]);

    return (
        <VStack spacing={8} align="stretch" py={6} px={{base:2, md:4}}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <HStack spacing={3}>
                    <Icon as={FaDollarSign} color={headingColor} boxSize={{base:6, md:8}} />
                    <Heading color={headingColor} size={{base: "lg", md:"xl"}}>Live Market Stocks</Heading>
                </HStack>
                <Button leftIcon={<FaChartBar />} colorScheme="purple" variant="solid" size="sm" onClick={() => navigate('/market-chart')} boxShadow="md" _hover={{ boxShadow: "lg" }}>
                    Market Trend Chart
                </Button>
            </Flex>

            <Box p={5} bg={tableBg} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={controlBorderColor}>
                <HStack spacing={{base:2, md:4}} wrap="wrap" justify="space-between">
                    <Select
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value)}
                        bg={controlBg}
                        borderColor={controlBorderColor}
                        color={selectButtonTextColor} /* Updated for clarity */
                        iconColor="gray.400"
                        _focus={{borderColor: controlFocusBorderColor, boxShadow: `0 0 0 1px ${controlFocusBorderColor}`}}
                        w={{ base: '100%', sm: 'auto' }}
                        flexGrow={{base:1, sm:0}}
                        size="sm"
                    >
                        {EXCHANGES.map(ex => (
                            <option
                                key={ex.value}
                                value={ex.value}
                                style={optionStyle} // <<< --- CORRECTLY USING optionStyle ---
                            >
                                {ex.label}
                            </option>
                        ))}
                    </Select>
                    <InputGroup size="sm" flexGrow={1} minW={{base:"100px", sm:"200px"}} maxW={{base: "100%", sm:"400px"}}>
                        <InputLeftElement pointerEvents="none" children={<Icon as={FaSearch} color="gray.500" />} />
                        <Input placeholder="Search by Symbol or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg={controlBg} borderColor={controlBorderColor} color={primaryTableTextColor} _placeholder={{color: "gray.500"}} _focus={{borderColor: controlFocusBorderColor, boxShadow: `0 0 0 1px ${controlFocusBorderColor}`}} pl={10} />
                    </InputGroup>
                    <ChakraTooltip label="Refresh Current Quotes" placement="top">
                        <IconButton aria-label="Refresh quotes" icon={<FaSync />} isLoading={loadingQuotes && !loadingSymbols} onClick={() => { const symbolsToRefresh = filteredSymbols.slice(0,100).filter(s => quotes[s.symbol]); if(symbolsToRefresh.length > 0) { fetchQuotesBatch(symbolsToRefresh, true); } else if (filteredSymbols.length > 0) { fetchQuotesBatch(filteredSymbols.slice(0, 25), false); } }} colorScheme="blue" variant="outline" size="sm" borderColor="blue.500" color="blue.300" _hover={{bg: "blue.600", color: "white"}} />
                    </ChakraTooltip>
                </HStack>
            </Box>

            {loadingSymbols ? ( <Center h="40vh"><Spinner size="xl" color={headingColor} thickness="4px"/></Center>
            ) : error ? ( <Center h="30vh"><Text color="red.400" fontSize="lg" textAlign="center">Error: {error} <br/> Please check your connection or try a different exchange.</Text></Center>
            ) : filteredSymbols.length === 0 ? ( <Center h="30vh"><Text color={subtleTextColor} fontSize="lg">{searchTerm ? 'No matching stocks found.' : 'No stocks listed for this exchange.'}</Text></Center>
            ) : (
                <Box bg={tableBg} borderRadius="lg" boxShadow="md" p={{base:0, md:2}} border="1px solid" borderColor={controlBorderColor}>
                    <TableContainer>
                        <Table variant="simple" size="sm">
                            <Thead bg={tableHeaderBg}>
                                <Tr>
                                    <Th color={tableHeaderColor} py={3}>Symbol</Th> <Th color={tableHeaderColor} py={3}>Description</Th> <Th color={tableHeaderColor} isNumeric py={3}>Price</Th> <Th color={tableHeaderColor} isNumeric py={3}>Change (%)</Th> <Th color={tableHeaderColor} isNumeric py={3}>Open</Th> <Th color={tableHeaderColor} isNumeric py={3}>Prev. Close</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredSymbols.slice(0, 100).map(stock => { const quote = quotes[stock.symbol]; const changeColor = quote ? getPriceChangeColor(quote.dp) : "gray.500"; return (
                                    <Tr key={stock.symbol} _hover={{ bg: tableRowHoverBg }} color={primaryTableTextColor}>
                                        <Td fontWeight="bold" color="brand.200">{stock.symbol}</Td>
                                        <Td maxW="300px" isTruncated title={stock.description} fontSize="xs" color="gray.300">{stock.description || '-'}</Td>
                                        <Td isNumeric fontWeight="semibold">{quote ? formatPrice(quote.c) : <Spinner size="xs" speed="0.8s" color="blue.300"/>}</Td>
                                        <Td isNumeric>{quote && quote.dp != null ? (<Tag size="sm" variant="subtle" colorScheme={quote.dp > 0 ? 'green' : quote.dp < 0 ? 'red' : 'gray'}><TagLabel fontWeight="medium">{quote.dp?.toFixed(2)}%</TagLabel></Tag>) : quote ? '-' : ''}</Td>
                                        <Td isNumeric fontSize="xs" color="gray.400">{quote ? formatPrice(quote.o) : ''}</Td>
                                        <Td isNumeric fontSize="xs" color="gray.400">{quote ? formatPrice(quote.pc) : ''}</Td>
                                    </Tr>
                                );})}
                            </Tbody>
                        </Table>
                        {filteredSymbols.length > 100 && ( <Text mt={4} textAlign="center" color={subtleTextColor} fontSize="sm">Displaying first 100 of {filteredSymbols.length} results. Use search to refine.</Text> )}
                        {(loadingQuotes && !loadingSymbols && !error) && (<Center mt={4} py={3}><Spinner size="md" color="blue.300" /><Text ml={2} fontSize="sm" color="blue.200">Loading latest quotes...</Text></Center>)}
                    </TableContainer>
                </Box>
             )}
        </VStack>
    );
};
export default HomePage;