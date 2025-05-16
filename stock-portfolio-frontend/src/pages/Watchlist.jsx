// src/pages/Watchlist.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Heading, Text, VStack, HStack, Button, useToast, Spinner, Center,
  IconButton, Collapse, Icon, Flex, Divider,
  SimpleGrid
} from '@chakra-ui/react';
import { getWatchlist, deleteFromWatchlist, addStockToPortfolio } from '../services/api';
import {
    FaArrowLeft, FaTrashAlt, FaPlusCircle, FaChartLine, FaAngleDown, FaAngleUp, FaEyeSlash, FaEye,
    FaListAlt // Added FaListAlt here
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale );

const generatePlaceholderChartData = (symbol) => ({ labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:`${symbol} Price`,data:Array.from({length:6},()=>Math.random()*100+50),borderColor:'rgb(75,192,192)',backgroundColor:'rgba(75,192,192,0.2)',tension:0.1, pointRadius: 2, pointBackgroundColor: 'rgb(75,192,192)'}] });
const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { color: '#A0AEC0', boxWidth:15, padding:15, font:{size:10} } }, title: { display: false }, tooltip: { mode: 'index', intersect: false, titleFont:{size:11}, bodyFont:{size:10} } },
  scales: { x: { ticks: { color: '#A0AEC0', font:{size:9} }, grid: { color: 'rgba(74,85,104,0.3)' } }, y: { ticks: { color: '#A0AEC0',font:{size:9}, callback:(v)=>'$'+v.toFixed(2) }, grid: { color: 'rgba(74,85,104,0.3)' } } }
};

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartVisibility, setChartVisibility] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const headingColor = "brand.300";
  const cardBg = "gray.800";
  const cardBorderColor = "gray.700";
  const cardHoverBorderColor = "brand.400";
  const subtleTextColor = "gray.400";
  const primaryTextColor = "whiteAlpha.900";
  const chartBoxBg = "gray.750";

  const fetchWatchlist = useCallback(async () => { setIsLoading(true); setError(null); try { const d = await getWatchlist(); setWatchlist(Array.isArray(d)?d:[]); const iV={}; if(Array.isArray(d)){d.forEach(s=>{iV[s.id]=false;});}setChartVisibility(iV);}catch(err){const eM=err.response?.data?.message||err.message||'Err';setError(eM);setWatchlist([]);toast({title:'Err Fetch Watchlist',description:eM,status:'error'});}finally{setIsLoading(false);}},[toast]);
  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);
  const toggleChart = (stockId) => { setChartVisibility(prev => ({ ...prev, [stockId]: !prev[stockId] })); };
  const handleDelete = async (watchlistId) => { try { await deleteFromWatchlist(watchlistId); toast({title:'Removed',status:'success',duration:2000,variant:'subtle'}); fetchWatchlist(); } catch (err) { toast({title:'Err Remove',description:err.response?.data?.message||"Fail",status:'error'}); }};
  const handleMoveToPortfolio = async (item) => { if(!item||!item.stock_symbol||!item.id)return; try { await addStockToPortfolio({stock_symbol:item.stock_symbol,quantity:1,buy_price:0,buy_date:new Date().toISOString().slice(0,19).replace('T',' ')}); await deleteFromWatchlist(item.id); toast({title:`${item.stock_symbol} moved!`,status:'success'});fetchWatchlist();}catch(err){toast({title:'Err Moving',description:err.response?.data?.message||"Fail",status:'error'});}};

  let content;
  if (isLoading) {
    content = (<Center h="50vh"><Spinner size="xl" color={headingColor} thickness="4px"/></Center>);
  } else if (error) {
    content = (<Center h="30vh"><Text color="red.400" fontSize="lg">Error: {error}</Text></Center>);
  } else if (watchlist.length === 0) {
    content = ( <Center h="30vh" flexDirection="column"><Text color={subtleTextColor} fontSize="lg" mb={4}>Your watchlist is empty.</Text><Button colorScheme="brand" onClick={() => navigate('/dashboard')} leftIcon={<FaPlusCircle/>}>Add Stocks via Dashboard</Button></Center>);
  } else {
    content = (
      <VStack spacing={5} align="stretch" w="full" maxW="container.lg" mx="auto">
        {watchlist.map((stock) => (
          <Box key={stock.id} p={5} bg={cardBg} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={cardBorderColor} transition="all 0.2s ease-in-out" _hover={{ borderColor: cardHoverBorderColor, transform: "translateY(-3px)", shadow:"xl" }}>
            <VStack align="stretch" spacing={3}>
                <Flex justify="space-between" align="center">
                    <Heading size="md" color={headingColor} noOfLines={1} title={stock.stock_symbol}>{stock.stock_symbol || 'N/A'}</Heading>
                    <HStack spacing={2}>
                         <Button leftIcon={<Icon as={FaPlusCircle} boxSize="0.9em"/>} size="xs" colorScheme="green" variant="outline" borderColor="green.500" color="green.300" _hover={{bg:"green.600", color:"white"}} onClick={() => handleMoveToPortfolio(stock)} title="Move to Portfolio (1 Qty, Price 0)">Portfolio</Button>
                        <IconButton aria-label="Toggle chart" icon={chartVisibility[stock.id] ? <FaEyeSlash /> : <FaEye />} size="xs" colorScheme="blue" variant="outline" borderColor="blue.500" color="blue.300" _hover={{bg:"blue.600", color:"white"}} onClick={() => toggleChart(stock.id)} />
                         <IconButton aria-label="Remove from watchlist" icon={<FaTrashAlt />} size="xs" colorScheme="red" variant="ghost" color="red.400" _hover={{bg:"red.600", color:"white"}} onClick={() => handleDelete(stock.id)} />
                     </HStack>
                </Flex>
                <Collapse in={chartVisibility[stock.id]} animateOpacity>
                    <Box mt={3} h="180px" w="100%" bg={chartBoxBg} p={2} borderRadius="md" border="1px solid" borderColor="gray.600">
                      <Line options={chartOptions} data={generatePlaceholderChartData(stock.stock_symbol)} />
                    </Box>
                </Collapse>
            </VStack>
          </Box>
        ))}
      </VStack>
    );
  }

  return (
    <Box py={8} px={{base:2, md:6}} w="full">
       <Flex justify="space-between" align="center" mb={8} maxW="container.xl" mx="auto" wrap="wrap" gap={4}>
         <Heading color={headingColor} size="xl" display="flex" alignItems="center">
            <Icon as={FaListAlt} mr={3} /> Your Watchlist {/* Correct icon usage */}
         </Heading>
         <Button leftIcon={<FaArrowLeft />} colorScheme="brand" variant="outline" borderColor={headingColor} color={headingColor} _hover={{ bg: 'brand.700', color: 'white' }} onClick={() => navigate('/dashboard')} size="sm">
            Back to Dashboard
         </Button>
       </Flex>
       <Box maxW="container.xl" mx="auto">
            {content}
       </Box>
    </Box>
  );
};

export default Watchlist;