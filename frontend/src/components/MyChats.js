import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderWidth="1px"
      boxShadow="lg"
      transition="all 0.3s ease-in-out"
      h="100%"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "28px" }}
        fontFamily="Work Sans, sans-serif"
        fontWeight="bold"
        borderBottomWidth="2px"
        borderColor="gray.300"
        w="100%"
        mb={4}
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            display="flex"
            alignItems="center"
            fontSize={{ base: "12px", md: "13px", lg: "14px" }}
            rightIcon={<AddIcon />}
            colorScheme="teal"
            variant="solid"
            boxShadow="md"
            _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
            _active={{ bg: "teal.700", transform: "scale(1)" }}
            transition="transform 0.2s ease-in-out"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg="#F9F9F9"
        w="100%"
        h="100%"
        overflowY="auto" // Enable vertical scrolling if needed
        overflowX="hidden" // Disable horizontal scrolling
        borderColor="gray.300"
      >
        {chats ? (
          <Stack spacing={2} w="100%">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={4}
                py={3}
                boxShadow={selectedChat === chat ? "md" : "sm"}
                key={chat._id}
                transition="all 0.2s"
                _hover={{
                  bg: selectedChat === chat ? "#319795" : "#d1d1d1",
                  transform: "scale(1.02)",
                }}
                w="100%"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                <Text fontWeight="semibold" noOfLines={1}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs" mt={1} noOfLines={1} color="gray.600">
                    <b>{chat.latestMessage.sender.name}:</b>
                    {chat.latestMessage.content.length > 50
                      ? ` ${chat.latestMessage.content.substring(0, 51)}...`
                      : ` ${chat.latestMessage.content}`}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
