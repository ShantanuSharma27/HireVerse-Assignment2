import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const EditStudentModal = ({ isOpen, onClose, student, setStudents, students }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) throw new Error('User info not found');

      const { token } = JSON.parse(userInfo);

      await axios.put(
        `/api/users/students/${student._id}`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(students.map((s) =>
        s._id === student._id ? { ...s, name, email } : s
      ));

      toast({
        title: 'Student updated.',
        description: 'The student details have been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error.',
        description: 'There was an error updating the student.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Student</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl mb="4">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student's name"
                required
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Student's email"
                required
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStudentModal;
