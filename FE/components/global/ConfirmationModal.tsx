import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  ModalFooter,
  Text,
} from '@chakra-ui/react';

const ConfirmationModal = ({
  isOpenDelete,
  onCloseDelete,
  confirmDelete,
}: any) => {
  const deleteData = (status: boolean) => confirmDelete(status);

  return (
    <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
      <ModalOverlay />
      <ModalContent maxW="250px">
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this account?</Text>
        </ModalBody>
        <ModalFooter>
          <Flex gap="2">
            <Button
              variant="outline"
              onClick={() => {
                deleteData(false);
                onCloseDelete();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteData(true);
                onCloseDelete();
              }}
            >
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
