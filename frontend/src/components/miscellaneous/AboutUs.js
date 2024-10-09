import { Box, Text, Avatar, SimpleGrid } from "@chakra-ui/react";

const members = [
  {
    name: "Member 1",
    email: "member1@example.com",
    contactNo: "+1234567890",
    college: "GIET University",
    photo: "messi.jpg",
  },
  {
    name: "Member 2",
    email: "member2@example.com",
    contactNo: "+0987654321",
    college: "GIET University",
    photo: "virat kohli.jpeg",
  },
];

const AboutUs = () => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        About Us
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {members.map((member, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            boxShadow="md"
            textAlign="center" // Center the content
          >
            <Avatar size="lg" name={member.name} src={member.photo} mb={2} />
            <Text fontWeight="bold" fontSize="xl">
              {member.name}
            </Text>
            <Text>Email: {member.email}</Text>
            <Text>Contact No: {member.contactNo}</Text>
            <Text>College: {member.college}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AboutUs;
