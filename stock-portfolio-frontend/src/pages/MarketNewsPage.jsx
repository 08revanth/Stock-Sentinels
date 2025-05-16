// src/pages/MarketNewsPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box, Button, Heading, Text, VStack, Spinner, Center,
    Link as ChakraLink, Icon, Flex, SimpleGrid
} from '@chakra-ui/react';
// Removed useColorModeValue as page bg/color will be inherited
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaNewspaper, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchMarketNews } from '../services/api';

const MarketNewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // Colors directly reflecting a dark theme or from semantic tokens
  const headingColor = "brand.300";
  const cardBg = "gray.800";
  const cardBorderColor = "gray.700";
  const cardHoverBorderColor = "brand.400";
  const sourceTextColor = "gray.400";
  const pageTextColor = "whiteAlpha.900"; // Explicit default text color

  useEffect(() => {
    // ... (keep existing fetch logic)
    setLoadingNews(true); setNewsError(null);
    fetchMarketNews().then((data) => { /* ... */ if (Array.isArray(data)) { const validNews = data.filter(item => item.headline && item.summary && item.url && item.id); setNews(validNews.slice(0, 30)); } else { setNewsError("Invalid data format."); setNews([]); } }).catch((err) => { const msg = err.response?.data?.message || err.message || "Could not load news"; setNewsError(msg); setNews([]); }).finally(() => { setLoadingNews(false); });
  }, []);

  return (
    // The main Box's bg and color should be inherited from global theme styles (from index.js)
    // Adding minH here too just in case, but PageWrapper (if used) or global style is primary
    <Box minH="100vh" py={10} px={{ base: 2, md: 4 }} color={pageTextColor}> {/* Explicit text color */}
        <Box maxW="container.xl" mx="auto">
            <Flex mb={8} align="center" justify="space-between" wrap="wrap">
                <Flex align="center" mb={{ base: 4, md: 0 }}>
                    <Icon as={FaNewspaper} w={{ base: 8, md: 10 }} h={{ base: 8, md: 10 }} color={headingColor} mr={4}/>
                    <Heading as="h1" size="xl" color={headingColor}>Market News Feed</Heading>
                </Flex>
                <Button
                    leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)}
                    colorScheme="brand" variant="outline"
                    borderColor={headingColor} color={headingColor}
                    _hover={{bg: "brand.700", color: "white"}}
                > Back </Button>
            </Flex>

            {loadingNews ? (
              <Center p={20}><Spinner color={headingColor} size="xl" thickness="4px" /></Center>
            ) : newsError ? (
              <Center p={20}><Text color="red.400" fontSize="lg">Error: {newsError}</Text></Center>
            ) : news.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {news.map((item) => (
                  <Box
                    key={item.id || item.url} bg={cardBg} p={5} borderRadius="lg" textAlign="left"
                    border="1px solid" borderColor={cardBorderColor} boxShadow="lg"
                    transition="all 0.2s ease-in-out"
                    _hover={{ borderColor: cardHoverBorderColor, shadow: "xl", transform: "translateY(-5px)" }}
                  >
                    <Heading as="h3" size="md" color={headingColor} mb={2} noOfLines={3}>{item.headline}</Heading>
                    <Text fontSize="sm" noOfLines={4} mb={3} lineHeight="base">{item.summary}</Text> {/* Inherits color */}
                    <Flex justify="space-between" align="center" mt="auto" pt={2}>
                        <Text fontSize="xs" color={sourceTextColor}>Source: {item.source || 'News API'}</Text>
                        <Button as={ChakraLink} href={item.url} isExternal variant="link" colorScheme="blue" size="sm" rightIcon={<ExternalLinkIcon />}> Read Full Article </Button>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            ) : ( <Center p={20}><Text>No recent market news available.</Text></Center> )}
        </Box>
    </Box>
  );
};

export default MarketNewsPage;