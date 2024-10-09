import { Box, keyframes } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const gradientAnimation = keyframes`
  0% { background-color: #e4ede6; }
  25% { background-color: #ebede4; }  
  50% { background-color: #e4eaed; }  
  75% { background-color: #e5e4ed; }  
  100% { background-color: #ebe4ed; } 
`;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={isMobile ? 3 : 0}
      pt={2}
      pb={2}
      bg="#e4ede6"
      w={{ base: "100%", md: "70%" }}
      border="1px solid"
      borderColor="#b0a8a6"
      animation={`${gradientAnimation} 10s infinite alternate`}
      transition="background-color 0.3s ease"
      _hover={{ bg: "#ddf0e1" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
