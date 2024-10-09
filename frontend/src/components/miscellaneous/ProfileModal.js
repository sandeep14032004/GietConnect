import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          bgGradient="linear(to-r, teal.400, blue.500)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, teal.600, blue.700)",
            transform: "scale(1.05)",
          }}
          boxShadow="md"
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h={{ base: "400px", md: "450px" }}
          borderRadius="lg"
          boxShadow="lg"
          bgGradient="linear(to-br, gray.50, blue.100)"
        >
          <ModalHeader>
            <Flex justifyContent="center" alignItems="center">
              <Text
                fontSize={{ base: "30px", md: "40px" }}
                fontFamily="'Poppins', sans-serif"
                color="gray.700"
                letterSpacing="wider"
              >
                {user?.name || "Unknown User"}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as={Flex}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic || "defaultImage.png"}
              alt={user?.name || "User profile picture"}
              mb={4}
              boxShadow="md"
              border="4px solid"
              borderColor="teal.400"
            />
            <Text
              fontSize={{ base: "20px", md: "25px" }}
              fontFamily="'Poppins', sans-serif"
              color="gray.600"
              textAlign="center"
            >
              Email: {user?.email || "No email provided"}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={onClose}
              colorScheme="teal"
              px={8}
              py={4}
              boxShadow="md"
              _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
