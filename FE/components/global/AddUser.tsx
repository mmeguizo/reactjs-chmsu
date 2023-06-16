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
import { createUser, userUpdate } from '@/services/user.service';
import { useRouter } from 'next/router';
import { Select } from 'chakra-react-select';
import { Capitalize } from '@/services/helpers';
interface Props {
  isOpen: any;
  onClose: any;
  selectedUpdate?: any;
  type?: string;
  userType?: string;
}
const AddUser = ({
  isOpen,
  onClose,
  selectedUpdate,
  type,
  userType,
}: Props) => {
  const router = useRouter();
  const [password, showPassword] = useState<boolean>(false);
  const [confirmPass, showConfirmPass] = useState<boolean>(false);
  const toast = useToast();
  const [role, setRole] = useState({ label: '', value: '' });
  const [roleOptions, setRoleOptions] = useState<any>();
  let schema;
  if (type === 'update') {
    schema = yup.object().shape({
      firstname: yup.string().notRequired(),
      lastname: yup.string().notRequired(),
      email: yup.string().email('Invalid Email').notRequired(),
      username: yup.string().notRequired(),
      role: yup.string().notRequired(),
      password: yup.string().notRequired(),
      confirm: yup
        .string()
        .notRequired()
        .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
    });
  } else {
    schema = yup.object().shape({
      firstname: yup.string().required('Firstname is required.'),
      lastname: yup.string().required('Lastname is required.'),
      email: yup.string().email('Invalid Email').required('Email is required.'),
      username: yup.string().required('Username is required.'),
      role: yup.string().required('Role is required.'),
      password: yup.string().required('Password is required.'),
      confirm: yup
        .string()
        .required('Confirm Password is required.')
        .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedUpdate) {
      setRole({
        label: Capitalize(selectedUpdate.role),
        value: selectedUpdate.role,
      });
      reset({
        email: selectedUpdate.email,
        username: selectedUpdate.username,
        firstname: selectedUpdate.firstname,
        lastname: selectedUpdate.lastname,
        password: '',
        confirm: '',
      });
    }
    options();
  }, [selectedUpdate]);

  useEffect(() => {
    reset();
  }, [isOpen]);

  const updateUser = async (userData: any) => {
    const payload = {
      ...userData,
      id: selectedUpdate.id,
      changePassword: userData.password ? true : false,
      newPassword: userData.password,
      type: 'admin',
    };
    delete payload.confirm;
    delete payload.password;
    await userUpdate(payload);
    toastUI(1, 'User successfully updated', 'Success');
    reset();
    router.replace('/admin/accounts');
    onClose();
  };

  const addUser = async (data: any) => {
    const { success, message } = await createUser(data);
    if (!success) {
      toastUI(2, message, 'Error');
    }
    if (success && message === 'Account Registered successfully') {
      toastUI(1, message, 'Account created.');
      reset();
      router.replace('/admin/accounts');
      onClose();
    }
  };
  const onSubmit = async (data: any) => {
    try {
      if (type === 'add') return await addUser(data);
      if (type === 'update') return await updateUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const change = (e: any) => {
    setValue('role', e.value, { shouldValidate: true, shouldDirty: true });
    setRole({ label: e.label, value: e.value });
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

  const options = () => {
    console.log(type);

    if (userType === 'admin') {
      setRoleOptions([
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Foster',
          value: 'foster',
        },
        {
          label: 'Social Worker',
          value: 'socialworker',
        },
        {
          label: 'Volunteer',
          value: 'volunteer',
        },
      ]);
    } else {
      setRoleOptions([
        {
          label: 'Foster',
          value: 'foster',
        },
        {
          label: 'Social Worker',
          value: 'socialworker',
        },
        {
          label: 'Volunteer',
          value: 'volunteer',
        },
      ]);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent overflowY="auto" sx={thinnerScollbar} maxW="55%">
        <ModalHeader>
          {type === 'add' && 'Add Account'}
          {type === 'view' && 'View Account'}
          {type === 'update' && 'Update Account'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <Stack gap="3">
              <Flex gap="3">
                <FormControl isInvalid={!!errors.role} id="role" zIndex="9">
                  <FormLabel>Role</FormLabel>
                  <Select
                    {...register('role')}
                    name="role"
                    onChange={change}
                    selectedOptionStyle="check"
                    colorScheme="blue"
                    value={role}
                    options={roleOptions}
                  />
                  <Collapse in={errors.role ? true : false}>
                    {errors.role && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.role.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>
                <FormControl isInvalid={errors.firstname ? true : false}>
                  <FormLabel>Firstname</FormLabel>
                  <Input
                    placeholder="Firstname"
                    autoComplete="off"
                    _placeholder={{
                      color: 'white',
                      opacity: '.5',
                      fontFamily: 'robo',
                      fontSize: 'SubHeader.lg',
                    }}
                    {...register('firstname')}
                  />
                  <Collapse in={errors.firstname ? true : false}>
                    {errors.firstname && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.firstname.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>
              </Flex>
              <Flex gap="3">
                <FormControl isInvalid={errors.lastname ? true : false}>
                  <FormLabel>Lastname</FormLabel>
                  <Input
                    placeholder="Lastname"
                    autoComplete="off"
                    _placeholder={{
                      color: 'white',
                      opacity: '.5',
                      fontFamily: 'robo',
                      fontSize: 'SubHeader.lg',
                    }}
                    {...register('lastname')}
                  />
                  <Collapse in={errors.lastname ? true : false}>
                    {errors.lastname && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.lastname.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>
                <FormControl isInvalid={errors.email ? true : false}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Email"
                    autoComplete="off"
                    _placeholder={{
                      color: 'white',
                      opacity: '.5',
                      fontFamily: 'robo',
                      fontSize: 'SubHeader.lg',
                    }}
                    {...register('email')}
                  />
                  <Collapse in={errors.email ? true : false}>
                    {errors.email && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.email.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>
              </Flex>
              <Flex gap="3">
                <FormControl isInvalid={errors.username ? true : false}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Username"
                    autoComplete="off"
                    _placeholder={{
                      color: 'white',
                      opacity: '.5',
                      fontFamily: 'robo',
                      fontSize: 'SubHeader.lg',
                    }}
                    {...register('username')}
                  />
                  <Collapse in={errors.username ? true : false}>
                    {errors.username && (
                      <FormHelperText fontSize="SubHeader.md" color="red">
                        {errors.username.message as string}
                      </FormHelperText>
                    )}
                  </Collapse>
                </FormControl>

                {type !== 'view' && (
                  <>
                    <FormControl isInvalid={errors.password ? true : false}>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          placeholder="Password"
                          autoComplete="off"
                          type={password ? 'text' : 'password'}
                          _placeholder={{
                            color: 'white',
                            opacity: '.5',
                            fontFamily: 'robo',
                            fontSize: 'SubHeader.lg',
                          }}
                          {...register('password')}
                        />

                        <InputRightElement>
                          <Icon
                            onClick={() => showPassword(!password)}
                            as={password ? FiEye : FiEyeOff}
                            color="black"
                            _hover={{
                              cursor: 'pointer',
                              transform: 'scale(1.1)',
                              transition: 'all 1s ease',
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Collapse in={errors.password ? true : false}>
                        {errors.password && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.password.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                    <FormControl isInvalid={errors.confirm ? true : false}>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Input
                          placeholder="Confirm Password"
                          autoComplete="off"
                          type={confirmPass ? 'text' : 'password'}
                          _placeholder={{
                            color: 'white',
                            opacity: '.5',
                            fontFamily: 'robo',
                            fontSize: 'SubHeader.lg',
                          }}
                          {...register('confirm')}
                        />

                        <InputRightElement>
                          <Icon
                            onClick={() => showConfirmPass(!confirmPass)}
                            as={confirmPass ? FiEye : FiEyeOff}
                            color="black"
                            _hover={{
                              cursor: 'pointer',
                              transform: 'scale(1.1)',
                              transition: 'all 1s ease',
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Collapse in={errors.confirm ? true : false}>
                        {errors.confirm && (
                          <FormHelperText fontSize="SubHeader.md" color="red">
                            {errors.confirm.message as string}
                          </FormHelperText>
                        )}
                      </Collapse>
                    </FormControl>
                  </>
                )}
              </Flex>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          {type !== 'view' && (
            <>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
              >
                {type === 'update' && 'Update User'}
                {type === 'add' && 'Create User'}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AddUser);
