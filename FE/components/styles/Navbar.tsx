import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  Avatar,
  MenuList,
  MenuButton,
  Menu,
  MenuItem,
  Image,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { AiFillBell, AiOutlineLogout } from 'react-icons/ai';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import { getAllUnread } from '@/services/user.service';
import ProfileDrawer from '../global/ProfileDrawer';
import { FaGlobe, FaUserCog } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import UserMenuAdmin from '../global/UserMenuAdmin';
import UserSocialWorkerMenu from '../global/UserSocialWorkerMenu';
import UserFoster from '../global/UserFoster';
import UserVolunteer from '../global/UserVolunteer';
import WebsiteDrawer from '../global/WebsiteDrawer';
import { LOCALDEV } from '@/services/endpoint';
const Navbar = ({ type }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenWebsiteMenu,
    onOpen: onOpenWebsiteMenu,
    onClose: onCloseWebsiteMenu,
  } = useDisclosure();
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();

  const btnRef = React.useRef();
  const btnRefMenu = React.useRef();
  const btnRefWebsite = React.useRef();

  const router = useRouter();
  const [user, setUser] = useState('test');
  const [totalUnread, setTotalUnread] = useState(0);
  const [profileUrl, setProfileUrl] = useState('');
  const [roleType, setRole] = useState('');

  useEffect(() => {
    console.log(jwt_decode(cookie.get('token') as string));

    const {
      fullname,
      avatar,
      role,
    }: { fullname: string; avatar: string; role: string } = jwt_decode(
      cookie.get('token') as string,
    );
    setUser(fullname);
    setProfileUrl(avatar);
    setRole(role);
    getTotal();
  }, []);

  const getTotal = async () => {
    const response = await getAllUnread();
    setTotalUnread(response.total);
  };

  const handleNavigate = () => {
    router.push(
      { pathname: 'inquiries', query: { status: 'unread' } },
      'inquiries',
    );
  };

  return (
    <>
      <ProfileDrawer {...{ isOpen, onClose, btnRef }} />
      <WebsiteDrawer
        {...{ isOpenWebsiteMenu, btnRefWebsite, onCloseWebsiteMenu }}
      />

      {type === 'admin' && (
        <UserMenuAdmin {...{ isOpenMenu, onCloseMenu, btnRefMenu }} />
      )}
      {type === 'socialworker' && (
        <UserSocialWorkerMenu {...{ isOpenMenu, onCloseMenu, btnRefMenu }} />
      )}
      {type === 'foster' && (
        <UserFoster {...{ isOpenMenu, onCloseMenu, btnRefMenu }} />
      )}
      {type === 'volunteer' && (
        <UserVolunteer {...{ isOpenMenu, onCloseMenu, btnRefMenu }} />
      )}
      <Flex
        h="10vh"
        bg="main"
        shadow="md"
        justify="start"
        align="center"
        w="100vw"
      >
        <Flex
          justifyContent="space-between"
          align="center"
          w="inherit"
          mx="20px"
        >
          <Image
            src="/logo60.png"
            alt="logo"
            display={{ base: 'none', lg: 'block' }}
          />
          <Box display={{ base: 'block', lg: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<GiHamburgerMenu />}
                variant="outline"
                onClick={onOpenMenu}
              />
            </Menu>
          </Box>

          <Flex align="center" gap="30px">
            {(type === 'admin' || type === 'socialworker') && (
              <Flex
                pos="relative"
                transition="all 0.5s ease"
                _hover={{
                  cursor: 'pointer',
                  transform: 'scale(1.1)',
                  transition: 'all 0.5s ease',
                }}
                onClick={handleNavigate}
              >
                <Icon as={AiFillBell} w="20px" h="20px" zIndex="2" />
                <Text
                  color="blue"
                  pos="absolute"
                  top="-14px"
                  opacity=".5"
                  right="-5px"
                  fontWeight="bold"
                >
                  {totalUnread}
                </Text>
              </Flex>
            )}

            <Box w="1px" bg="gray" h="30px" opacity=".5" />
            <Text
              fontFamily="robo"
              fontSize="SubHeader.lg"
              fontWeight="semibold"
            >
              {user.toUpperCase()} | ({roleType.toUpperCase()})
            </Text>
            <Menu>
              <MenuButton
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'all .5s ease-in-out',
                }}
                transition="all .5s ease-in-out"
                outline="transparent"
              >
                <Avatar
                  fontFamily="robo"
                  name={user ? user : 'A'}
                  src={`${LOCALDEV}/images/${profileUrl}`}
                  mr="20px"
                />
              </MenuButton>
              <MenuList minW="100px">
                <MenuItem onClick={onOpen}>
                  <Flex align="center" gap="3">
                    <Icon as={FaUserCog} color="red" />
                    Profile
                  </Flex>
                </MenuItem>
                {(type === 'admin' || type === 'socialworker') && (
                  <MenuItem onClick={onOpenWebsiteMenu}>
                    <Flex align="center" gap="3">
                      <Icon as={FaGlobe} color="red" />
                      Update Website
                    </Flex>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    cookie.remove('token');
                    router.push('/login');
                  }}
                >
                  <Flex align="center" gap="3">
                    <Icon as={AiOutlineLogout} color="red" />
                    Log out
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default React.memo(Navbar);
