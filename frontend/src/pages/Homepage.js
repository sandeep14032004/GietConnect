import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container
      maxW="xl"
      centerContent
      p={5}
      borderRadius="xl"
      boxShadow="xl"
      mt={10}
      bgGradient="linear(to-b, rgba(255,255,255,0.05), rgba(255,255,255,0.05))"
    >
      <Box
        d="flex"
        textAlign="center"
        justifyContent="center"
        p={4}
        bgGradient="linear(to-r, rgba(0, 128, 128, 0.2), rgba(0, 0, 255, 0.2))"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="dark-lg"
      >
        <Text
          fontSize="3xl"
          fontFamily="Pacifico, cursive"
          color="white"
          textShadow="2px 2px 4px rgba(0,0,0,0.7)"
        >
          GietConnect
        </Text>
      </Box>
      <Box
        bg="rgba(255, 255, 255, 0.15)"
        w="100%"
        p={6}
        borderRadius="xl"
        borderWidth="1px"
        boxShadow="lg"
        backdropFilter="blur(10px)"
      >
        <Tabs variant="soft-rounded" colorScheme="blue" align="center" isFitted>
          <TabList mb="1.5em">
            <Tab width="50%" fontWeight="bold" color="white">
              Login
            </Tab>
            <Tab width="50%" fontWeight="bold" color="white">
              Sign Up
            </Tab>
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
