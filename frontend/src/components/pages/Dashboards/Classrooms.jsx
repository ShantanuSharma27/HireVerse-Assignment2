import React, { useState, useEffect } from 'react';
import { Box, Table, Tbody, Td, Th, Thead, Tr, useToast, TableCaption, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [assignedClassroom, setAssignedClassroom] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserRole = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { role, _id } = JSON.parse(userInfo);
        setUserRole(role);
        return _id; // Return user ID if needed for fetching assigned classroom
      }
      return null;
    };

    const fetchClassrooms = async () => {
      try {
        const userId = fetchUserRole();
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) throw new Error('User info not found');
        const { token } = JSON.parse(userInfo);

        const response = await axios.get('/api/classrooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        // Filter classrooms based on user role
        if (userRole === 'teacher' && userId) {
          const teacherAssignedClassroom = data.find(classroom =>
            classroom.students.includes(userId)
          );
          setAssignedClassroom(teacherAssignedClassroom);
        } else {
          setClassrooms(data);
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        toast({
          title: 'Error fetching classrooms.',
          description: 'There was an error fetching classroom data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchClassrooms();
  }, [toast, userRole]);

  return (
    <Box p={4}>
      <Table variant="striped" colorScheme="teal">
        <TableCaption>
          {userRole === 'teacher' ? 'Assigned Classroom' : 'List of Classrooms'}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Days</Th>
            <Th>Timetable</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(userRole === 'teacher' && assignedClassroom ? [assignedClassroom] : classrooms).map(classroom => (
            <Tr key={classroom._id}>
              <Td>{classroom.name}</Td>
              <Td>{classroom.schedule.startTime}</Td>
              <Td>{classroom.schedule.endTime}</Td>
              <Td>
                <VStack align="start" spacing={1}>
                  {classroom.schedule.days.length > 0
                    ? classroom.schedule.days.map((day, index) => (
                        <Text key={index}>{day}</Text>
                      ))
                    : 'No days assigned'}
                </VStack>
              </Td>
              <Td>
                <VStack align="start" spacing={1}>
                  {classroom.timetable.length > 0
                    ? classroom.timetable.map((entry) => (
                        <Box
                          key={entry._id}
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="gray.50"
                          shadow="md"
                        >
                          <Text fontWeight="bold">Subject:</Text>
                          <Text>{entry.subject}</Text>
                          <Text fontWeight="bold">Time:</Text>
                          <Text>
                            {entry.startTime} - {entry.endTime}
                          </Text>
                        </Box>
                      ))
                    : 'No timetable entries'}
                </VStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Classroom;
