import {
  Flex,
  Box,
  Image,
  Text,
  Button,
  Stack,
  Menu,
  MenuButton,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import WebsiteMenu from '../global/WebsiteMenu';

const BgProps = {
  height: '100vh',
  width: '100%',
  pos: 'absolute',
  zIndex: '0',
} as any;

const HeaderMenuProps = {
  fontFamily: 'robo',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '18px',
  color: 'white',
};
const FirstSection = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <WebsiteMenu {...{ isOpen, onClose, btnRef }} />

      <Flex h="100vh" id="company">
        <Box zIndex="1" w="100vw" h="100vh" bg="#00000033" pos="absolute" />
        <Image src="bg.jpg" alt="bg" {...BgProps} />
        <Flex zIndex="2" display={{ base: 'block', lg: 'none' }}>
          <Menu>
            <MenuButton
              mt="5"
              ml="5"
              as={IconButton}
              aria-label="Options"
              icon={<GiHamburgerMenu />}
              variant="outline"
              onClick={onOpen}
            />
          </Menu>
        </Flex>
        <Stack zIndex="2" display={{ base: 'none', lg: 'block' }}>
          <Flex w="100vw" mt="10px" h="40px" align="center">
            <Flex flexGrow="1" justify="center" gap="40px">
              <Text
                {...HeaderMenuProps}
                transition="all .5s ease-in-out"
                _hover={{
                  transform: 'scale(1.2)',
                  transition: 'all .5s  ease-in-out',
                  cursor: 'pointer',
                }}
              >
                <a href="#company">COMPANY</a>
              </Text>
              <Text
                {...HeaderMenuProps}
                transition="all .5s ease-in-out"
                _hover={{
                  transform: 'scale(1.2)',
                  transition: 'all .5s ease-in-out',
                }}
              >
                <a href="#services">SERVICES</a>
              </Text>
              <Text
                {...HeaderMenuProps}
                transition="all .5s ease-in-out"
                _hover={{
                  transform: 'scale(1.2)',
                  transition: 'all .5s ease-in-out',
                }}
              >
                <a href="#about">ABOUT US</a>
              </Text>
              <Text
                {...HeaderMenuProps}
                transition="all .5s ease-in-out"
                _hover={{
                  transform: 'scale(1.2)',
                  transition: 'all .5s ease-in-out',
                }}
              >
                <a href="#contact">CONTACT US</a>
              </Text>
            </Flex>
            <Flex pr="50px">
              <Button
                transition="all .5s ease-in-out"
                onClick={() => router.push('/login')}
                _hover={{
                  transform: 'scale(1.1)',
                  transition: 'all .5s ease-in-out',
                }}
              >
                Login
              </Button>
            </Flex>
          </Flex>
          <Flex
            w="100vw"
            align="center"
            h="200px"
            justify="center"
            zIndex="2"
            pos="absolute"
          >
            <Text
              fontSize="52px"
              fontWeight="bolder"
              textShadow="5px 5px #558abb"
            >
              WELCOME TO HOLY INFANT NURSERY
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};

export default FirstSection;
