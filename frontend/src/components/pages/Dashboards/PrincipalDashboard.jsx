import React, { useState, useEffect } from "react";
import AddStudentForm from "../forms/AddStudentForm";
import AddTeacherForm from "../forms/AddTeacherForm";
import CreateClassroomForm from "../forms/CreateClassroomForm";
import AssignClassroomForm from "../forms/AssignClassroomForm";
import TeachersStudentsTable from "../DashboardContent/TeachersStudentTable";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";

const PrincipalDashboard = () => {
  const [currentForm, setCurrentForm] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [principal, setPrincipal] = useState({ name: '', email: '' });

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setPrincipal({
          name: userInfo.name || 'Principal',
          email: userInfo.email || 'principal@classroom.com'
        });
      } else {
        console.warn('User info is not found in local storage.');
      }
    } catch (error) {
      console.error('Error parsing user info from local storage:', error);
    }
  }, []);

  const handleOpenForm = (formType) => {
    setCurrentForm(formType);
    onOpen();
  };

  const handleCloseForm = () => {
    setCurrentForm(null);
    onClose();
  };

  return (
    <div>
      <Box p={4} mb={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold">Principal Profile</Text>
        <Text fontSize="md">Name: {principal.name}</Text>
        <Text fontSize="md">Email: {principal.email}</Text>
      </Box>

      <VStack spacing={4} align="stretch" mb={4}>
        <Button colorScheme="purple" onClick={() => handleOpenForm('student')}>
          Add Student
        </Button>
        <Button colorScheme="purple" onClick={() => handleOpenForm('teacher')}>
          Add Teacher
        </Button>
        <Button colorScheme="purple" onClick={() => handleOpenForm('classroom')}>
          Create Classroom
        </Button>
        <Button colorScheme="purple" onClick={() => handleOpenForm('assignClassroom')}>
          Assign Classroom to Teacher
        </Button>
      </VStack>
{/* 
      <section>
        <h2>Teachers and Students</h2>
        <TeachersStudentsTable type="teachers" />
        <TeachersStudentsTable type="students" />
      </section> */}

      <Modal isOpen={isOpen} onClose={handleCloseForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentForm === 'student' && 'Add New Student'}
            {currentForm === 'teacher' && 'Add New Teacher'}
            {currentForm === 'classroom' && 'Create New Classroom'}
            {currentForm === 'assignClassroom' && 'Assign Classroom to Teacher'}
          </ModalHeader>
          <ModalBody>
            {currentForm === 'student' && <AddStudentForm />}
            {currentForm === 'teacher' && <AddTeacherForm />}
            {currentForm === 'classroom' && <CreateClassroomForm />}
            {currentForm === 'assignClassroom' && <AssignClassroomForm />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleCloseForm}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PrincipalDashboard;
