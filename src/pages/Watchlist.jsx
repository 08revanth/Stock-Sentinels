import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  Spinner,
  Center,
  IconButton,
  Collapse,       // Import Collapse
  useDisclosure   // Import useDisclosure hook (though we'll manage state manually here)
} from '@chakra-ui/react';
import { getWatchlist, deleteFromWatchlist, addStockToPortfolio } from '../services/api';
import { FaArrowLeft, FaTrash, FaPlus, FaChartLine } from 'react-icons/fa'; // Added Chart icon
import { useNavigate } from 'react-router-dom';

// --- Chart.js Imports ---
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components (only needs to be done once per app load, but safe to include)
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale
);
// --- End Chart.js Imports ---

// --- Chart Placeholder Data & Options (Same as Portfolio) ---
const generatePlaceholderChartData = (symbol) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: `${symbol} Price`,
      data: Array.from({ length: 6 }, () => Math.random() * 100 + 50), // Dummy data
      borderColor: 'rgb(75, 192, 192)', // Teal line color
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    },
  ],
});

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: '#CBD5E0' } },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { ticks: { color: '#A0AEC0' }, grid: { color: '#4A5568' } },
    y: { ticks: { color: '#A0AEC0', callback: (v) => '$' + v.toFixed(2) }, grid: { color: '#4A5568' } }
  }
};
// --- End Chart Config ---


const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to manage chart visibility { [stock.id]: boolean }
  const [chartVisibility, setChartVisibility] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWatchlist();
      setWatchlist(Array.isArray(data) ? data : []);
      // Initialize chart visibility state when watchlist loads
      const initialVisibility = {};
      if (Array.isArray(data)) {
          data.forEach(stock => {
             initialVisibility[stock.id] = false; // Start hidden
          });
      }
      setChartVisibility(initialVisibility);

    } catch (err) {
       console.error("Error fetching watchlist:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Could not fetch watchlist.';
      setError(errorMessage);
       setWatchlist([]);
       toast({ title: 'Error', description: errorMessage, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []); // Fetch only on mount

   // Toggle chart visibility
   const toggleChart = (stockId) => {
      setChartVisibility(prev => ({
          ...prev,
          [stockId]: !prev[stockId]
      }));
   };

  // Handle Delete
  const handleDelete = async (watchlistId) => {
    try {
      await deleteFromWatchlist(watchlistId);
      toast({ title: 'Removed from watchlist', status: 'info', duration: 2000 });
      fetchWatchlist();
    } catch (err) {
       console.error("Error deleting:", err);
      toast({ title: 'Error Removing', description: err.response?.data?.message || "Failed.", status: 'error' });
    }
  };

  // Handle Move to Portfolio
  const handleMoveToPortfolio = async (item) => {
    // ... (keep existing handleMoveToPortfolio logic)
     try {
         await addStockToPortfolio({ /* ... stock data ... */ });
         await deleteFromWatchlist(item.id);
         toast({ /* ... success toast ... */ });
         fetchWatchlist();
     } catch (err) {
          console.error("Error moving:", err);
         toast({ /* ... error toast ... */ });
     }
  };


  // --- Rendering Logic ---
  let content;
  if (isLoading) {
    content = (<Center h="200px"><Spinner size="xl" color="teal.300" /></Center>);
  } else if (error) {
    content = (<Center h="200px"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (watchlist.length === 0) {
    content = (<Center h="200px"><Text color="gray.500" fontSize="lg">Your watchlist is empty.</Text></Center>);
  } else {
    content = (
      <VStack spacing={4} align="stretch" w="full" maxW="container.md" mx="auto">
        {watchlist.map((stock) => (
          <Box
            key={stock.id} // Use unique ID
            p={4}
            bg="gray.700"
            borderRadius="md"
            shadow="sm"
            border="1px solid" borderColor="gray.600"
          >
            <VStack align="stretch" spacing={3}> {/* Wrap content in VStack */}
                <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="medium" color="teal.200">
                        {stock.stock_symbol || 'N/A'}
                    </Text>
                    <HStack>
                         <Button
                             leftIcon={<FaPlus />} size="xs" colorScheme="green" variant="outline"
                             onClick={() => handleMoveToPortfolio(stock)} title="Add to Portfolio">
                             Portfolio
                        </Button>
                        {/* Toggle Chart Button */}
                        <IconButton
                            aria-label="Toggle chart"
                            icon={<FaChartLine />}
                            size="xs" colorScheme="blue" variant="outline"
                            onClick={() => toggleChart(stock.id)} // Use the toggle function
                        />
                         <IconButton
                             aria-label="Remove from watchlist" icon={<FaTrash />}
                             size="xs" colorScheme="red" variant="ghost"
                             onClick={() => handleDelete(stock.id)}
                         />
                     </HStack>
                </HStack>

                {/* Collapsible Chart Section */}
                <Collapse in={chartVisibility[stock.id]} animateOpacity style={{ width: '100%' }}>
                    <Box mt={2} h="150px" w="100%"> {/* Adjust height as needed */}
                      <Line
                        options={chartOptions}
                        data={generatePlaceholderChartData(stock.stock_symbol)} // Generate placeholder data
                      />
                    </Box>
                </Collapse>
            </VStack> {/* End inner VStack */}
          </Box>
        ))}
      </VStack>
    );
  }


  return (
    <Box p={6} color="white" bg="gray.900" minHeight="100vh">
       <HStack justify="space-between" w="full" mb={6}>
         <Heading color="teal.300" size="lg">Your Watchlist</Heading>
         <Button leftIcon={<FaArrowLeft />} colorScheme="teal" variant="outline" onClick={() => navigate('/dashboard')} _hover={{ bg: 'teal.600', color: 'white' }}>
                Back to Dashboard
         </Button>
       </HStack>
       {content}
    </Box>
  );
};

export default Watchlist;