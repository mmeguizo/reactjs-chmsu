import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Collapse,
  FormHelperText,
  Textarea,
  Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  name: yup.string().required('Title is required'),
  value: yup.string().required('Value is required'),
});

const ServiceModal = ({ isOpenService, onCloseService, addService }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (e: any) => {
    addService(e);
    onCloseService();
    reset();
  };
  return (
    <Modal isOpen={isOpenService} onClose={onCloseService}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Service</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack>
              <FormControl isInvalid={errors.name ? true : false}>
                <FormLabel>Title</FormLabel>
                <Input type="text" placeholder="Title" {...register('name')} />
                <Collapse in={errors.name ? true : false}>
                  {errors.name && (
                    <FormHelperText fontSize="SubHeader.md" color="red">
                      {errors.name.message as string}
                    </FormHelperText>
                  )}
                </Collapse>
              </FormControl>
              <FormControl isInvalid={errors.name ? true : false}>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Description" {...register('value')} />
                <Collapse in={errors.value ? true : false}>
                  {errors.value && (
                    <FormHelperText fontSize="SubHeader.md" color="red">
                      {errors.value.message as string}
                    </FormHelperText>
                  )}
                </Collapse>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Save</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ServiceModal;
