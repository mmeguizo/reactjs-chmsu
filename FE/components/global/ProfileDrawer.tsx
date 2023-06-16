import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Collapse,
  FormHelperText,
  Stack,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import jwt_decode from 'jwt-decode';
import cookie from 'js-cookie';
import { userUpdate, imageUpload } from '@/services/user.service';
import { useRouter } from 'next/router';
import ImageUpload from './ImageUpload';
import { upload } from '@/services/endpoint';

interface UserProps {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  userId: string;
  role: string;
  avatar: string;
}

const schema = yup.object().shape(
  {
    firstname: yup.string().required('Firstname is required'),
    lastname: yup.string().required('Lastname is required'),
    email: yup.string().email('Invalid Email').required('Email is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().when('confirm', {
      is: (value: string) => value !== '',
      then: yup
        .string()
        .required('Password is required')
        .oneOf([yup.ref('confirm'), null], 'Passwords do not match.'),
    }),
    confirm: yup.string().when('password', {
      is: (value: string) => value !== '',
      then: yup
        .string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
    }),
  },
  [['password', 'confirm']],
);

const ProfileDrawer = ({ isOpen, onClose, btnRef, profileUrl }: any) => {
  const router = useRouter();
  const [password, showPassword] = useState<boolean>(false);
  const [confirmPass, showConfirmPass] = useState<boolean>(false);
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const toast = useToast();
  const [image, setImage] = useState<any>(null);
  const [filename, setFilename] = useState<any>(profileUrl);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      id: id,
      changePassword: data.password ? true : false,
      newPassword: data.password,
      type: role,
    };

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('id', id);
      axios.post(upload, formData).then((response) => {
        payload['avatar'] = response.data.data?.source;
        userUpdate(payload);
      });
      toastUI(1, 'User successfully updated', 'Success');
      cookie.remove('token');
      router.push('/login');
      return;
    }
    await userUpdate(payload);
    toastUI(1, 'User successfully updated', 'Success');
    cookie.remove('token');
    router.push('/login');
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
    const t = jwt_decode(cookie.get('token') as string);
    const {
      lastname,
      username,
      firstname,
      email,
      userId,
      role,
      avatar,
    }: UserProps = jwt_decode(cookie.get('token') as string);
    setRole(role);
    setId(userId);
    setFilename(avatar);
    setValue('lastname', lastname);
    setValue('username', username);
    setValue('firstname', firstname);
    setValue('email', email);
  }, [isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update your profile</DrawerHeader>
          <DrawerBody>
            <Stack gap="3">
              <ImageUpload setImage={setImage} profileUrl={filename} />

              <FormControl isInvalid={errors.firstname ? true : false}>
                <FormLabel>Firstname</FormLabel>
                <Input
                  type="text"
                  placeholder="Firstname"
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
              <FormControl isInvalid={errors.lastname ? true : false}>
                <FormLabel>Lastname</FormLabel>
                <Input
                  type="text"
                  placeholder="Lastname"
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
                <Input type="text" placeholder="Email" {...register('email')} />
                <Collapse in={errors.email ? true : false}>
                  {errors.email && (
                    <FormHelperText fontSize="SubHeader.md" color="red">
                      {errors.email.message as string}
                    </FormHelperText>
                  )}
                </Collapse>
              </FormControl>
              <FormControl isInvalid={errors.username ? true : false}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Username"
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
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default ProfileDrawer;
