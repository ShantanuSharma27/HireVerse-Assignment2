import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast, Select } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ availableRoles }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(availableRoles[0]); // Default to first available role
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState([]); // State to hold classroom data
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch classrooms on component mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('/api/classrooms'); // Adjust the endpoint as needed
        setClassrooms(response.data);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        toast({
          title: "Error Fetching Classrooms",
          description: "Failed to load classrooms.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    fetchClassrooms();
  }, []);

  const submitHandler = async () => {
    console.log("Submit Handler Called");
    setLoading(true);
    if (!name || !email || !password || !role || (role === 'student' && !selectedClassroom)) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/register",
        { name, email, password, role, classroom: role === 'student' ? selectedClassroom : undefined },
        config
      );

      console.log("Registration successful:", data);

      toast({
        title: "Registration Successful Please Login!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole(availableRoles[0]);
      setSelectedClassroom('');
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);

      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </FormControl>
      <FormControl id="role" isRequired>
        <FormLabel>Role</FormLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          {availableRoles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </option>
          ))}
        </Select>
      </FormControl>
      {role === 'student' && (
        <FormControl id="classroom" isRequired>
          <FormLabel>Classroom</FormLabel>
          <Select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
          >
            <option value="">Select Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.name}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
      <Button colorScheme="blue" width="100%" onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
