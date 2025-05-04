import { Box, Button, Input, VStack, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(form);
      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={6} textAlign="center">Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" colorScheme="teal" width="full">Sign Up</Button>
        </VStack>
      </form>
    </Box>
  );
}
export default Signup;
