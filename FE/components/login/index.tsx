import React from 'react';
import LoginFields from './LoginFields';

import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Image, useToast } from '@chakra-ui/react';
import { loginAuth } from '@/services/auth';
import cookie from 'js-cookie';
import { getUserLoginId } from '@/services/helpers';
const schema = yup.object().shape({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
});

const BgProps = {
  height: '100%',
  width: '100%',
  pos: 'absolute',
  zIndex: '0',
} as any;
const Login = () => {
  const router = useRouter();
  const toast = useToast();

  const formMethods = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload: any) => {
    try {
      const { data } = await loginAuth(payload);
      const { token, role, success, message } = data;
      if (success) {
        cookie.set('token', token);
        toastUI(1, `Welcome ${role}`, 'Login successfully.');
        if (role === 'socialworker') return router.push(`${role}/accounts`);
        if (role === 'volunteer') return router.push(`${role}/schedules`);

        router.push(`${role}/dashboard`);
      } else {
        return toastUI(2, message, 'Not found.');
      }
    } catch (error) {
      toastUI(2, 'Something went wrong', 'Error');
      console.log(error);
    }

    // const { userId } = getUserLoginId();
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
      <Image src="loginBg.jpg" alt="bg" {...BgProps} />
      <Flex
        height="100vh"
        position="relative"
        align="center"
        direction="column"
        justify="center"
        pb="25vh"
      >
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <LoginFields />
          </form>
        </FormProvider>
      </Flex>
    </>
  );
};

export default Login;
