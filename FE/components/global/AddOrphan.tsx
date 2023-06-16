import { thinnerScollbar } from '@/components/Scrollbar';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
// import Child from './Child';
// import Family from './Family';
import OrphanInfo from './OrphanInfo';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createOrphan } from '@/services/orphans.service';
import moment from 'moment';
import { useRouter } from 'next/router';
import { updateOrphanFunc } from '@/services/user.service';
import axios from 'axios';
import { orphanAvatar } from '@/services/endpoint';

const schema = yup.object().shape({
  firstname: yup.string().required('Firstname is required.'),
  lastname: yup.string().required('Lastname is required.'),
  age: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Age is required.'),
  gender: yup.string().required('Gender is required.'),
  dob: yup.string().required('Date of Birth is required.'),
  height: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Height is required.'),
  weight: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Weight is required.'),
  waist: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Waist is required.'),
  date_admission: yup.string().required('Date of Admission is required.'),
  birth_status: yup.string().required('Birth status is required.'),
  category: yup.string().required('Category is required.'),
  date_surrendered: yup.string().required('Date surrendered is required'),
  present_whereabouts: yup.string().required('Whereabouts is required.'),
  moral: yup.string().required('Moral is required.'),
});

interface Props {
  isOpen: any;
  onClose: any;
  selectedUpdate?: any;
  type?: string;
}

function AddOrphan({ isOpen, onClose, selectedUpdate, type }: Props) {
  const [image, setImage] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>('');

  const toast = useToast();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (selectedUpdate) {
      setAvatar(selectedUpdate.avatar || '');
      reset({
        firstname: selectedUpdate.firstname,
        lastname: selectedUpdate.lastname,
        age: selectedUpdate.age,
        gender: selectedUpdate.gender,
        dob: moment(new Date(selectedUpdate.dob)).utc().format('YYYY-MM-DD'),
        height: selectedUpdate.height,
        weight: selectedUpdate.weight,
        waist: selectedUpdate.waist,
        date_admission: moment(new Date(selectedUpdate.date_admission))
          .utc()
          .format('YYYY-MM-DD'),
        birth_status: selectedUpdate.birth_status,
        category: selectedUpdate.category,
        date_surrendered: moment(new Date(selectedUpdate.date_surrendered))
          .utc()
          .format('YYYY-MM-DD'),
        present_whereabouts: selectedUpdate.present_whereabouts,
        moral: selectedUpdate.moral,
      });
    }
  }, [selectedUpdate]);

  const onSubmit = async (data: any) => {
    try {
      if (type === 'add') await addUser(data);
      if (type === 'update') await updateUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async (data: any) => {
    const res = await createOrphan(data);
    if (res.success) {
      toastUI(1, res.message, 'Orphan created');
      reset();
      onClose();
      router.replace(router.asPath);
    } else {
      toastUI(2, res.message, 'Error');
    }
  };

  const updateUser = async (data: any) => {
    const payload = { ...data, id: selectedUpdate.id };
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('id', selectedUpdate.id);
      axios
        .post(orphanAvatar, formData)
        .then((response) => {
          payload['avatar'] = response.data.data?.source;
          return updateOrphanFunc(payload);
        })
        .then((res) => {
          toastUI(1, res.message, 'Orphan Update');
          reset();
          onClose();
          router.replace(router.asPath);
        });
    } else {
      const res = await updateOrphanFunc(payload);
      if (res.success) {
        toastUI(1, res.message, 'Orphan Update');
        reset();
        onClose();
        router.replace(router.asPath);
      } else {
        toastUI(2, res.message, 'Error');
      }
    }
  };
  const toastUI = (type: number, description: string, title: string) => {
    toast({
      status: type == 1 ? 'success' : 'error',
      variant: 'left-accent',
      position: 'top-right',
      isClosable: true,
      title,
      description: `${description}`,
      duration: 5000,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          maxH="90vh"
          overflowY="auto"
          maxW={type === 'view' ? '40%' : '80%'}
          sx={thinnerScollbar}
        >
          <ModalHeader>
            {type === 'view' && 'View Orphan'}
            {type === 'update' && 'Update Orphan'}
            {type === 'add' && 'Add Orphan'}

            {/* {type === 'view' ?? 'View Orphan'} */}
          </ModalHeader>
          <ModalCloseButton />
          {type === 'view' ? (
            <Flex direction="column" gap="30px" m="20px">
              <Flex gap="10">
                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Firstname:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.firstname}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Lastname:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.lastname}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Age:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.age}</Text>
                </Flex>
              </Flex>

              <Flex gap="10">
                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Gender:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.gender}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Height:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.height}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Weight:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.weight}</Text>
                </Flex>
              </Flex>

              <Flex gap="10">
                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Waist:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.waist}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Date of admission:{' '}
                  </Text>
                  <Text fontSize="16px">
                    {moment(new Date(selectedUpdate.date_admission))
                      .utc()
                      .format('YYYY-MM-DD')}
                  </Text>
                </Flex>
              </Flex>

              <Flex gap="10">
                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Birth Status:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.birth_status}</Text>
                </Flex>

                <Flex align="center" gap="10px">
                  <Text fontSize="18px" fontWeight="bolder">
                    Category:{' '}
                  </Text>
                  <Text fontSize="16px">{selectedUpdate.category}</Text>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <>
              <ModalBody>
                <FormProvider {...methods}>
                  <form>
                    <OrphanInfo {...{ setImage, type, avatar }} />
                  </form>
                </FormProvider>
              </ModalBody>

              {type === 'add' && (
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    onClick={methods.handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                  >
                    Create User
                  </Button>
                </ModalFooter>
              )}
              {type === 'update' && (
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    onClick={methods.handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                  >
                    Update
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddOrphan;
