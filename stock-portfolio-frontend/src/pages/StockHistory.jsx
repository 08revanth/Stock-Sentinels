import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import {
  Box, Heading, Text, VStack, Divider, HStack, Button, useToast, Spinner, Center,
  Icon, Flex, SimpleGrid, // Added Icon, Flex, SimpleGrid
  Tag, TagLabel, // For BUY/SELL Tag
} from '@chakra-ui/react';
import { getStockHistory } from '../services/api';
import { FaArrowLeft, FaHistory, FaDollarSign, FaCalendarAlt, FaHashtag } from 'react-icons/fa'; // Added more icons
import { useNavigate } from 'react-router-dom';

// Helper functions (ensure they are robust)
const formatPrice = (price) => { if (price === null || price === undefined) return 'N/A'; const n = Number(price); if (isNaN(n)) return 'N/A'; return `$${n.toFixed(2)}`; };
const formatDateTime = (dateString) => { if (!dateString) return 'N/A'; try { return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { console.error("Error formatting date:", dateString, e); return 'Invalid Date'; }}; // Using 'short' month

const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  // Consistent Dark Theme Colors (assuming page background is from PageWrapper or index.js)
  const headingColor = "brand.300";
  const cardBg = "gray.800";
  const cardBorderColor = "gray.700";
  const primaryTextColor = "whiteAlpha.900";
  const secondaryTextColor = "gray.400";
  const labelColor = "gray.500";

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStockHistory();
      if (Array.isArray(data)) {
        // Sort by date descending if backend doesn't do it already
        const sortedData = data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
        setHistory(sortedData);
      } else {
        setHistory([]);
        setError("Received invalid data format for history.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Could not fetch stock history.';
      setError(errorMessage);
      toast({ title: 'Error Fetching History', description: errorMessage, status: 'error' });
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // toast is stable

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Use fetchHistory in dependency array

  const getTransactionTypeColorScheme = (type) => {
    if (!type) return "gray";
    return type.toLowerCase() === 'sell' ? 'red' : type.toLowerCase() === 'buy' ? 'green' : 'gray';
  };


  let content;
  if (isLoading) {
    content = (<Center h="50vh"><Spinner size="xl" color={headingColor} thickness="4px"/></Center>);
  } else if (error) {
    content = (<Center h="30vh"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (history.length === 0) {
    content = (
        <Center h="30vh" flexDirection="column">
            <Icon as={FaHistory} boxSize="40px" color={secondaryTextColor} mb={4}/>
            <Text color={secondaryTextColor} fontSize="lg">Your stock transaction history is empty.</Text>
            <Text color={secondaryTextColor} fontSize="sm" mt={2}>Trades from your portfolio will appear here once sold.</Text>
        </Center>
    );
  } else {
    content = (
      // Using SimpleGrid for a responsive multi-column layout for history cards
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} w="full">
        {history.map((entry) => (
            <Box
                key={entry.id}
                bg={cardBg}
                p={5} // Increased padding
                borderRadius="xl" // More rounded
                boxShadow="lg"
                border="1px solid"
                borderColor={cardBorderColor}
                display="flex" flexDirection="column" justifyContent="space-between" // For layout
            >
                <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="center" mb={1}>
                        <Heading size="sm" color={headingColor} noOfLines={1}>
                            {entry.stock_symbol || 'N/A'}
                        </Heading>
                        <Tag size="sm" colorScheme={getTransactionTypeColorScheme(entry.transaction_type)} variant="subtle" px={3} py={1}>
                           <TagLabel fontWeight="bold" textTransform="uppercase">{entry.transaction_type || 'N/A'}</TagLabel>
                        </Tag>
                    </Flex>

                    <Divider borderColor="gray.700" />

                    <HStack justify="space-between">
                        <Text color={labelColor} fontSize="xs" display="flex" alignItems="center"><Icon as={FaHashtag} mr={1.5}/>Quantity:</Text>
                        <Text fontWeight="medium" color={primaryTextColor} fontSize="sm">{entry.quantity ?? 'N/A'}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color={labelColor} fontSize="xs" display="flex" alignItems="center"><Icon as={FaDollarSign} mr={1.5}/>Price:</Text>
                        <Text fontWeight="medium" color={primaryTextColor} fontSize="sm">{formatPrice(entry.price)}</Text>
                    </HStack>
                     <HStack justify="space-between" mt={1}>
                        <Text color={labelColor} fontSize="xs" display="flex" alignItems="center"><Icon as={FaCalendarAlt} mr={1.5}/>Date:</Text>
                        <Text fontSize="xs" color={secondaryTextColor}>{formatDateTime(entry.transaction_date)}</Text>
                    </HStack>
                </VStack>
            </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    // Assuming PageWrapper sets global dark bg (e.g., gray.900) and text color (e.g., whiteAlpha.900)
    <Box py={8} px={{base:2, md:6}} w="full">
       <Flex justify="space-between" align="center" mb={8} maxW="container.2xl" mx="auto" wrap="wrap" gap={4}>
            <Heading color={headingColor} size="xl" display="flex" alignItems="center">
                <Icon as={FaHistory} mr={3} /> Stock Transaction History
            </Heading>
            <Button
                leftIcon={<FaArrowLeft />}
                colorScheme="brand"
                variant="outline"
                borderColor={headingColor}
                color={headingColor}
                _hover={{ bg: "brand.700", color: "white" }}
                onClick={() => navigate('/portfolio')}
                size="sm"
            >
                Back to Portfolio
            </Button>
       </Flex>
       {/* This Box ensures content below the header is also managed */}
       <Box maxW="container.2xl" mx="auto">
        {content}
       </Box>
    </Box>
  );
};

export default StockHistory;