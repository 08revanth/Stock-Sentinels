// src/pages/Portfolio.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Heading, VStack, Text, HStack, Divider, Button, useToast, Spinner, Center,
  Collapse, Icon, Tag, TagLabel, SimpleGrid,
  Flex // <<<====== ADDED Flex IMPORT
} from '@chakra-ui/react';
import { getUserPortfolio, deleteStockFromPortfolio } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine, FaAngleDown, FaAngleUp, FaPlusCircle, FaTrashAlt,
    FaBriefcase // <<<====== ADDED FaBriefcase IMPORT
} from 'react-icons/fa';

// --- Chart.js Imports & Registration (Keep as is) ---
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale );
// --- End Chart.js ---

// Helper functions (Keep as is)
const formatPrice = (price) => { if (price === null || price === undefined) return 'N/A'; const n = Number(price); if (isNaN(n)) return 'Invalid'; return `$${n.toFixed(2)}`; };
const formatDate = (dateString) => { if (!dateString) return 'N/A'; try { const d = new Date(dateString); if (isNaN(d.getTime())) return 'Invalid Date'; return d.toLocaleDateString(); } catch (e) { return 'Invalid Date'; } };

// --- Placeholder Chart Data & Options (Keep as is) ---
const generatePlaceholderChartData = (symbol) => ({ labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: `${symbol} Price`, data: Array.from({length:6},()=>Math.random()*100+50), borderColor:'rgb(53,162,235)', backgroundColor:'rgba(53,162,235,0.5)', tension:0.1 }] });
const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#A0AEC0' } }, title: { display: false }, tooltip: { mode: 'index', intersect: false, bodyFont:{size:10}, titleFont:{size:12} } }, scales: { x: { ticks: { color: '#A0AEC0',font:{size:10}}, grid: { color: 'rgba(74,85,104,0.5)' } }, y: { ticks: { color: '#A0AEC0',font:{size:10}, callback: function(v){return '$'+v.toFixed(2);}}, grid: { color: 'rgba(74,85,104,0.5)' } } } };

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartVisibility, setChartVisibility] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const cardBg = "gray.800";
  const cardBorderColor = "gray.700";
  const cardHoverBorderColor = "brand.400";
  const primaryTextColor = "whiteAlpha.900";
  const secondaryTextColor = "gray.400";
  const headingColor = "brand.300";
  const labelColor = "gray.500";

  const fetchPortfolio = useCallback(async () => { setIsLoading(true); setError(null); try { const pD = await getUserPortfolio(); setPortfolio(Array.isArray(pD)?pD:[]); const iV={}; if(Array.isArray(pD)){pD.forEach(s=>{iV[s.id]=false;});} setChartVisibility(iV); } catch (e) { setError(e.response?.data?.message||e.message||'Err load portfolio.'); setPortfolio([]); toast({title:'Err Load Portfolio',description:e.response?.data?.message||e.message,status:'error'}); } finally { setIsLoading(false); } }, [toast]);
  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);
  const toggleChart = (stockId) => { setChartVisibility(prev => ({ ...prev, [stockId]: !prev[stockId] })); };
  const handleDelete = async (portfolioItemId) => { try { const r = await deleteStockFromPortfolio(portfolioItemId); toast({title:r?.message||'Stock Sold',description:'Removed from portfolio.',status:'success',duration:3000,isClosable:true}); fetchPortfolio(); } catch (e) { toast({title:'Fail Sell Stock',description:e.response?.data?.message||e.message,status:'error'}); } };

  let content;
  if (isLoading) {
    content = (<Center h="50vh"><Spinner size="xl" color={headingColor} thickness="4px"/></Center>);
  } else if (error) {
    content = (<Center h="30vh"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (portfolio.length === 0) {
    content = ( <Center h="30vh" flexDirection="column"><Text color={secondaryTextColor} fontSize="lg" mb={4}>Your portfolio is currently empty.</Text><Button colorScheme="brand" onClick={() => navigate('/dashboard')} leftIcon={<FaPlusCircle/>}>Add Your First Stock</Button></Center>);
  } else {
     content = (
        <SimpleGrid columns={{ base: 1, md: 2, xl:3 }} spacing={6}>
          {portfolio.map((stock) => (
            <Box key={stock.id} bg={cardBg} p={5} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={cardBorderColor} transition="all 0.2s ease-in-out" _hover={{ borderColor: cardHoverBorderColor, transform: "translateY(-4px)", shadow:"xl" }}>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between" w="full" mb={1}>
                  <Heading size="md" color={headingColor} noOfLines={1} title={stock.stock_symbol}>{stock.stock_symbol || 'N/A'}</Heading>
                  <Text fontSize="xs" color={secondaryTextColor}>Bought: {formatDate(stock.buy_date)}</Text>
                </HStack>
                <Divider borderColor="gray.700" />
                <HStack justify="space-between"><Text color={labelColor} fontSize="sm">Quantity:</Text><Text color={primaryTextColor} fontWeight="medium">{stock.quantity ?? 'N/A'}</Text></HStack>
                <HStack justify="space-between"><Text color={labelColor} fontSize="sm">Buy Price:</Text><Text color={primaryTextColor} fontWeight="medium">{formatPrice(stock.buy_price)}</Text></HStack>
                <HStack justify="space-between" mb={2} borderTop="1px dashed" borderColor="gray.700" pt={2} mt={1}>
                    <Text color={labelColor} fontSize="sm" fontWeight="bold">Current Value:</Text>
                    <Tag size="md" colorScheme="green" variant="subtle"><TagLabel fontWeight="bold" fontSize="md">{formatPrice(Number(stock.quantity || 0) * Number(stock.buy_price || 0))}</TagLabel></Tag>
                </HStack>
                <Button variant="outline" colorScheme="cyan" size="xs" onClick={() => toggleChart(stock.id)} leftIcon={<Icon as={FaChartLine} />} rightIcon={chartVisibility[stock.id] ? <FaAngleUp /> : <FaAngleDown />} borderColor="cyan.600" color="cyan.300" _hover={{bg: "cyan.700", color: "white"}} width="full">
                     {chartVisibility[stock.id] ? 'Hide Performance' : 'Show Performance'}
                 </Button>
                  <Collapse in={chartVisibility[stock.id]} animateOpacity>
                        <Box mt={3} h="200px" w="100%" bg="gray.750" p={2} borderRadius="md" border="1px solid" borderColor="gray.600">
                          <Line options={chartOptions} data={generatePlaceholderChartData(stock.stock_symbol)} />
                        </Box>
                  </Collapse>
                <Button leftIcon={<Icon as={FaTrashAlt}/>} colorScheme="red" variant="ghost" _hover={{bg: "red.600", color: "white"}} mt={3} size="sm" onClick={() => handleDelete(stock.id)} width="full">
                  Sell / Remove
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
     );
  }

  return (
    <Box px={{base:2, md:6}} py={8} w="full" maxW="container.2xl" mx="auto">
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <Heading color={headingColor} size="xl" display="flex" alignItems="center">
          <Icon as={FaBriefcase} mr={3} /> Your Portfolio
        </Heading>
        <Button colorScheme="brand" variant="solid" onClick={() => navigate('/dashboard')} leftIcon={<FaPlusCircle />}>
            Add New Stock
        </Button>
       </Flex>
      {content}
    </Box>
  );
}

export default Portfolio;