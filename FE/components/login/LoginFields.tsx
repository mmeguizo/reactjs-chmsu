import React, { useState } from 'react';
import {
  Text,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Stack,
  Collapse,
  Image,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormContext, useFormState } from 'react-hook-form';
import Link from 'next/link';

const LoginFields = () => {
  const [password, showPassword] = useState<boolean>(false);
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();
  const { errors } = useFormState();

  return (
    <>
      <Flex gap="5" direction="column" align="center" justify="center">
        <Image src="logo300.png" alt="logo" w="180px" h="180px" />
        <Text fontSize="Header.xs" fontWeight="normal" fontFamily="robo">
          Sign in to Holy Infant Nursery.
        </Text>
        <Stack>
          <Input
            variant="basic"
            placeholder="Username"
            w="300px"
            autoComplete="off"
            _placeholder={{
              color: 'white',
              opacity: '.5',
              fontFamily: 'robo',
              fontSize: 'SubHeader.lg',
            }}
            {...register('username')}
          />
          <Collapse in={errors.username ? true : false} animateOpacity>
            {errors.username && (
              <Text fontSize="SubHeader.md" color="red">
                {errors.username.message as string}
              </Text>
            )}
          </Collapse>
        </Stack>
        <Stack>
          <InputGroup w="300px">
            <Input
              bg="black300"
              placeholder="Password"
              type={password ? 'text' : 'password'}
              _placeholder={{
                color: 'white',
                opacity: '.5',
                fontFamily: 'robo',
                fontSize: 'SubHeader.lg',
              }}
              variant="basic"
              {...register('password')}
            />

            <InputRightElement>
              <Icon
                onClick={() => showPassword(!password)}
                as={password ? FiEye : FiEyeOff}
                color="white"
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
              <Text fontSize="SubHeader.md" color="red">
                {errors.password.message as string}
              </Text>
            )}
          </Collapse>
        </Stack>
        <Button
          w="300px"
          color="black300"
          fontFamily="robo"
          fontSize="SubHeader.lg"
          bg="green500"
          type="submit"
          isLoading={isSubmitting}
        >
          Login
        </Button>
        <Text>
          Don’t have an account?{' '}
          <Link href="/register" target="_blank">
            <Text as="span" fontWeight="bold" _hover={{ cursor: 'pointer' }}>
              SignUp
            </Text>
          </Link>
        </Text>
      </Flex>
    </>
  );
};

export default LoginFields;
