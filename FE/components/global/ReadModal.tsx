import { Capitalize } from '@/services/helpers';
import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

const ReadModal = ({ isOpen, onClose, messageData, setMessageToRead }: any) => {
  useEffect(() => {
    if (messageData) setMessageToRead(messageData.id);
  }, [messageData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {messageData ? Capitalize(messageData.name) : ''}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{messageData ? messageData.message : ''}</Text>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReadModal;
