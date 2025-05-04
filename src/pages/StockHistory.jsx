import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  HStack,
  Button,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { getStockHistory } from '../services/api'; // Ensure this path is correct
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Helper function to safely format price (ensure it handles string inputs)
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    const numericPrice = Number(price); // Convert string from DB if necessary
    if (isNaN(numericPrice)) return 'Invalid'; // Handle if conversion fails
    // Display with 2 decimal places, add $ sign
    return `$${numericPrice.toFixed(2)}`;
};

// Helper function to safely format date/time (ensure it handles DB date strings)
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      // Use toLocaleString for more readable date and time
      return date.toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
};


const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching stock history...");
        const data = await getStockHistory(); // Uses corrected api.js returning data array
        console.log("Received history data:", data);

        if (Array.isArray(data)) {
          setHistory(data);
          console.log("History state updated.");
        } else {
          console.warn("Received non-array data for history:", data);
          setHistory([]);
          setError("Received invalid data format from server.");
        }
      } catch (err) {
        console.error("Error fetching stock history:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Could not fetch stock history.';
        setError(errorMessage);
        toast({ /* ... error toast config ... */ });
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []); // Fetch only on mount


  // --- Rendering Logic ---
  let content;
  if (isLoading) {
    content = (<Center h="200px"><Spinner size="xl" color="teal.300" /></Center>);
  } else if (error) {
    content = (<Center h="200px"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (history.length === 0) {
    content = (<Center h="200px"><Text color="gray.500" fontSize="lg">Your stock transaction history is empty.</Text></Center>);
  } else {
    content = (
      <VStack spacing={4} align="stretch" w="full" maxW="container.md" mx="auto">
        {/* Map over history, using field names observed in Dashboard */}
        {history.map((entry) => {
            // Log each entry to double-check field names during development
            // console.log('Rendering entry:', JSON.stringify(entry));
            return (
                <Box
                key={entry.id} // Assumes 'id' is the unique key
                bg="gray.800"
                p={4}
                borderRadius="md"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.700"
                >
                <HStack justify="space-between" w="full" mb={2}>
                    <Text fontSize="lg" fontWeight="bold" color="teal.200" textTransform="capitalize">
                    {/* Use stock_symbol and transaction_type */}
                    {entry.transaction_type} - {entry.stock_symbol || 'N/A'}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                    {/* Use transaction_date */}
                    Date: {formatDateTime(entry.transaction_date)}
                    </Text>
                </HStack>

                <Divider borderColor="gray.600" mb={3} />

                {/* Display Quantity and the single 'Price' */}
                <VStack align="start" spacing={1.5}>
                    <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.300">Quantity:</Text>
                        <Text fontWeight="medium">{entry.quantity ?? 'N/A'}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.300">Transaction Price:</Text>
                         {/* Use the single 'price' field */}
                        <Text fontWeight="medium">{formatPrice(entry.price)}</Text>
                    </HStack>
                     {/* Removed separate Purchase/Sell Price/Date as they likely don't exist */}
                     {/* Removed Profit/Loss calculation for the same reason */}
                </VStack>
                </Box>
            );
        })}
      </VStack>
    );
  }

  return (
    <Box p={6} bg="gray.900" minHeight="100vh" color="white">
       <HStack justify="space-between" w="full" mb={6}>
            <Heading color="teal.300" size="lg">Stock Transaction History</Heading>
            <Button leftIcon={<FaArrowLeft />} colorScheme="teal" variant="outline" onClick={() => navigate('/portfolio')} _hover={{ bg: 'teal.600', color: 'white' }}>
                 Back to Portfolio
            </Button>
        </HStack>
        {content}
    </Box>
  );
};

export default StockHistory;