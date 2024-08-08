import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        textAlign="center"
        justifyContent="center"
        p={3}
        bgGradient="linear(to-r, blue.500, blue.100)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="lg"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          GietConnect
        </Text>
      </Box>
      <Box
        bg="rgba(255, 255, 255, 0.5)"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="lg"
      >
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
