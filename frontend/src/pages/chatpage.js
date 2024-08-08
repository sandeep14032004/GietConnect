import React from "react";
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <Box
            flex="1"
            mr="5px"
            bg="rgba(255, 255, 255, 0.8)"
            borderRadius="lg"
            p="10px"
          >
            <MyChats fetchAgain={fetchAgain} />
          </Box>
        )}
        {user && (
          <Box
            flex="3"
            ml="5px"
            bg="rgba(255, 255, 255, 0.8)"
            borderRadius="lg"
            p="10px"
          >
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
