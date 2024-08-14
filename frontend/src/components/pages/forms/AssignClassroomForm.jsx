import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Select, Button, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';

const AssignTeacherForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [assignedTeachers, setAssignedTeachers] = useState(new Set()); // Track assigned teachers
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          throw new Error('User is not authenticated');
        }

        const { token } = JSON.parse(userInfo);
        console.log('Token:', token);

        if (token) {
          const teacherResponse = await axios.get('/api/users/teachers', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Teachers data:', teacherResponse.data);
          setTeachers(teacherResponse.data);
          
          const classroomResponse = await axios.get('/api/classrooms', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Classrooms data:', classroomResponse.data);
          setClassrooms(classroomResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        toast({
          title: 'Error fetching data.',
          description: 'There was an error fetching teachers or classrooms.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      fetchData();
    } else {
      console.log('No userInfo found in localStorage.');
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacher = teachers.find(t => t.name === selectedTeacher);
    const teacherId = teacher ? teacher._id : '';

    console.log('Selected Teacher:', selectedTeacher);
    console.log('Selected Teacher ID:', teacherId);
    console.log('Selected Classroom:', selectedClassroom);

    try {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        throw new Error('User is not authenticated');
      }

      const { token } = JSON.parse(userInfo);
      console.log('Submitting data with token:', token);

      await axios.post(
        '/api/classrooms/assign-teacher',
        {
          teacherId,
          classroomId: selectedClassroom,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Teacher successfully assigned.');

      toast({
        title: 'Teacher assigned.',
        description: 'The teacher has been successfully assigned to the classroom.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Update assigned teachers and reset the form
      setAssignedTeachers(prev => new Set(prev).add(teacherId));
      setSelectedTeacher('');
      setSelectedClassroom('');
    } catch (error) {
      console.error('Error assigning teacher:', error.response ? error.response.data : error.message);
      toast({
        title: 'Error.',
        description: 'There was an error assigning the teacher.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Filter out teachers that are already assigned
  const availableTeachers = teachers.filter(teacher => !assignedTeachers.has(teacher._id));

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl mb="4">
          <FormLabel>Select Teacher</FormLabel>
          <Select
            placeholder="Select Teacher"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            required
          >
            {availableTeachers.map(teacher => (
              <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Select Classroom</FormLabel>
          <Select
            placeholder="Select Classroom"
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            required
          >
            {classrooms.map(classroom => (
              <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
            ))}
          </Select>
        </FormControl>

        <Button colorScheme="purple" type="submit">
          Assign Teacher
        </Button>
      </VStack>
    </form>
  );
};

export default AssignTeacherForm;
