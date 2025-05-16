// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Heading, Input, Button, VStack, FormControl, FormLabel, FormErrorMessage,
  useToast, Icon, InputGroup, InputLeftElement, InputRightElement, Text,
  Flex
} from '@chakra-ui/react';
import { FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { signupUser } from '../services/api';
import Footer from '../components/Footer'; // <<<--- CORRECTED IMPORT PATH
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionButton = motion(Button);
const MotionFormControl = motion(FormControl);
const MotionText = motion(Text);

function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const pageBg = "gray.900";
  const pageTextColor = "whiteAlpha.900";
  const cardBg = "gray.800";
  const accentColor = "teal.300";
  const inputBg = "gray.700";
  const inputBorder = "gray.600";
  const inputFocusBorder = "teal.400";
  const formLabelColor = "gray.300";
  const errorColor = "red.300";

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, delayChildren: 0.1, staggerChildren: 0.05 } }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    else if (form.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email address is invalid.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validateForm()) return; setIsLoading(true);
    try {
      const { username, email, password } = form;
      const response = await signupUser({ username, email, password });
      toast({ title: 'Signup Successful!', description: response.message || "You can now log in.", status: 'success', duration: 5000, isClosable: true });
      navigate('/login');
    } catch (err) {
      const backendError = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
      setErrors(prev => ({ ...prev, api: backendError }));
      toast({ title: 'Signup Failed', description: backendError, status: 'error', duration: 5000, isClosable: true });
    } finally { setIsLoading(false); }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name] || errors.api) { setErrors(prev => ({ ...prev, [e.target.name]: null, api: null })); }
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={pageBg}
      color={pageTextColor}
    >
      <Flex
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        py={{base: 8, md: 12}}
        px={4}
      >
        <MotionBox
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          p={{base: 6, md: 8}}
          maxW="450px"
          w="full"
          bg={cardBg}
          boxShadow="2xl"
          borderRadius="xl"
          border="1px solid"
          borderColor={inputBorder}
        >
          <MotionVStack spacing={5} variants={itemVariants} initial="hidden" animate="visible">
            <Icon as={FaUserPlus} w={10} h={10} color={accentColor} mb={2}/>
            <MotionHeading as="h1" size="lg" color={accentColor} textAlign="center" variants={itemVariants}>
              Create Your Account
            </MotionHeading>

            {errors.api && (
              <Text color={errorColor} fontSize="sm" textAlign="center" mt={2}>{errors.api}</Text>
            )}

            <VStack as="form" onSubmit={handleSubmit} spacing={4} width="full">
              <MotionFormControl isInvalid={!!errors.username} variants={itemVariants}>
                <FormLabel color={formLabelColor} htmlFor="username-signup">Username</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaUserPlus} color="gray.400" />} />
                  <Input id="username-signup" name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} bg={inputBg} borderColor={inputBorder} pl={10} _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}`}} />
                </InputGroup>
                {errors.username && <FormErrorMessage fontSize="xs" color={errorColor}>{errors.username}</FormErrorMessage>}
              </MotionFormControl>

              <MotionFormControl isInvalid={!!errors.email} variants={itemVariants}>
                <FormLabel color={formLabelColor} htmlFor="email-signup">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaEnvelope} color="gray.400" />} />
                  <Input id="email-signup" name="email" type="email" placeholder="your.email@example.com" value={form.email} onChange={handleChange} pl={10} bg={inputBg} borderColor={inputBorder} _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}`}} />
                </InputGroup>
                {errors.email && <FormErrorMessage fontSize="xs" color={errorColor}>{errors.email}</FormErrorMessage>}
              </MotionFormControl>

              <MotionFormControl isInvalid={!!errors.password} variants={itemVariants}>
                <FormLabel color={formLabelColor} htmlFor="password-signup">Password</FormLabel>
                <InputGroup size="md">
                  <InputLeftElement children={<Icon as={FaLock} color="gray.400" />} />
                  <Input id="password-signup" name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} pl={10} bg={inputBg} borderColor={inputBorder} _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}`}} />
                  <InputRightElement>
                    <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} _hover={{bg:"gray.600"}} color="gray.400">
                        {showPassword ? <Icon as={FaEyeSlash}/> : <Icon as={FaEye}/>}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <FormErrorMessage fontSize="xs" color={errorColor}>{errors.password}</FormErrorMessage>}
              </MotionFormControl>

              <MotionFormControl isInvalid={!!errors.confirmPassword} variants={itemVariants}>
                <FormLabel color={formLabelColor} htmlFor="confirmPassword-signup">Confirm Password</FormLabel>
                <InputGroup size="md">
                  <InputLeftElement children={<Icon as={FaLock} color="gray.400" />} />
                  <Input id="confirmPassword-signup" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} pl={10} bg={inputBg} borderColor={inputBorder} _focus={{ borderColor: inputFocusBorder, boxShadow: `0 0 0 1px ${inputFocusBorder}`}} />
                  <InputRightElement>
                    <Button variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} _hover={{bg:"gray.600"}} color="gray.400">
                        {showConfirmPassword ? <Icon as={FaEyeSlash}/> : <Icon as={FaEye}/>}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.confirmPassword && <FormErrorMessage fontSize="xs" color={errorColor}>{errors.confirmPassword}</FormErrorMessage>}
              </MotionFormControl>

              <MotionButton
                variants={itemVariants} type="submit" colorScheme="brand"
                width="full" size="md" mt={3} isLoading={isLoading}
                _hover={{ bg: "brand.600" }}
              >
                Create Account
              </MotionButton>
            </VStack>

            <MotionText pt={5} fontSize="sm" color="gray.400" variants={itemVariants}>
              Already have an account?{' '}
              <Button as={RouterLink} to="/login" variant="link" colorScheme="brand" fontWeight="medium" size="sm">
                Login Here
              </Button>
            </MotionText>
          </MotionVStack>
        </MotionBox>
      </Flex>
      <Footer />
    </Flex>
  );
}
export default SignupPage;