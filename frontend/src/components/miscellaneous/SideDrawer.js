import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { Image, VStack } from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";

import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    window.location.reload();
    toast({
      title: "Logged out",
      description: "You have successfully logged out.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Modal disclosure for About Us
  const {
    isOpen: isAboutUsOpen,
    onOpen: onAboutUsOpen,
    onClose: onAboutUsClose,
  } = useDisclosure();

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px"
        borderColor="gray.200"
        flexWrap="nowrap" // Prevent wrapping
      >
        {/* Left side (Search and Giet-Connect) */}
        <Box display="flex" alignItems="center">
          <Tooltip label="Search Users" hasArrow placement="bottom-end">
            <Button
              variant="solid"
              bgGradient="linear(to-r, teal.400, blue.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, teal.600, blue.700)",
                transform: "scale(1.05)",
              }}
              boxShadow="lg"
              px={{ base: 3, md: 6 }}
              py={{ base: 2, md: 4 }}
              fontSize={{ base: "md", md: "lg" }}
              onClick={onOpen}
              mr={{ base: 2, md: 4 }} // Spacing between button and text
            >
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>
        </Box>

        {/* Center (Giet-Connect) */}
        <Box
          display="flex"
          justifyContent="center"
          flex="1" // Ensures this takes the available space in the center
        >
          <Text
            fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }} // Adjust font sizes
            fontFamily="'Poppins', sans-serif"
            bgGradient="linear(to-r, #00C9FF, #92FE9D)"
            bgClip="text"
            letterSpacing="widest"
            textTransform="uppercase"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)"
            transition="transform 0.3s ease-in-out"
            _hover={{
              textShadow: "4px 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Giet-Connect
          </Text>
        </Box>

        {/* Right side (Notifications and Profile Modal) */}
        <Box display="flex" alignItems="center">
          <Menu>
            <MenuButton p={1} position="relative">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                }}
              />
              <BellIcon
                fontSize="2xl"
                m={1}
                color="gray.700"
                _hover={{ color: "teal.500" }}
              />
            </MenuButton>
            <MenuList pl={2} bg="white" borderRadius="lg" boxShadow="md">
              {!notification.length ? (
                <MenuItem isDisabled>No New Messages</MenuItem>
              ) : (
                notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                    _hover={{ bg: "gray.100" }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                    mr={3}
                  />
                  <Text>{user.name}</Text>
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              <MenuItem onClick={onAboutUsOpen}>About Us</MenuItem>{" "}
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                colorScheme="teal"
                isLoading={loading}
                loadingText="Searching..."
              >
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isAboutUsOpen} onClose={onAboutUsClose} size="lg">
        <ModalOverlay />
        <ModalContent
          bgGradient="linear(to-br, teal.500, blue.500)"
          borderRadius="lg"
        >
          <ModalHeader
            textAlign="center"
            color="white"
            fontSize="2xl"
            fontWeight="bold"
          >
            About Us
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <VStack spacing={6} align="center" textAlign="center">
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={4}
                bgColor="white"
                borderRadius="md"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.2s"
              >
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src="ab.jpg"
                  alt="Developer 1"
                  mb={2}
                  boxShadow="0 0 5px rgba(0,0,0,0.5)"
                />
                <Text fontSize="lg" fontWeight="bold">
                  Sandeep Pati
                </Text>
                <Text fontSize="md" color="gray.600">
                  Email: sandeeppati69@gmail.com
                </Text>
                <Text fontSize="md" color="gray.600">
                  Phone: +91 8260195633
                </Text>
              </Box>

              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={4}
                bgColor="white"
                borderRadius="md"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.2s"
              >
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src="binu.jpg"
                  alt="Developer 2"
                  mb={2}
                  boxShadow="0 0 5px rgba(0,0,0,0.5)"
                />
                <Text fontSize="lg" fontWeight="bold">
                  Binayak Pradhan
                </Text>
                <Text fontSize="md" color="gray.600">
                  Email: pradhanbinayak731@gmail.com
                </Text>
                <Text fontSize="md" color="gray.600">
                  Phone: +91 7008774712
                </Text>
              </Box>

              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={4}
                bgColor="white"
                borderRadius="md"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.2s"
              >
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src="tadu.jpg"
                  alt="Developer 3"
                  mb={2}
                  boxShadow="0 0 5px rgba(0,0,0,0.5)"
                />
                <Text fontSize="lg" fontWeight="bold">
                  Debaraj Tadu
                </Text>
                <Text fontSize="md" color="gray.600">
                  Email: debrajtadu4@gmail.com
                </Text>
                <Text fontSize="md" color="gray.600">
                  Phone: +91 8260185052
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="pink" onClick={onAboutUsClose} variant="solid">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideDrawer;
