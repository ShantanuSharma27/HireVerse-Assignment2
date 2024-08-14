import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
const AddTeacherForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users/register", {
        name,
        email,
        password,
        role: "teacher" // Automatically set role to student
      });

      // Handle success
      toast({
        title: "Teacher added.",
        description: "The teacher has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      // Log the error details
      console.error("Error adding Teacher:", error);

      // Handle error
      toast({
        title: "Error.",
        description: error.response?.data?.message || "There was an error adding the teacher.",
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
          placeholder="Enter teacher name"
          required
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter teacher email"
          required
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
      </FormControl>
      <Button colorScheme="blue" type="submit">
        Add Teacher
      </Button>
    </form>
  );
};

export default AddTeacherForm;
