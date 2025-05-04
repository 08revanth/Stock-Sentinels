import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  Divider,
  Button,
  useToast,
  Spinner,
  Center,
  Collapse, // Added for chart visibility toggle
  useDisclosure // Hook for collapse state
} from '@chakra-ui/react';
import { getUserPortfolio, deleteStockFromPortfolio } from '../services/api';
import { useNavigate } from 'react-router-dom';

// --- Chart.js Imports ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Optional: if using time for x-axis
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// --- Register Chart.js Components ---
// This tells Chart.js which components we'll be using for our charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale if needed for x-axis based on real dates
);
// --- End Chart.js Imports ---


// Helper function for formatting price
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return 'Invalid';
    return `$${numericPrice.toFixed(2)}`;
};

// Helper function for formatting date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (e) { return 'Invalid Date'; }
};


// --- Placeholder Chart Data & Options ---
// In a real app, this would be fetched per stock or generated from fetched historical data
const generatePlaceholderChartData = (symbol) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example labels
  datasets: [
    {
      label: `${symbol} Price`,
      // Generate some random-ish data for visual representation
      data: Array.from({ length: 6 }, () => Math.random() * 100 + 50),
      borderColor: 'rgb(53, 162, 235)', // Blue line
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.1 // Slightly curve the line
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow chart to fill container height
  plugins: {
    legend: {
      position: 'top', // as const
      labels: {
          color: '#CBD5E0' // Legend text color for dark mode
      }
    },
    title: {
      display: false, // No main title needed for each small chart
      text: 'Stock Price Chart',
      color: '#E2E8F0'
    },
    tooltip: {
        mode: 'index', // as const,
        intersect: false
    }
  },
  scales: {
      x: {
        ticks: { color: '#A0AEC0' }, // X-axis label color
        grid: { color: '#4A5568' }  // X-axis grid line color
      },
      y: {
        ticks: {
            color: '#A0AEC0', // Y-axis label color
             // Format Y-axis labels as currency
             callback: function(value, index, values) {
                return '$' + value.toFixed(2);
            }
        },
        grid: { color: '#4A5568' } // Y-axis grid line color
      }
    }
};
// --- End Chart Config ---


function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to manage which charts are visible { [stock.id]: boolean }
  const [chartVisibility, setChartVisibility] = useState({});
  const navigate = useNavigate();
  const toast = useToast();


  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const portfolioData = await getUserPortfolio();
      setPortfolio(Array.isArray(portfolioData) ? portfolioData : []);
      // Initialize chart visibility state when portfolio loads
      const initialVisibility = {};
      if(Array.isArray(portfolioData)) {
         portfolioData.forEach(stock => {
            initialVisibility[stock.id] = false; // Start with all charts hidden
         });
      }
       setChartVisibility(initialVisibility);
    } catch (err) {
      console.error("Error loading portfolio:", err);
      setError(err.response?.data?.message || err.message || 'Could not load portfolio.');
      setPortfolio([]);
      toast({ /* ... error toast config ... */ });
    } finally {
       setIsLoading(false);
    }
  };

  // Toggle chart visibility for a specific stock ID
  const toggleChart = (stockId) => {
      setChartVisibility(prev => ({
          ...prev,
          [stockId]: !prev[stockId]
      }));
  }


  const handleDelete = async (portfolioItemId) => {
     // Optional confirmation
    try {
      const response = await deleteStockFromPortfolio(portfolioItemId);
      toast({
          title: response?.message || 'Stock Sold',
          description: 'Removed from portfolio. Check history for details.',
          status: 'success', duration: 3000, isClosable: true
         });
      fetchPortfolio(); // Refresh portfolio list
    } catch (err) {
       console.error("Failed to delete stock:", err);
      toast({ /* ... error toast config ... */ });
    }
  };


  // --- RENDER LOGIC ---
  let content;
  if (isLoading) {
    content = (<Center h="200px"><Spinner size="xl" color="teal.300" /></Center>);
  } else if (error) {
    content = (<Center h="200px"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (portfolio.length === 0) {
    content = (<Center h="200px"><Text color="gray.500" fontSize="lg">Your portfolio is empty.</Text></Center>);
  } else {
     content = (
        <VStack align="stretch" spacing={6}>
          {portfolio.map((stock) => (
            <Box
              key={stock.id} // Use unique ID
              bg="gray.800"
              p={5}
              borderRadius="lg"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.700"
            >
              {/* Existing Stock Details */}
              <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                  <Text fontSize="xl" fontWeight="bold" color="teal.200">
                      {stock.stock_symbol || 'N/A'}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                      Bought: {formatDate(stock.buy_date)}
                  </Text>
                  </HStack>
                  <Divider borderColor="gray.600" />
                  {/* Quantity, Price, Total Cost HStacks */}
                   <HStack spacing={4}><Text color="white" minW="80px">Quantity:</Text><Text color="gray.300">{stock.quantity ?? 'N/A'}</Text></HStack>
                  <HStack spacing={4}><Text color="white" minW="80px">Buy Price:</Text><Text color="gray.300">{formatPrice(stock.buy_price)}</Text></HStack>
                  <HStack spacing={4}><Text color="white" minW="80px">Total Cost:</Text><Text color="gray.300">{formatPrice(Number(stock.quantity || 0) * Number(stock.buy_price || 0))}</Text></HStack>

                 {/* --- Chart Section --- */}
                 <Button
                    variant="link"
                    colorScheme="cyan"
                    size="sm"
                    onClick={() => toggleChart(stock.id)} // Pass stock.id
                    mt={3}
                 >
                     {chartVisibility[stock.id] ? 'Hide Chart' : 'Show Chart'}
                 </Button>

                  {/* Use Collapse for smooth show/hide transition */}
                  <Collapse in={chartVisibility[stock.id]} animateOpacity style={{ width: '100%' }}>
                        <Box mt={4} h="200px" w="100%"> {/* Set height and width for chart container */}
                          <Line
                            options={chartOptions}
                            data={generatePlaceholderChartData(stock.stock_symbol)} // Generate placeholder data per stock
                           />
                        </Box>
                  </Collapse>
                  {/* --- End Chart Section --- */}

                {/* Delete Button */}
                <Button
                  colorScheme="red" variant="outline" mt={4} size="sm"
                  onClick={() => handleDelete(stock.id)}
                >
                  Sell / Delete Stock
                </Button>
              </VStack>
            </Box>
          ))}
        </VStack>
     );
  }

  return (
    <Box px={6} py={8} maxW="6xl" mx="auto" bg="gray.900" color="white" minHeight="100vh">
      <Heading mb={4} color="teal.300" textAlign="center">
        Your Portfolio
      </Heading>
       <Center mb={6}><Button colorScheme="teal" variant="solid" onClick={() => navigate('/dashboard')}>Add New Stocks (Dashboard)</Button></Center>
      {content}
    </Box>
  );
}

export default Portfolio;