import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast, TableCaption, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditTeacherModal from '../Modals/EditTeacherModal';

const TeacherDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const toast = useToast();
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) throw new Error('User info not found');

        const { token, user } = JSON.parse(userInfo);
        setUserRole(user.role);
        setCurrentUserId(user._id);

        let response;
        if (user.role === 'teacher') {
          // Fetch the current teacher's details
          response = await axios.get(`/api/users/teachers/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTeachers([response.data]);
        } else {
          // Fetch all teachers if the role is not 'teacher'
          response = await axios.get('/api/users/teachers', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTeachers(response.data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: 'Error fetching teachers.',
          description: 'There was an error fetching teacher data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchTeachers();
  }, [toast]);

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    onOpen();
  };

  const handleDeleteClick = async (teacherId) => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) throw new Error('User info not found');

      const { token } = JSON.parse(userInfo);

      await axios.delete(`/api/users/teachers/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      toast({
        title: 'Teacher deleted.',
        description: 'The teacher has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: 'Error.',
        description: 'There was an error deleting the teacher.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      {userRole === 'teacher' ? (
        <Box>
          <Heading mb={4}>Your Profile</Heading>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teachers.map((teacher) => (
                <Tr key={teacher._id}>
                  <Td>{teacher.name}</Td>
                  <Td>{teacher.email}</Td>
                  <Td>
                    <Button
                      leftIcon={<EditIcon />}
                      onClick={() => handleEditClick(teacher)}
                      colorScheme="blue"
                      mr={2}
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box>
          <Table variant="striped" colorScheme="teal">
            <TableCaption>List of Teachers</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teachers.map((teacher) => (
                <Tr key={teacher._id}>
                  <Td>{teacher.name}</Td>
                  <Td>{teacher.email}</Td>
                  <Td>
                    <Button
                      leftIcon={<EditIcon />}
                      onClick={() => handleEditClick(teacher)}
                      colorScheme="blue"
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(teacher._id)}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {selectedTeacher && (
        <EditTeacherModal
          isOpen={isOpen}
          onClose={onClose}
          teacher={selectedTeacher}
          setTeachers={setTeachers}
          teachers={teachers}
        />
      )}
    </Box>
  );
};

export default TeacherDashboard;
