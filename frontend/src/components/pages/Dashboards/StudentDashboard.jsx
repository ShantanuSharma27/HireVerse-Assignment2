import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  TableCaption,
  Select,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditStudentModal from '../Modals/EditStudentModal';

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [studentsByClassroom, setStudentsByClassroom] = useState({});
  const [authorizedClassroomId, setAuthorizedClassroomId] = useState('');
  const [userRole, setUserRole] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchClassroomsAndStudents = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) throw new Error('User info not found');

        const { token, user } = JSON.parse(userInfo);
        const classroomId = user.classroom; // Extract classroom ID from the user object
        const role = user.role; // Extract role from the user object

        console.log('Authorized Classroom ID:', classroomId); // Debugging line
        console.log('User Role:', role); // Debugging line

        setAuthorizedClassroomId(classroomId);
        setUserRole(role);

        // Fetch students
        const studentsResponse = await axios.get('/api/users/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch classrooms
        const classroomsResponse = await axios.get('/api/classrooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Initialize students by classroom
        const groupedStudents = studentsResponse.data.reduce((acc, student) => {
          const studentClassroomId = student.classroom; // Assumes `classroom` is an ID
          if (!acc[studentClassroomId]) {
            acc[studentClassroomId] = [];
          }
          acc[studentClassroomId].push(student);
          return acc;
        }, {});

        setStudents(studentsResponse.data);
        setClassrooms(classroomsResponse.data);
        setStudentsByClassroom(groupedStudents);

        // If the role is student, set the selected classroom to the student's assigned classroom
        if (role === 'student') {
          setSelectedClassroom(classroomId);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data.',
          description: 'There was an error fetching students or classrooms data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchClassroomsAndStudents();
  }, [toast]);

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const handleDeleteClick = async (studentId) => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) throw new Error('User info not found');

      const { token } = JSON.parse(userInfo);

      await axios.delete(`/api/users/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents((prevStudents) => {
        const updatedStudents = prevStudents.filter((student) => student._id !== studentId);
        const updatedStudentsByClassroom = { ...studentsByClassroom };

        // Update the studentsByClassroom state
        if (selectedClassroom && updatedStudentsByClassroom[selectedClassroom]) {
          updatedStudentsByClassroom[selectedClassroom] = updatedStudentsByClassroom[selectedClassroom].filter((student) => student._id !== studentId);
        }

        setStudents(updatedStudents);
        setStudentsByClassroom(updatedStudentsByClassroom);

        return updatedStudents;
      });

      toast({
        title: 'Student deleted.',
        description: 'The student has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error.',
        description: 'There was an error deleting the student.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const canEditOrDelete = (student) => {
    if (userRole === 'principal') {
      return true; // Principal can edit and delete all students in the selected classroom
    }
    if (userRole === 'teacher') {
      return student.classroom === authorizedClassroomId; // Teacher can edit and delete only if student is in their assigned classroom
    }
    return false; // Students can't edit or delete
  };

  return (
    <Box p={4}>
      {userRole !== 'student' && (
        <FormControl id="classroom" isRequired>
          <FormLabel>Classroom</FormLabel>
          <Select
            value={selectedClassroom}
            onChange={(e) => {
              setSelectedClassroom(e.target.value);
              setSelectedStudent(null); // Reset the student selection
            }}
            placeholder="Select Classroom"
            size="lg" // Ensures a larger size for better appearance
          >
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.name}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedClassroom && (
        <Box mt={4}>
          <Table variant="striped" colorScheme="teal">
            <TableCaption>List of Students in Classroom</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {studentsByClassroom[selectedClassroom]?.map((student) => (
                <Tr key={student._id}>
                  <Td>{student.name}</Td>
                  <Td>{student.email}</Td>
                  <Td>
                    {canEditOrDelete(student) && (
                      <>
                        <Button
                          leftIcon={<EditIcon />}
                          onClick={() => handleEditClick(student)}
                          colorScheme="blue"
                          mr={2}
                        >
                          Edit
                        </Button>
                        <Button
                          leftIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(student._id)}
                          colorScheme="red"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {selectedStudent && (
        <EditStudentModal
          isOpen={isOpen}
          onClose={onClose}
          student={selectedStudent}
          setStudents={setStudents}
          students={students}
        />
      )}
    </Box>
  );
};

export default StudentDashboard;
