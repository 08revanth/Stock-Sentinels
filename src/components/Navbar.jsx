import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Link removed as it wasn't used

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem('token'); // Clear the token
      localStorage.removeItem('user'); // Clear user info if stored separately
      // You might need to update global auth state (Context API) here too
      navigate('/'); // Navigate to Landing Page (Login/Signup options)
      // Optionally force reload if state isn't updating nav correctly:
      // window.location.reload();
  };

  return (
    <Box bg="gray.900" p={4} position="sticky" top={0} zIndex="sticky"> {/* Make navbar sticky */}
      <Flex align="center" maxW="container.xl" mx="auto"> {/* Added maxW and centering */}
        <Heading size="md" color="teal.300" cursor="pointer" onClick={() => navigate('/home')}> {/* Make title clickable */}
            Stock Sentinel
        </Heading>
        <Spacer />
        {/* Navigation Buttons */}
        <Button variant="ghost" colorScheme="teal" size="sm" onClick={() => navigate("/home")} mr={2}>
             Home {/* Changed Target */}
        </Button>
        <Button variant="ghost" colorScheme="teal" size="sm" onClick={() => navigate("/dashboard")} mr={2}>
             Dashboard {/* Added Dashboard Link */}
        </Button>
        <Button variant="ghost" colorScheme="teal" size="sm" onClick={() => navigate("/portfolio")} mr={2}>
             Portfolio
        </Button>
        <Button variant="ghost" colorScheme="teal" size="sm" onClick={() => navigate("/watchlist")} mr={2}>
             Watchlist
        </Button>
         <Button variant="ghost" colorScheme="teal" size="sm" onClick={() => navigate("/stock-history")} mr={2}>
             History
        </Button>
        {/* Logout Button */}
        <Button colorScheme="red" variant="solid" size="sm" onClick={handleLogout}> {/* Call handler */}
            Logout {/* Target changed via handler */}
        </Button>
      </Flex>
    </Box>
  );
}
export default Navbar;