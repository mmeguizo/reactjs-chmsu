import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Collapse,
  Input,
  FormControl,
  FormLabel,
  Stack,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
  Flex,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { thinnerScollbar } from '@/components/Scrollbar';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  addSched,
  createUser,
  userUpdate,
  all_volunteer,
} from '@/services/user.service';
import { useRouter } from 'next/router';
import { Select } from 'chakra-react-select';
import { Capitalize } from '@/services/helpers';
import CalendarModal from './CalendarModal';

interface Props {
  isOpen: any;
  onClose: any;
  selectedUpdate?: any;
  type?: string;
}
const schema = yup.object().shape({
  date: yup.string().required('Date is required.'),
  schedTime: yup.string().required('Time is required.'),
  volunteer: yup.string().required('Volunteer is required.'),
});

const AddSchedule = ({ isOpen, onClose, selectedUpdate, type }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const [allVolunteer, setAllVolunteer] = useState([]);
  const [schedTime, setSchedTime] = useState({ label: '', value: '' });
  const [volunteer, setVolunteer] = useState({ label: '', value: '' });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedUpdate) {
      setSchedTime({
        label: selectedUpdate.schedule,
        value: selectedUpdate.schedule,
      });
      setVolunteer({
        label: selectedUpdate.volunteers,
        value: selectedUpdate.id,
      });
      reset({
        volunteer: selectedUpdate.id,
        schedTime: selectedUpdate.schedule,
        date: new Date(selectedUpdate.schedule_date),
      });
    }
  }, [selectedUpdate]);
  useEffect(() => {
    reset();
    getAllVolunteer();
  }, [isOpen]);

  const getAllVolunteer = async () => {
    const { user } = await all_volunteer();
    const newItems = user.map((item: any) => ({
      label: item.email,
      value: item.id,
    }));

    setAllVolunteer(newItems);
  };

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const res = await addSched({
        volunteer_id: data.volunteer,
        schedule_date: data.date,
        schedule: data.schedTime,
      });
      toastUI(1, res.message, 'Successfully added');
      reset();
      onClose();
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
    }
    // try {
    //   if (type === 'add') return await addUser(data);
    //   if (type === 'update') return await updateUser(data);
    // } catch (error) {
    //   console.log(error);
    // }
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

  const time = [
    { value: '8am - 5pm', label: '8am - 5pm' },
    { value: '8am - 12pm', label: '8am - 12pm' },
    { value: '1pm - 5pm', label: '1pm - 5pm' },
  ];
  const timeChange = (e: any) => {
    setValue('schedTime', e.value, { shouldValidate: true, shouldDirty: true });
    setSchedTime({ label: e.label, value: e.value });
  };
  const volunteerChange = (e: any) => {
    setValue('volunteer', e.value, { shouldValidate: true, shouldDirty: true });
    setVolunteer({ label: e.label, value: e.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent overflowY="auto" sx={thinnerScollbar} maxW="40%">
        <ModalHeader>
          {type === 'add' && 'Add Schedule'}
          {type === 'view' && 'View Schedule'}
          {type === 'update' && 'Update Schedule'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <Stack gap="3">
              <CalendarModal
                placeholder="Schedule Date"
                name="date"
                errors={errors.date}
                {...{ setValue, register, getValues }}
              />
              <FormControl isInvalid={errors.schedTime ? true : false}>
                <FormLabel>Time</FormLabel>
                <Select
                  {...register('schedTime')}
                  name="schedTime"
                  onChange={timeChange}
                  colorScheme="blue"
                  options={time}
                  value={schedTime}
                />
                <Collapse in={errors.schedTime ? true : false}>
                  {errors.schedTime && (
                    <FormHelperText fontSize="SubHeader.md" color="red">
                      {errors.schedTime.message as string}
                    </FormHelperText>
                  )}
                </Collapse>
              </FormControl>
              <FormControl isInvalid={errors.volunteer ? true : false}>
                <FormLabel>Volunteer</FormLabel>
                <Select
                  {...register('volunteer')}
                  name="volunteer"
                  onChange={volunteerChange}
                  colorScheme="blue"
                  value={volunteer}
                  options={allVolunteer}
                />
                <Collapse in={errors.volunteer ? true : false}>
                  {errors.volunteer && (
                    <FormHelperText fontSize="SubHeader.md" color="red">
                      {errors.volunteer.message as string}
                    </FormHelperText>
                  )}
                </Collapse>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Add Schedule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AddSchedule);
