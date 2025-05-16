import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data)).catch(() => alert("Failed to fetch users"));
  }, []);

  return (
    <Box>
      <Heading mb={4}>Admin Panel</Heading>
      <VStack align="start" spacing={4}>
        {users.map((user, i) => (
          <Box key={i} bg="gray.800" p={4} rounded="md">
            <Text>ID: {user.id}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Username: {user.username}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
export default AdminPanel;
