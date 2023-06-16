import React, { useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { thinnerScollbar } from '../Scrollbar';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CalendarModal from './CalendarModal';
import { Select } from 'chakra-react-select';
import { RiHealthBookLine } from 'react-icons/ri';
import { MdLibraryAdd } from 'react-icons/md';

import {
  addMonitoringOrphans,
  getAllActiveChild,
  updateMonitoring,
} from '@/services/user.service';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import cookie from 'js-cookie';
import moment from 'moment';

interface Props {
  isOpen: any;
  onClose: any;
  selectedUpdate?: any;
  type?: string;
}

const AddMonitor = ({ isOpen, onClose, selectedUpdate, type }: Props) => {
  let schema;

  if (type === 'update' || type === 'view') {
    schema = yup.object().shape({
      date: yup.string().required('Date is required.'),
      education: yup.string().required('Education is required.'),
      daily_health: yup
        .array()
        .required('Health is required.')
        .min(1, 'Please pick at least 1 Health')
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        ),
      action: yup.string().required('Action is required.'),
      chores: yup
        .array()
        .required('Chores is required.')
        .min(1, 'Please pick at least 1 Chores')
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        ),
      meal: yup.string().required('Meal is required.'),
      orphan_id: yup.string().required('Orphan is required.'),
    });
  } else {
    schema = yup.object().shape({
      date: yup.string().required('Date is required.'),
      education: yup.string().required('Education is required.'),
      daily_health: yup
        .array()
        .required('Health is required.')
        .min(1, 'Please pick at least 1 Health')
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        ),
      action: yup.string().required('Action is required.'),
      chores: yup
        .array()
        .required('Chores is required.')
        .min(1, 'Please pick at least 1 Chores')
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        ),
      meal: yup.string().required('Meal is required.'),
      orphan_id: yup
        .array()
        .required('Orphan is required.')
        .min(1, 'Please pick at least 1 Orphan')
        .of(
          yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }),
        ),
    });
  }

  const router = useRouter();
  const toast = useToast();
  const [activeOrphans, setActiveOrphans] = useState([]);
  const [chores, setChores] = useState<any>();
  const [health, setHealth] = useState<any>();
  const [orphansName, setOrphansName] = useState({ label: '', value: '' });
  const [meal, setMeal] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (type === 'update') {
      try {
        const payload = { ...data, id: selectedUpdate.id };
        const res = await updateMonitoring(payload);
        toastUI(1, res.message, 'Updated successfully');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { userId }: { userId: string } = jwt_decode(
          cookie.get('token') as any,
        );
        const payload = { ...data, addedby: userId };
        payload.orphan_id.map((orp: any) => {
          orp.name = orp.label;
          delete orp.label;
          delete orp.value;
          delete orp._id;
          delete orp.orphans;
        });
        const res = await addMonitoringOrphans(payload);
        toastUI(1, res.message, 'Successfully added');
      } catch (error) {
        console.log(error);
      }
    }
    router.replace(router.asPath);
    reset();
    setChores(null);
    setHealth(null);
    setEducation(null);
    setMeal(null);
    onClose();
  };

  useEffect(() => {
    if (selectedUpdate) {
      console.log({ selectedUpdate: selectedUpdate });

      const choresData = selectedUpdate.chores.map((data: any) => ({
        value: data.value,
        label: data.label,
      }));
      setChores(choresData);
      setValue('chores', choresData, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      const healthData = selectedUpdate.daily_health.map((data: any) => ({
        value: data.value,
        label: data.label,
      }));

      setHealth(healthData);
      setValue('daily_health', healthData, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setOrphansName({
        label: selectedUpdate.orphanName,
        value: selectedUpdate.id,
      });
      setValue('orphan_id', selectedUpdate.orphan_id, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setEducation({
        label: selectedUpdate.education,
        value: selectedUpdate.education,
      });
      setValue('education', selectedUpdate.education, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setMeal({
        label: selectedUpdate.meal,
        value: selectedUpdate.meal,
      });
      setValue('meal', selectedUpdate.meal, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('action', selectedUpdate.action, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        'date',
        moment(new Date(selectedUpdate.date)).utc().format('YYYY-MM-DD'),
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }
  }, [selectedUpdate]);

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
    getAllActiveOrphans();
  }, []);

  const getAllActiveOrphans = async () => {
    const res = await getAllActiveChild();
    res.data.map((orphan: any) => {
      orphan.label = orphan.orphans;
      orphan.value = orphan.id;
    });
    setActiveOrphans(res.data);
  };

  const mealOptions = [
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Merienda', label: 'Merienda' },
    { value: 'Dinner', label: 'Dinner' },
  ];

  const choresOptions = [
    { value: 'Sweep', label: 'Sweep' },
    { value: 'Wash Dishes', label: 'Wash Dishes' },
    { value: 'Setting Table', label: 'Setting Table' },
    { value: 'Laundry', label: 'Laundry' },
    { value: 'Folding Clothes', label: 'Folding Clothes' },
  ];

  const healthOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'Alergy', label: 'Alergy' },
    { value: 'Cold and Flu', label: 'Cold and Flu' },
    { value: 'Diarrhea', label: 'Diarrhea' },
    { value: 'Headache', label: 'Headache' },
    { value: 'Stomachaches', label: 'Stomachaches' },
  ];

  const gradesOptions = [
    { value: 'grade1', label: 'Grade 1' },
    { value: 'grade2', label: 'Grade 2' },
    { value: 'grade3', label: 'Grade 3' },
    { value: 'grade4', label: 'Grade 4' },
    { value: 'grade5', label: 'Grade 5' },
    { value: 'grade6', label: 'Grade 6' },
    { value: 'grade7', label: 'Grade 7' },
    { value: 'grade8', label: 'Grade 8' },
    { value: 'grade9', label: 'Grade 9' },
    { value: 'grade10', label: 'Grade 10' },
    { value: 'grade11', label: 'Grade 11' },
    { value: 'grade12', label: 'Grade 12' },
  ];

  const change = (e: any) => {
    if (type === 'update' || type == 'view') {
      setValue('orphan_id', e.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setOrphansName({
        label: e.label,
        value: e.value,
      });
    } else {
      setValue('orphan_id', e, { shouldValidate: true, shouldDirty: true });
      setOrphansName(e);
    }
  };

  const mealChange = (e: any) => {
    setValue('meal', e.value, { shouldValidate: true, shouldDirty: true });
    setMeal(e);
  };

  const choresChange = (e: any) => {
    setValue('chores', e, { shouldValidate: true, shouldDirty: true });
    setChores(e);
  };

  const healthChange = (e: any) => {
    setValue('daily_health', e, { shouldValidate: true, shouldDirty: true });
    setHealth(e);
  };

  const gradesChange = (e: any) => {
    setValue('education', e.value, { shouldValidate: true, shouldDirty: true });
    setEducation(e);
  };
  const addDailyHealth = () => {
    console.log('Health');
  };
  const addChores = () => {
    console.log('chores');
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
          sx={thinnerScollbar}
          maxW="80%"
        >
          <ModalHeader>
            {type === 'add' && 'Add Monitoring'}
            {type === 'view' && 'View Monitoring'}
            {type === 'update' && 'Update Monitoring'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {type === 'view' ? (
              <Flex direction="column" gap="30px" m="20px">
                <Flex gap="10">
                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Firstname:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Lastname:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Age:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>
                </Flex>

                <Flex gap="10">
                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Gender:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Height:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Weight:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>
                </Flex>

                <Flex gap="10">
                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Waist:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Date of admission:{' '}
                    </Text>
                    <Text fontSize="16px">
                      {/* {moment(new Date(selectedUpdate.date_admission))
                      .utc()
                      .format('YYYY-MM-DD')} */}
                    </Text>
                  </Flex>
                </Flex>

                <Flex gap="10">
                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Birth Status:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>

                  <Flex align="center" gap="10px">
                    <Text fontSize="18px" fontWeight="bolder">
                      Category:{' '}
                    </Text>
                    <Text fontSize="16px"></Text>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <form>
                <Flex gap="3" pt="5" direction="column">
                  <Flex>
                    <FormControl isInvalid={!!errors.orphan_id} id="orphan_id">
                      <FormLabel>Orphans</FormLabel>
                      {type === 'update' || type === 'view' ? (
                        <Select
                          {...register('orphan_id')}
                          name="orphan_id"
                          onChange={change}
                          colorScheme="blue"
                          options={activeOrphans}
                          value={orphansName}
                        />
                      ) : (
                        <Select
                          {...register('orphan_id')}
                          name="orphan_id"
                          onChange={change}
                          isMulti
                          colorScheme="blue"
                          options={activeOrphans}
                        />
                      )}

                      <Collapse in={errors.orphan_id ? true : false}>
                        {errors.orphan_id && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.orphan_id.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                  </Flex>
                  <Flex gap="3">
                    <FormControl isInvalid={errors.meal ? true : false}>
                      <FormLabel>Meal</FormLabel>
                      <Select
                        {...register('meal')}
                        name="meal"
                        onChange={mealChange}
                        colorScheme="blue"
                        options={mealOptions}
                        value={meal}
                      />
                      <Collapse in={errors.meal ? true : false}>
                        {errors.meal && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.meal.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                    <CalendarModal
                      placeholder="Date"
                      name="date"
                      errors={errors.date}
                      {...{ setValue, register, getValues }}
                    />
                    <FormControl isInvalid={errors.chores ? true : false}>
                      <FormLabel>Chores</FormLabel>
                      <Select
                        {...register('chores')}
                        isMulti
                        value={chores}
                        name="chores"
                        onChange={choresChange}
                        colorScheme="blue"
                        options={choresOptions}
                      />
                      <Collapse in={errors.chores ? true : false}>
                        {errors.chores && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.chores.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                    <FormControl isInvalid={errors.education ? true : false}>
                      <FormLabel>Education</FormLabel>
                      <Select
                        {...register('education')}
                        name="education"
                        onChange={gradesChange}
                        colorScheme="blue"
                        options={gradesOptions}
                        value={education}
                      />
                      <Collapse in={errors.education ? true : false}>
                        {errors.education && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.education.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                  </Flex>
                  <Flex gap="3">
                    <FormControl isInvalid={errors.daily_health ? true : false}>
                      <FormLabel>Daily Health</FormLabel>

                      <Select
                        {...register('daily_health')}
                        isMulti
                        value={health}
                        name="daily_health"
                        onChange={healthChange}
                        colorScheme="blue"
                        options={healthOptions}
                      />
                      <Collapse in={errors.daily_health ? true : false}>
                        {errors.daily_health && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.daily_health.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                    <FormControl isInvalid={errors.action ? true : false}>
                      <FormLabel>Action</FormLabel>
                      <Input
                        type="text"
                        placeholder="Action"
                        {...register('action')}
                      />
                      <Collapse in={errors.action ? true : false}>
                        {errors.action && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.action.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                  </Flex>
                </Flex>
              </form>
            )}
          </ModalBody>

          <ModalFooter>
            {type !== 'view' && (
              <Flex gap="4">
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                {/* <Button
                  colorScheme="blue"
                  onClick={addChores}
                  leftIcon={<MdLibraryAdd />}
                >
                  Add Chores
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={addDailyHealth}
                  leftIcon={<RiHealthBookLine />}
                >
                  Daily health
                </Button> */}
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isSubmitting}
                >
                  {type === 'update' && 'Update Monitoring'}
                  {type === 'add' && 'Create Monitoring'}
                </Button>
              </Flex>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMonitor;
