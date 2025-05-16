// src/components/Navbar.jsx
import {
    Box, Flex, Heading, Spacer, Button,
    Menu, MenuButton, MenuList, MenuItem, Icon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaNewspaper, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { ChevronDownIcon } from '@chakra-ui/icons';

function Navbar() {
  const navigate = useNavigate();

  // Define consistent colors for dark mode Navbar
  const navBg = "gray.900";                 // Navbar background
  const logoColor = "brand.300";            // Teal for "Stock Sentinel" logo
  const navLinkColor = "whiteAlpha.800";    // Text color for nav links
  const navLinkHoverBg = "brand.700";     // Darker teal for button hover
  const navLinkHoverColor = "white";      // Text color on hover
  const menuBg = "gray.800";                // Dropdown menu background
  const menuBorderColor = "gray.700";       // Dropdown menu border
  const menuItemHoverBg = "brand.600";      // Teal hover for menu items
  const menuItemIconColor = "brand.300";    // Teal for icons in menu

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/'); // Navigate to Landing Page (public)
  };

  // Reusable Button style for Nav links
  const NavButton = (props) => (
    <Button
      variant="ghost"
      color={navLinkColor}
      _hover={{ bg: navLinkHoverBg, color: navLinkHoverColor }}
      size="sm"
      mr={2}
      {...props}
    />
  );

  return (
    <Box bg={navBg} px={4} py={3} position="sticky" top={0} zIndex="sticky" borderBottom="1px solid" borderColor="gray.700"> {/* Added bottom border */}
      <Flex align="center" maxW="container.xl" mx="auto">
        <Heading
            size="md"
            color={logoColor}
            cursor="pointer"
            onClick={() => navigate('/home')}
            _hover={{ color: "brand.200" }} // Brighter teal on logo hover
        >
            Stock Sentinel
        </Heading>
        <Spacer />

        {/* Navigation Buttons using NavButton component */}
        <NavButton onClick={() => navigate("/home")}> Home </NavButton>
        <NavButton onClick={() => navigate("/top-stocks")}> Top Stocks </NavButton>

        <Menu>
            <MenuButton
                as={Button}
                variant="ghost"
                color={navLinkColor}
                _hover={{ bg: navLinkHoverBg, color: navLinkHoverColor }}
                _active={{ bg: navLinkHoverBg }} // Keep consistent active style
                size="sm"
                mr={2}
                rightIcon={<ChevronDownIcon color={navLinkColor} />}
            >
                Market
            </MenuButton>
            <MenuList bg={menuBg} borderColor={menuBorderColor} color={navLinkColor}>
                <MenuItem
                    icon={<Icon as={FaNewspaper} color={menuItemIconColor} />}
                    onClick={() => navigate('/market-news')}
                    _hover={{bg: menuItemHoverBg, color: navLinkHoverColor}}
                    bg={menuBg} // Ensure consistent bg
                >
                    Latest News
                </MenuItem>
                <MenuItem
                    icon={<Icon as={FaChartLine} color={menuItemIconColor} />}
                    onClick={() => navigate('/market-chart')}
                     _hover={{bg: menuItemHoverBg, color: navLinkHoverColor}}
                    bg={menuBg} // Ensure consistent bg
                >
                    Trend Chart
                </MenuItem>
            </MenuList>
        </Menu>

        <NavButton onClick={() => navigate("/dashboard")}> Dashboard </NavButton>
        <NavButton onClick={() => navigate("/portfolio")}> Portfolio </NavButton>
        <NavButton onClick={() => navigate("/watchlist")}> Watchlist </NavButton>
        <NavButton onClick={() => navigate("/stock-history")}> History </NavButton>

        {/* Logout Button */}
        <Button
            leftIcon={<Icon as={FaSignOutAlt}/>}
            colorScheme="red" // Red for logout is conventional
            variant="solid" // Make it stand out
            size="sm"
            onClick={handleLogout}
            ml={2} // Added margin-left
        >
            Logout
        </Button>
      </Flex>
    </Box>
  );
}

export default Navbar;