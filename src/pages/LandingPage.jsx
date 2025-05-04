import React, { useEffect, useState } from 'react';
import {
    Box, Button, Heading, Text, VStack, Spinner, Center,
    Link as ChakraLink // Import Chakra's Link for styling integration
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons'; // Import icon for external links
import { useNavigate } from 'react-router-dom';
import { fetchMarketNews } from '../services/api'; // Make sure this points to your updated api.js

// --- Chart.js Imports & Config ---
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );
// (Keep the generateLabels, generateData, marketChartData, marketChartOptions from previous version)
const generateLast12MonthsLabels = () => { /* ... implementation ... */
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; const labels = []; const today = new Date(); let currentMonth = today.getMonth(); let currentYear = today.getFullYear(); for (let i = 0; i < 12; i++) { labels.push(`${months[currentMonth]} '${String(currentYear).slice(-2)}`); currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } } return labels.reverse(); };
const generatePlaceholderMarketData = (length = 12) => { /* ... implementation ... */
    let lastValue = 4000; const data = []; for (let i = 0; i < length; i++) { const change = (Math.random() - 0.4) * 100; lastValue = Math.max(3500, lastValue + change); data.push(lastValue); } return data;};
const marketChartData = { labels: generateLast12MonthsLabels(), datasets: [ { fill: true, label: 'US Market Trend (S&P 500 - Demo)', data: generatePlaceholderMarketData(12), borderColor: 'rgb(74, 222, 128)', backgroundColor: 'rgba(74, 222, 128, 0.1)', tension: 0.3, pointRadius: 0, }, ],};
const marketChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'US Market Trend (S&P 500 - Demo Data)', color: '#E2E8F0', padding: { bottom: 15 } }, tooltip: { mode: 'index', intersect: false } }, scales: { x: { ticks: { color: '#A0AEC0' }, grid: { display: false } }, y: { ticks: { display: true, color: '#A0AEC0'}, grid: { color: '#4A5568', borderDash: [3, 3], drawBorder: false } } }, elements: { point:{ radius: 0 } }};
// --- End Chart Config ---


function LandingPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true); // Start loading initially
  const [newsError, setNewsError] = useState(null);

  // Fetch Market News on component mount
  useEffect(() => {
    setLoadingNews(true);
    setNewsError(null);
    console.log("Fetching market news...");
    fetchMarketNews() // Call the service function
      .then((data) => {
        console.log("Received news data:", data);
        if (Array.isArray(data)) {
            // Filter news that have necessary properties (adjust based on actual API response)
            const validNews = data.filter(item => item.headline && item.summary && item.url && item.id); // Added check for ID
            setNews(validNews.slice(0, 5)); // Take top 5 valid articles
            console.log("News state updated with", validNews.slice(0,5).length, "items.");
        } else {
            console.warn("News data received is not an array:", data);
            setNewsError("Received invalid news data format.");
            setNews([]); // Set empty if format is wrong
        }
      })
      .catch((err) => {
        console.error('Failed to load market news:', err);
        const msg = err.response?.data?.message || err.message || "Could not load news";
        setNewsError(msg);
        setNews([]); // Set empty on error
      })
      .finally(() => {
         setLoadingNews(false); // Ensure loading stops
         console.log("Finished fetching news.");
      });
  }, []); // Empty dependency array means run once on mount


  return (
    <VStack spacing={8} pt={10} pb={20} bg="gray.900" minH="100vh" color="white">
      <Heading size="2xl" color="teal.400">Welcome to Stock Sentinel</Heading>
      <Text fontSize="lg" color="gray.300">Your personalized stock portfolio manager</Text>

      {/* --- Chart Container --- */}
      <Box w="full" maxW="container.lg" h="350px" px={4} mx="auto" mt={4}>
         <Line options={marketChartOptions} data={marketChartData} />
      </Box>

      {/* --- Auth Buttons --- */}
      <Box>
        <Button colorScheme="teal" size="lg" mr={4} onClick={() => navigate('/signup')}>Get Started (Sign Up)</Button>
        <Button colorScheme="gray" size="lg" onClick={() => navigate('/login')}>Login</Button>
      </Box>

      {/* --- Market News Section --- */}
      <Box mt={8} px={4} w="full" maxW="container.md">
        <Heading size="lg" color="teal.300" mb={4} textAlign="center">Latest Market News</Heading>
        {loadingNews ? (
          <Center p={10}><Spinner color="teal.300" size="xl" thickness="4px" /></Center> // Spinner while loading
        ) : newsError ? (
          <Center p={10}><Text color="red.400">Error loading news: {newsError}</Text></Center> // Error message
        ) : news.length > 0 ? (
          <VStack spacing={4} align="stretch"> {/* Changed spacing */}
            {news.map((item) => ( // Use Finnhub's unique `id` or `url` if `id` is not present
              <Box
                key={item.id || item.url} // Use unique ID provided by Finnhub API
                bg="gray.800"
                p={4}
                borderRadius="lg" // Slightly rounder corners
                textAlign="left"
                border="1px solid"
                borderColor="gray.700" // Use consistent border color
                _hover={{ borderColor: 'gray.600', shadow: 'md' }} // Subtle hover effect
              >
                <Text fontWeight="semibold" color="teal.200" mb={1} fontSize="md">{item.headline}</Text> {/* Use semibold */}
                <Text fontSize="sm" color="gray.300" noOfLines={3} lineHeight="short">{item.summary}</Text> {/* Limit lines, improve readability */}
                {/* Use ChakraLink for styling consistency and accessibility */}
                <Button
                    as={ChakraLink} // Render as a link
                    href={item.url} // The actual news URL
                    isExternal // Adds rel="noopener noreferrer" automatically
                    variant="link" // Link appearance
                    colorScheme="blue" // Use theme color
                    size="sm" // Smaller size
                    mt={2}
                    rightIcon={<ExternalLinkIcon />} // Add external link icon
                >
                  Read more
                </Button>
              </Box>
            ))}
          </VStack>
        ) : (
           // Message shown if loading is done and news array is empty
           <Center p={10}><Text color="gray.500">No recent market news available.</Text></Center>
        )}
      </Box>
    </VStack>
  );
}

export default LandingPage;