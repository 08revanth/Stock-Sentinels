// src/pages/LandingPage.jsx
import React from 'react';
import {
    Box, Button, Heading, Text, VStack, Center, Icon,
    Flex, useColorModeValue, HStack
    // REMOVED: keyframes (as it's not a direct export)
} from '@chakra-ui/react';
import {
    FaChartLine, FaShieldAlt, FaSearchDollar, FaSignInAlt, FaUserPlus,
    FaNewspaper
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Motion-enabled Chakra components
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);
const MotionIcon = motion(Icon); // Create a motion-enabled Icon

function LandingPage() {
  const navigate = useNavigate();

  // Color definitions
  const bgColor = "gray.900";
  const accentColor1 = "purple.400";
  const accentColor2 = "teal.300";
  const textColorPrimary = "whiteAlpha.900";
  const textColorSecondary = "gray.400";
  const buttonTextColor = "white";

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Framer Motion variant for the floating icon
  const iconFloatVariant = {
    float: {
      y: [0, -10, 0], // Keyframes: start, up, back to start
      transition: {
        duration: 3,
        repeat: Infinity, // Loop forever
        ease: "easeInOut"
      }
    }
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      bg={bgColor}
      minH="100vh"
      color={textColorPrimary}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={6}
      overflow="hidden"
    >
      <Box
        position="absolute" top="0" left="0" right="0" bottom="0"
        bgGradient={`radial(circle at 50% 100%, ${accentColor1} -150%, ${bgColor} 70%)`}
        opacity={0.2} zIndex={0}
      />

      <VStack spacing={6} zIndex={1} maxW="container.md">
        {/* Apply float animation directly using framer-motion */}
        <MotionIcon
          as={FaChartLine}
          w={20} h={20}
          color={accentColor2}
          variants={iconFloatVariant} // Use variants
          animate="float"             // Trigger the 'float' animation
        />

        <MotionHeading
          variants={itemVariants} as="h1"
          fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold" color={textColorPrimary} letterSpacing="tight"
        >
          Welcome to <Text as="span" color={accentColor2}>Stock Sentinel</Text>
        </MotionHeading>

        <MotionText
          variants={itemVariants} fontSize={{ base: "lg", md: "xl" }} color={textColorSecondary} maxW="xl"
        >
          Navigate your financial future. Track, analyze, and conquer the market with unparalleled clarity and precision.
        </MotionText>

        <MotionBox variants={itemVariants} w="full">
            <HStack spacing={{base:4, md:8}} mt={8} justifyContent="center" wrap="wrap">
                <VStack spacing={1}>
                    <Icon as={FaShieldAlt} w={8} h={8} color={accentColor2} />
                    <Text fontSize="sm" fontWeight="medium">Secure Tracking</Text>
                </VStack>
                <VStack spacing={1}>
                    <Icon as={FaSearchDollar} w={8} h={8} color={accentColor2} />
                    <Text fontSize="sm" fontWeight="medium">Market Insights</Text>
                </VStack>
                 <VStack spacing={1}>
                    <Icon as={FaNewspaper} w={8} h={8} color={accentColor2} />
                    <Text fontSize="sm" fontWeight="medium">Stay Informed</Text>
                </VStack>
            </HStack>
        </MotionBox>

        <MotionBox variants={itemVariants} mt={10}>
          <HStack spacing={5}>
            <MotionButton
              variants={itemVariants} leftIcon={<FaUserPlus />}
              bgGradient={`linear(to-r, ${accentColor1}, ${accentColor2})`}
              color={buttonTextColor} size="lg" px={8}
              _hover={{ bgGradient: `linear(to-r, ${accentColor2}, ${accentColor1})`, transform: "translateY(-2px)", boxShadow: "lg" }}
              _active={{transform: "translateY(1px)"}}
              onClick={() => navigate('/signup')} boxShadow="md"
            >
              Get Started
            </MotionButton>
            <MotionButton
              variants={itemVariants} leftIcon={<FaSignInAlt />}
              variant="outline" borderColor={accentColor2} color={accentColor2}
              size="lg" px={8}
              _hover={{ bg: `${accentColor2}20` , borderColor: accentColor1 }}
              onClick={() => navigate('/login')}
            >
              Login
            </MotionButton>
          </HStack>
        </MotionBox>
      </VStack>

      <Text position="absolute" bottom={6} fontSize="xs" color="gray.500" zIndex={1}>
        © {new Date().getFullYear()} Stock Sentinel. Simplified Investing.
      </Text>
    </MotionBox>
  );
}

export default LandingPage;