import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Select
} from "@chakra-ui/react";

const AddStudentForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classroom, setClassroom] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) throw new Error("User info not found");

        const { token } = JSON.parse(userInfo);

        // Fetch classrooms
        const response = await axios.get("/api/classrooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassrooms(response.data);

      } catch (error) {
        console.error("Error fetching classrooms:", error);
        toast({
          title: "Error fetching classrooms.",
          description: "There was an error fetching classrooms data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchClassrooms();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) throw new Error('User info not found');

      const { token } = JSON.parse(userInfo);

      const response = await axios.post(
        "/api/users/register",
        {
          name,
          email,
          password,
          role: "student",
          classroom,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      toast({
        title: "Student added.",
        description: "The student has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setClassroom("");

    } catch (error) {
      // Log the error details
      console.error("Error adding student:", error);

      // Handle error
      toast({
        title: "Error.",
        description: error.response?.data?.message || "There was an error adding the student.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb="4">
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          required
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter student email"
          required
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter student password"
          required
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Classroom</FormLabel>
        <Select
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
          placeholder="Select Classroom"
          required
        >
          {classrooms.map((classroom) => (
            <option key={classroom._id} value={classroom._id}>
              {classroom.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button colorScheme="blue" type="submit">
        Add Student
      </Button>
    </form>
  );
};

export default AddStudentForm;
