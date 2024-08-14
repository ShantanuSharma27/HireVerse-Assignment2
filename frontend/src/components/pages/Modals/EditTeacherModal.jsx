import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';

const EditTeacherModal = ({ isOpen, onClose, teacher, setTeachers, teachers }) => {
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const toast = useToast();

  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { token } = userInfo;

      const updatedTeacher = {
        ...teacher,
        name,
        email,
      };

      const response = await axios.put(`/api/users/teachers/${teacher._id}`, updatedTeacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the teachers array
      const updatedTeachers = teachers.map((t) =>
        t._id === teacher._id ? response.data : t
      );

      setTeachers(updatedTeachers);
      toast({
        title: 'Teacher updated.',
        description: 'The teacher has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast({
        title: 'Error.',
        description: 'There was an error updating the teacher.',
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
        <ModalHeader>Edit Teacher</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTeacherModal;
