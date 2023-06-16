import React, { useEffect } from 'react';
import { thinnerScollbar } from '@/components/Scrollbar';
import {
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { allOrphans } from '@/services/orphans.service';
import { getUserLoginId } from '@/services/helpers';
import { addVisit } from '@/services/user.service';
import { useRouter } from 'next/router';
import CalendarModal from './CalendarModal';
import moment from 'moment';

const schema = yup.object().shape({
  purpose: yup.string().required('Puspose is required.'),
  visit_date: yup.string().required('Visitation Date is required.'),
});

const AddVisitation = ({ isOpen, onClose, selectedUpdate, type }: any) => {
  const toast = useToast();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    reset,
    setValue,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const { userId } = getUserLoginId();
      const payload = { ...data, user_id: userId, date: data.visit_date };
      delete payload.visit_date;
      const response = await addVisit(payload);
      if (response.success) toastUI(1, response.message, 'Orphan Added');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
      onClose();
    } catch (error) {
      console.log(error);
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
  useEffect(() => {
    reset();
  }, [isOpen]);

  useEffect(() => {
    if (selectedUpdate) {
      reset({
        purpose: selectedUpdate.purpose,
        visit_date: moment(new Date(selectedUpdate.dateAdded))
          .utc()
          .format('YYYY-MM-DD'),
      });
    }
  }, [selectedUpdate]);
  // useEffect(() => {
  //   getAllOrphans();
  // }, []);

  // const getAllOrphans = async () => {
  //   const response = await allOrphans();
  //   console.log(response);
  // };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent overflowY="auto" sx={thinnerScollbar}>
        <ModalHeader>Add Visitation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <form>
              <Stack gap="2">
                <FormControl isInvalid={errors.purpose ? true : false}>
                  <FormLabel>Purpose of visit</FormLabel>
                  <Textarea placeholder="Purpose" {...register('purpose')} />
                  <Collapse in={errors.purpose ? true : false}>
                    {errors.purpose && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.purpose.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>
                <CalendarModal
                  placeholder="Visitation Date"
                  name="visit_date"
                  errors={errors.visit_date}
                  {...{ setValue, register, getValues }}
                />
              </Stack>
            </form>
          </FormProvider>
          {/* <Childrens orphans={orphans}/> */}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={methods.handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Add Visitation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddVisitation;
