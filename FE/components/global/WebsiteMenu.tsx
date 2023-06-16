import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

const WebsiteMenu = ({ isOpen, onClose, btnRef }: any) => {
  const router = useRouter();
  const MenuStyles = {
    h: '40px',
    fontWeight: 'bold',
    w: '200px',
    align: 'center',
    justify: 'center',
  };

  const MenuHover = {
    transform: 'scale(1.1)',
    cursor: 'pointer',
    bg: 'gray.100',
  };
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent maxW="200px">
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody p="0" m="0">
          <Flex
            direction="column"
            w="200px"
            align="center"
            justify="center"
            gap="5"
            mt="50px"
          >
            <Flex
              transition="all 0.5s ease"
              _hover={{ ...MenuHover }}
              {...MenuStyles}
            >
              COMPANY
            </Flex>

            <Flex
              transition="all 0.5s ease"
              _hover={{ ...MenuHover }}
              {...MenuStyles}
            >
              ABOUT US
            </Flex>

            <Flex
              transition="all 0.5s ease"
              _hover={{ ...MenuHover }}
              {...MenuStyles}
            >
              SERVICES
            </Flex>

            <Flex
              transition="all 0.5s ease"
              _hover={{ ...MenuHover }}
              {...MenuStyles}
            >
              CONTACT US
            </Flex>

            <Button
              transition="all .5s ease-in-out"
              w="150px"
              onClick={() => router.push('/login')}
              _hover={{
                transform: 'scale(1.1)',
                transition: 'all .5s ease-in-out',
              }}
            >
              Login
            </Button>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default WebsiteMenu;
