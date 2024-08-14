import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  CheckboxGroup,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const CreateClassroomForm = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const toast = useToast();

  const handleDaysChange = (selectedDays) => {
    setDays(selectedDays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Retrieve token from local storage
const storedUserInfo = localStorage.getItem('userInfo');

// Check if storedUserInfo exists and parse it
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

// Extract the token
const token = userInfo ? userInfo.token : null;
console.log(token);
    try {
      await axios.post(
        "/api/classrooms/create",
        {
          name,
          schedule: {
            startTime,
            endTime,
            days,
          },
          timetable: [], // Initialize with an empty array if timetable is not defined
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Include token in the headers
          },
        }
      );

      // Handle success
      toast({
        title: "Classroom created.",
        description: "The classroom has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form fields
      setName("");
      setStartTime("");
      setEndTime("");
      setDays([]);
    } catch (error) {
      // Handle error
      toast({
        title: "Error.",
        description: "There was an error creating the classroom.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl mb="4">
          <FormLabel>Classroom Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter classroom name"
            required
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Start Time</FormLabel>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>End Time</FormLabel>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Days</FormLabel>
          <CheckboxGroup value={days} onChange={handleDaysChange}>
            <VStack spacing={2} align="start">
              <Checkbox value="Monday">Monday</Checkbox>
              <Checkbox value="Tuesday">Tuesday</Checkbox>
              <Checkbox value="Wednesday">Wednesday</Checkbox>
              <Checkbox value="Thursday">Thursday</Checkbox>
              <Checkbox value="Friday">Friday</Checkbox>
              <Checkbox value="Saturday">Saturday</Checkbox>
              <Checkbox value="Sunday">Sunday</Checkbox>
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <Button colorScheme="purple" type="submit">
          Create Classroom
        </Button>
      </VStack>
    </form>
  );
};

export default CreateClassroomForm;
