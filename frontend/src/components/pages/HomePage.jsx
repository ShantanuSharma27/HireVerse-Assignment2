import React, { useState } from 'react';
import { Container, Box, Text, Button, VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";

const HomePage = () => {
  const [userRole, setUserRole] = useState(null);

  const handleUserChoice = (role) => {
    setUserRole(role);
  };

  return (
    <Container
      maxW="xl"
      h="100vh"
      d="flex"
      alignItems="center"
      justifyContent="center"
      centerContent
    >
      <Box
        p={4}
        bg="rgba(255, 255, 255, 0.5)"
        w="80%"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="md"
      >
        <Text
          textAlign="center"
          fontSize="4xl"
          fontFamily="Work Sans"
          color="black"
          mb={6}
        >
          Classroom-of-the-Elite
        </Text>
        <Box
          bg="rgba(255, 255, 255, 0.7)"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          boxShadow="md"
        >
          {!userRole ? (
            <VStack spacing={4}>
              <Text fontSize="2xl" mb={4}>Who are you?</Text>
              <Button colorScheme="purple" width="100%" onClick={() => handleUserChoice('principal')}>
                Principal
              </Button>
              <Button colorScheme="purple" width="100%" onClick={() => handleUserChoice('teacher')}>
                Teacher
              </Button>
              <Button colorScheme="purple" width="100%" onClick={() => handleUserChoice('student')}>
                Student
              </Button>
            </VStack>
          ) : userRole === 'student' ? (
            <Login />
          ) : (
            <Tabs variant="soft-rounded" colorScheme="purple">
              <TabList mb="1em" justifyContent="center">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup availableRoles={userRole === 'principal' ? ['teacher', 'student'] : ['student']} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
