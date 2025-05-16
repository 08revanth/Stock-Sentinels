import Navbar from './Navbar';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';

const PageWrapper = ({ children }) => (
  <Box minH="100vh" display="flex" flexDirection="column">
    <Navbar />
    <Box flex="1" p={4} bg="black">{children}</Box>
    <Footer />
  </Box>
);

export default PageWrapper;
