import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
const Update = ({
  isOpen,
  onClose,
  cancelRefUpdate,
  confirmUpdate,
  name,
}: any) => {
  const update = () => {
    confirmUpdate(true);
    onClose();
  };
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRefUpdate}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {name}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to confirm visit?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefUpdate} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={update} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Update;
