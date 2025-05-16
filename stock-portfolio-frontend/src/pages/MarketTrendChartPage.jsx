// src/pages/MarketTrendChartPage.jsx
import React from 'react';
import {
    Box, Heading, Center, Button, useColorModeValue,
    Text, VStack, SimpleGrid // Added SimpleGrid for layout
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// --- Chart.js Imports & Config ---
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler );

// --- Helper Functions (same as before) ---
const generateLast12MonthsLabels = () => { /* ... implementation ... */
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; const labels = []; const today = new Date(); let currentMonth = today.getMonth(); let currentYear = today.getFullYear(); for (let i = 0; i < 12; i++) { labels.push(`${months[currentMonth]} '${String(currentYear).slice(-2)}`); currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } } return labels.reverse(); };
const generatePlaceholderMarketData = (length = 12, base = 4000, volatilityFactor = 0.4, growthFactor = 100) => {
    let lastValue = base; const data = [];
    for (let i = 0; i < length; i++) { const change = (Math.random() - volatilityFactor) * growthFactor; lastValue = Math.max(base * 0.8, lastValue + change); data.push(lastValue); } return data;};

// --- Chart Configurations (One for each market) ---

// US Market (S&P 500 Demo)
const usMarketChartData = { labels: generateLast12MonthsLabels(), datasets: [ { fill: true, label: 'US Market (S&P 500 - Demo)', data: generatePlaceholderMarketData(12, 4000), borderColor: 'rgb(74, 222, 128)', backgroundColor: 'rgba(74, 222, 128, 0.1)', tension: 0.3, pointRadius: 0, }, ],};
const commonChartOptions = (titleText, legendLabelColor = '#E2E8F0', axisColor = '#A0AEC0', gridColor = '#4A5568') => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: true, position: 'top', labels: {color: legendLabelColor} },
             title: { display: true, text: titleText, color: legendLabelColor, padding: { bottom: 15 }, font: {size: 16} },
             tooltip: { mode: 'index', intersect: false } },
  scales: { x: { ticks: { color: axisColor }, grid: { color: gridColor } }, // Grid lines shown
            y: { ticks: { display: true, color: axisColor, callback: (value) => Math.round(value).toLocaleString() }, grid: { color: gridColor} } }, //toLocaleString for y-axis
  elements: { point:{ radius: 2, hoverRadius: 5, hitRadius: 10 } }});

// Nifty 50 (India - Demo)
const niftyChartData = { labels: generateLast12MonthsLabels(), datasets: [ { fill: true, label: 'Nifty 50 (India - Demo)', data: generatePlaceholderMarketData(12, 18000, 0.45, 500), borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.1)', tension: 0.3, pointRadius: 0, }, ],};

// Sensex (India - Demo)
const sensexChartData = { labels: generateLast12MonthsLabels(), datasets: [ { fill: true, label: 'Sensex (India - Demo)', data: generatePlaceholderMarketData(12, 60000, 0.45, 1500), borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.3, pointRadius: 0, }, ],};


const MarketTrendChartPage = () => {
    const navigate = useNavigate();
    // Assuming your theme handles dark/light mode for these.
    // If not, explicitly set them. Example for consistent dark mode:
    const bgColor = "gray.900";
    const textColor = "white";
    const cardBg = "gray.800";
    const headingColor = "teal.300";
    const cardBorderColor = "gray.700";

    const chartHeight = { base: "280px", md: "320px", lg: "350px"}; // Responsive chart height

    return (
        <Box bg={bgColor} color={textColor} minH="100vh" py={10} px={{base: 2, md: 6}}>
            <Box maxW="container.xl" mx="auto">
                <Button
                    leftIcon={<FaArrowLeft />}
                    onClick={() => navigate('/home')}
                    colorScheme="teal"
                    variant="outline"
                    mb={8}
                    borderColor="teal.400"
                    _hover={{ bg: "teal.700"}}
                >
                    Back to Market Overview
                </Button>

                <Heading as="h1" size="xl" color={headingColor} textAlign="center" mb={10}>
                    Major Market Trend Overviews
                </Heading>

                {/* Grid layout for charts */}
                <SimpleGrid columns={{ base: 1, lg: 1 }} spacingX={8} spacingY={10}>
                     {/* Graph for US Market taking approx 3/4 height relative to viewport */}
                     <VStack spacing={6} align="stretch">
                        <Box bg={cardBg} p={{base:3, md:5}} borderRadius="xl" boxShadow="xl" border="1px solid" borderColor={cardBorderColor}>
                             {/*
                            <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
                                Simulated performance data over the past 12 months.
                            </Text>
                            */}
                            <Box h={{base: "40vh", md:"60vh"}} w="full"> {/* A significant portion of viewport height */}
                                <Line options={commonChartOptions("US Market Trend (S&P 500 - Placeholder Data)")} data={usMarketChartData} />
                            </Box>
                        </Box>

                        {/* Nifty and Sensex charts in a 2-column layout on larger screens */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Box bg={cardBg} p={{base:3, md:5}} borderRadius="xl" boxShadow="xl" border="1px solid" borderColor={cardBorderColor}>
                                <Box h={chartHeight} w="full">
                                    <Line options={commonChartOptions("Nifty 50 (India - Placeholder Data)")} data={niftyChartData} />
                                </Box>
                            </Box>

                            <Box bg={cardBg} p={{base:3, md:5}} borderRadius="xl" boxShadow="xl" border="1px solid" borderColor={cardBorderColor}>
                                <Box h={chartHeight} w="full">
                                    <Line options={commonChartOptions("Sensex (India - Placeholder Data)")} data={sensexChartData} />
                                </Box>
                            </Box>
                        </SimpleGrid>
                     </VStack>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default MarketTrendChartPage;