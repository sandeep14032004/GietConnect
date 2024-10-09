import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  IconButton,
  Spacer,
  Spinner,
  FormControl,
  Input,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useEffect, useState } from "react";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      socket.emit("join chat", selectedChat._id);
    }
    // eslint-disable-next-line
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      } else {
        if (!notification.includes(newMessageReceived)) {
          setNotification((prevNotification) => [
            newMessageReceived,
            ...prevNotification,
          ]);
          setFetchAgain((prevFetch) => !prevFetch);
        }
      }
    });

    // Cleanup function for message listener
    return () => {
      socket.off("message received");
    };
  }, [selectedChat, notification, fetchAgain]);

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        setNewMessage((prev) => prev + "\n");
      } else {
        sendMessage();
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              mr={2}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Text fontWeight="bold">
                  {getSender(user, selectedChat.users)}
                </Text>
                <Spacer />
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Text
                  fontWeight="bold"
                  mr="auto"
                  display="flex"
                  alignItems="center"
                >
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <Spacer />
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={0}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            overflowY="hidden"
            boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
            border="1px solid #ccc"
            position="relative"
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="100%"
                position="absolute"
                top="0"
                left="0"
              >
                <Spinner size="xl" />
              </Box>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={handleKeyDown} isRequired mt={3}>
              <Flex direction="column">
                {isTyping ? (
                  <Box mb={2} alignSelf="flex-start">
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      style={{ marginBottom: 1, marginLeft: 0 }}
                    />
                  </Box>
                ) : null}
                <Flex>
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message..."
                    onChange={typingHandler}
                    value={newMessage}
                    flex="1"
                  />
                  <Button onClick={sendMessage} colorScheme="teal" ml={2}>
                    Send
                  </Button>
                </Flex>
              </Flex>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Communication is the key to unlocking understanding.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
