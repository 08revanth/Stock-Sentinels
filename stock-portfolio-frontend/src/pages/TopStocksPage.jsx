// src/pages/TopStocksPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Heading, Text, Spinner, Center, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast, Alert, AlertIcon,
  InputGroup, InputLeftElement, Input, Icon,
  VStack
} from '@chakra-ui/react';
import { FaSearch, FaListOl } from 'react-icons/fa';
import { fetchTop100US, fetchTop100Nifty, fetchTop100Sensex } from '../services/api';

const TopStocksPage = () => {
  // Explicit Dark Theme Color Definitions
  const headingColor = "brand.300";
  const tableHeaderColor = "gray.400";
  const tableRowHoverBg = "gray.750";
  const tabPanelBg = "gray.800"; // Background for the content area below tabs
  const searchInputBg = "gray.700";
  const searchInputBorder = "gray.600";
  const searchInputFocusBorder = "brand.400";
  const tableTheadBg = "gray.750"; // Can be same as tabPanelBg or slightly different

  // Tab specific colors - these will interact with colorScheme="brand"
  const selectedTabColor = "white";         // Text color of selected tab
  const unselectedTabColor = "gray.300";    // Text color of unselected tabs
  // For soft-rounded, the bg color comes from the colorScheme
  // For hover on unselected, we can specify
  const tabHoverBg = "gray.700";
  const tabHoverColor = "whiteAlpha.800";


  const [usStocks, setUsStocks] = useState([]);
  const [niftyStocks, setNiftyStocks] = useState([]);
  const [sensexStocks, setSensexStocks] = useState([]);
  const [usSearch, setUsSearch] = useState('');
  const [niftySearch, setNiftySearch] = useState('');
  const [sensexSearch, setSensexSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchData = useCallback(async () => { /* ... (Keep existing fetchData logic) ... */ setIsLoading(true); setError(null); try { const [usData, niftyData, sensexData] = await Promise.all([ fetchTop100US().catch(e => { return []; }), fetchTop100Nifty().catch(e => { return []; }), fetchTop100Sensex().catch(e => { return []; }) ]); setUsStocks(Array.isArray(usData) ? usData : []); setNiftyStocks(Array.isArray(niftyData) ? niftyData : []); setSensexStocks(Array.isArray(sensexData) ? sensexData : []); if (!usData.length && !niftyData.length && !sensexData.length) { throw new Error("No data received for any stock list."); } } catch (err) { const msg = err.message || "Could not load top stock lists."; setError(msg); toast({ title: 'Error Loading Data', description: msg, status: 'error', duration: 7000 }); } finally { setIsLoading(false); } }, [toast]);
  useEffect(() => { fetchData(); }, [fetchData]);
  const filterStocks = (stocks, searchTerm) => { /* ... (Keep existing filterStocks logic) ... */ if (!searchTerm) return stocks; const lowerSearchTerm = searchTerm.toLowerCase(); return stocks.filter(stock => stock.company_name.toLowerCase().includes(lowerSearchTerm) || stock.ticker_symbol.toLowerCase().includes(lowerSearchTerm) ); };

  const renderStockTable = (title, stocks, searchTerm, setSearchTerm) => {
    const filteredStocks = filterStocks(stocks, searchTerm);
    return (
      <VStack spacing={4} align="stretch" p={{base: 2, md: 4}}>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none" children={<Icon as={FaSearch} color="gray.500" />} />
          <Input
            type="text"
            placeholder={`Search ${title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={searchInputBg}
            borderColor={searchInputBorder}
            _focus={{ borderColor: searchInputFocusBorder, boxShadow: `0 0 0 1px ${searchInputFocusBorder}` }}
            borderRadius="md"
            color="whiteAlpha.900"
            _placeholder={{color: "gray.500"}}
          />
        </InputGroup>
        {filteredStocks.length === 0 && !isLoading ? (
          <Center p={10} minH="200px"><Text color="gray.500">
            {searchTerm ? `No results found for "${searchTerm}" in ${title}.` : `No data available for ${title}.`}
          </Text></Center>
        ) : (
          <TableContainer borderWidth="1px" borderColor={searchInputBorder} borderRadius="md">
            <Table variant='simple' size='sm'>
              <Thead bg={tableTheadBg}>
                <Tr> <Th color={tableHeaderColor} w="5%" py={3}>#</Th> <Th color={tableHeaderColor} py={3}>Company Name</Th> <Th color={tableHeaderColor} py={3}>Ticker Symbol</Th> </Tr>
              </Thead>
              <Tbody>
                {filteredStocks.map((stock, index) => (
                  <Tr key={stock.id} _hover={{ bg: tableRowHoverBg }}>
                    <Td py={2}>{index + 1}</Td> <Td py={2}>{stock.company_name}</Td> <Td fontWeight="medium" color="brand.300" py={2}>{stock.ticker_symbol}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </VStack>
    );
  };

  return (
    <Box py={8} px={{base:2, md:4}} >
      <Heading mb={8} color={headingColor} textAlign="center" size="xl">
        <Icon as={FaListOl} mr={3} verticalAlign="middle"/>Top Market Companies
      </Heading>
      {isLoading ? ( <Center h="50vh"><Spinner size="xl" color={headingColor} thickness="4px" speed="0.65s"/></Center>
      ) : error ? ( <Center p={8}><Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10} borderRadius="md" bg="red.900" color="red.100"><AlertIcon boxSize="40px" mr={0} color="red.100"/><Text fontWeight="bold" mt={4} mb={1} fontSize="lg">Error Loading Data</Text><Text fontSize="sm">{error}</Text></Alert></Center>
      ) : (
        <Tabs isFitted variant='soft-rounded' colorScheme='brand' align="center"> {/* Using soft-rounded again */}
          <TabList mb={6} borderBottom="2px solid" borderColor="gray.700"> {/* More distinct TabList style */}
            <Tab
              color={unselectedTabColor}
              _selected={{ color: selectedTabColor, bg: "brand.500", fontWeight:'semibold' }} // Brand bg for selected
              _hover={{bg: tabHoverBg, color: "white"}} // Common hover
              py={2} // Padding for tabs
              fontSize="sm" // Slightly smaller font for tabs
            >US Top 100</Tab>
            <Tab
              color={unselectedTabColor}
              _selected={{ color: selectedTabColor, bg: "brand.500", fontWeight:'semibold' }}
              _hover={{bg: tabHoverBg, color: "white"}}
              py={2} fontSize="sm"
            >Nifty 100</Tab>
            <Tab
              color={unselectedTabColor}
              _selected={{ color: selectedTabColor, bg: "brand.500", fontWeight:'semibold' }}
              _hover={{bg: tabHoverBg, color: "white"}}
              py={2} fontSize="sm"
            >Sensex 100</Tab>
          </TabList>

          <TabPanels bg={tabPanelBg} borderRadius="lg" boxShadow="xl" p={0} border="1px solid" borderColor="gray.700">
            <TabPanel p={0}>{renderStockTable("US Top 100", usStocks, usSearch, setUsSearch)}</TabPanel>
            <TabPanel p={0}>{renderStockTable("Nifty 100", niftyStocks, niftySearch, setNiftySearch)}</TabPanel>
            <TabPanel p={0}>{renderStockTable("Sensex 100", sensexStocks, sensexSearch, setSensexSearch)}</TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default TopStocksPage;