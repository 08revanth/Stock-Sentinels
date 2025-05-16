// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Added RouterLink
import {
  Box, Heading, Input, Button, VStack, FormControl, FormLabel,
  useToast, Alert as ChakraAlert, AlertIcon, AlertDescription,
  Flex, Icon, InputGroup, InputLeftElement, InputRightElement, // Added more form elements
  Text, // Added Text
} from '@chakra-ui/react';
import { loginUser } from '../services/api';
import Footer from '../components/Footer';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons
import { motion } from 'framer-motion'; // For animations

// Framer Motion wrapped components
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionFormControl = motion(FormControl);
const MotionButton = motion(Button);
const MotionText = motion(Text);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Dark Theme Colors (assuming overall page bg='gray.900' is from global theme or PageWrapper)
  const cardBgColor = 'gray.800';
  const headingColor = 'brand.300'; // Your teal
  const inputBg = 'gray.700';
  const inputBorder = 'gray.600';
  const inputFocusBorder = 'brand.400'; // Your teal for focus
  const formLabelColor = 'gray.300';
  const errorColor = 'red.300';
  // Page text color 'whiteAlpha.900' should be inherited

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delayChildren:0.1, staggerChildren:0.05 } }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const loginData = { email, password };
      const responseData = await loginUser(loginData);
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token);
        // localStorage.setItem('user', JSON.stringify(responseData.user)); // Uncomment if backend sends user obj
        toast({ title: 'Login Successful!', description: `Welcome back! Redirecting...`, status: 'success', duration: 2500, isClosable: true });
        navigate('/home'); // Navigate to home after successful login
      } else {
        setError('Login successful, but essential data (token) was missing in the server response.');
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      const specificError = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(specificError);
      toast({ title: 'Login Failed', description: specificError, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Flex direction="column" minH="100vh"> {/* bg and color should come from global theme in index.js */}
      <Flex
        flex="1"
        alignItems="center"
        justifyContent="center"
        py={{base: 8, md: 12}}
        px={4}
      >
        <MotionBox
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          p={{ base: 6, md: 10 }} // Responsive padding
          maxW="420px" // Slightly increased max width
          w="full"
          bg={cardBgColor}
          boxShadow="xl"
          borderRadius="xl" // More rounded
          border="1px solid"
          borderColor={inputBorder} // Use defined inputBorder for card
        >
          <VStack spacing={6} initial="hidden" animate="visible" variants={{visible: {transition: {staggerChildren:0.1}}}}> {/* Stagger children of this VStack */}
            <Icon as={FaSignInAlt} w={10} h={10} color={headingColor} /> {/* Login Icon */}
            <MotionHeading variants={itemVariants} mb={2} color={headingColor} size="xl" textAlign="center">
              Welcome Back!
            </MotionHeading>
            <MotionText variants={itemVariants} color="gray.400" textAlign="center" fontSize="sm" mt={-4} mb={2}>
                Sign in to continue to Stock Sentinel.
            </MotionText>

            {error && (
              <MotionBox variants={itemVariants} width="full">
                <ChakraAlert status="error" borderRadius="md" variant="subtle" bg="red.900" color="red.100">
                  <AlertIcon color="red.100"/>
                  <AlertDescription fontSize="sm">{error}</AlertDescription>
                </ChakraAlert>
              </MotionBox>
            )}

            <VStack as="form" onSubmit={handleSubmit} spacing={5} width="full"> {/* Spacing within form */}
              <MotionFormControl variants={itemVariants} isRequired id="email-login">
                <FormLabel color={formLabelColor} fontSize="sm">Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<Icon as={FaEnvelope} color="gray.500" />} />
                  <Input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    bg={inputBg} borderColor={inputBorder} pl={10} // Padding for icon
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}` }}
                    size="md" // Explicit input size
                  />
                </InputGroup>
              </MotionFormControl>

              <MotionFormControl variants={itemVariants} isRequired id="password-login">
                <FormLabel color={formLabelColor} fontSize="sm">Password</FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" children={<Icon as={FaLock} color="gray.500" />} />
                  <Input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    bg={inputBg} borderColor={inputBorder} pl={10}
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}` }}
                  />
                  <InputRightElement>
                    <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} _hover={{bg: "gray.600"}} title={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <Icon as={FaEyeSlash} color="gray.400"/> : <Icon as={FaEye} color="gray.400"/>}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </MotionFormControl>

              <MotionButton
                variants={itemVariants}
                type="submit"
                colorScheme="brand" // Uses your teal theme
                width="full"
                isLoading={isLoading}
                size="lg" // Larger button
                mt={3} // Margin top
                leftIcon={<FaSignInAlt />} // Icon on button
                _hover={{bg: "brand.600", boxShadow:"md"}}
                boxShadow="sm"
              >
                Login
              </MotionButton>
            </VStack>
            <MotionText pt={6} fontSize="sm" color="gray.400" variants={itemVariants}>
                Don't have an account?{' '}
                <Button as={RouterLink} to="/signup" variant="link" colorScheme="brand" fontWeight="semibold" size="sm">
                     Sign Up Here
                </Button>
            </MotionText>
          </VStack>
        </MotionBox>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Login;