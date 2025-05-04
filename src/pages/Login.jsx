import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Alert as ChakraAlert,
  AlertIcon,
  AlertDescription,
  Center
} from '@chakra-ui/react';
import { loginUser } from '../services/api'; // Uses CORRECTED api.js

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginData = { email, password };
      console.log("Attempting login with:", loginData);

      const responseData = await loginUser(loginData);
      console.log("Login successful, received data:", responseData);

      // --- SUCCESS PATH ---
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token);

        toast({
          title: 'Login Successful',
          description: `Welcome! Redirecting...`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        // --- NAVIGATE TO HOME PAGE ---
        navigate('/home'); // Changed from /dashboard
        // --- END CHANGE ---

      } else {
        console.error("Login response missing token:", responseData);
        setError('Login succeeded but received invalid token data.');
        setIsLoading(false);
      }

    } catch (err) {
      setIsLoading(false);
      console.error('Login API call failed:', err);
      let errorMessage = 'Login failed. Please check your credentials or try again.';
      if (err.response) {
         errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
         errorMessage = 'Network error: Could not connect to the server.';
      } else {
         errorMessage = `An unexpected error occurred: ${err.message}`;
      }
      setError(errorMessage);
      toast({
         title: 'Login Failed',
         description: errorMessage,
         status: 'error',
         duration: 5000,
         isClosable: true,
      });
    }
  };

  // --- JSX (Same UI) ---
  return (
    <Center minHeight="80vh" bg="gray.900" color="white">
        <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.800" borderColor="gray.700" w="full">
            <VStack spacing={4}>
                <Heading mb={4} color="teal.300">Login</Heading>
                {error && (<ChakraAlert status="error" borderRadius="md"><AlertIcon /><AlertDescription>{error}</AlertDescription></ChakraAlert>)}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" bg="gray.700" borderColor="gray.600" _hover={{ borderColor: 'gray.500' }} _focus={{ borderColor: 'teal.300', boxShadow: '0 0 0 1px teal.300' }} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" bg="gray.700" borderColor="gray.600" _hover={{ borderColor: 'gray.500' }} _focus={{ borderColor: 'teal.300', boxShadow: '0 0 0 1px teal.300' }} />
                        </FormControl>
                        <Button type="submit" colorScheme="teal" width="full" isLoading={isLoading} mt={4}>Login</Button>
                    </VStack>
                </form>
            </VStack>
        </Box>
    </Center>
  );
};

export default Login;