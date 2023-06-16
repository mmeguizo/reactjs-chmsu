import React, { useEffect, useState } from 'react';
import { Text, Flex, Icon } from '@chakra-ui/react';
import {
  MdOutlineDashboard,
  MdSchedule,
  MdManageAccounts,
} from 'react-icons/md';
import { useRouter } from 'next/router';
import { IoIosPeople } from 'react-icons/io';
import { hideScollbar } from '@/components/Scrollbar';
import { RiFileHistoryLine } from 'react-icons/ri';
import { BsQuestionSquareFill, BsClockFill } from 'react-icons/bs';

interface MenuProps {
  type?: string;
  closeDrawer?: any;
}
export default function SocialWorkerSideMenu({ type, closeDrawer }: MenuProps) {
  const [selectedMenu, setSelectedMenu] = useState(1);
  const router = useRouter();
  const routerChoice = [
    '/socialworker/dashboards',
    '/socialworker/accounts',
    '/socialworker/childrens',
    '/socialworker/visitations',
    '/socialworker/monitoring',
    '/socialworker/inquiries',
    '/socialworker/schedules',
  ];

  useEffect(() => {
    if (router.pathname === routerChoice[0]) setSelectedMenu(1);
    if (router.pathname === routerChoice[1]) setSelectedMenu(2);
    if (router.pathname === routerChoice[2]) setSelectedMenu(3);
    if (router.pathname === routerChoice[3]) setSelectedMenu(4);
    if (router.pathname === routerChoice[4]) setSelectedMenu(5);
    if (router.pathname === routerChoice[5]) setSelectedMenu(6);
    if (router.pathname === routerChoice[6]) setSelectedMenu(7);
  }, [router]);

  const mobileHandler = (status: boolean) => {
    if (status && type === 'mobile') closeDrawer(true);
    return;
  };

  const MenuOptions = ({ icon, title, isSelected, index, route }: any) => {
    return (
      <Flex
        _hover={{
          borderLeft: '5px solid white',
          cursor: 'pointer',
          bg: 'rgba(0, 0, 0, 0.5)',
          transition: 'all .5s ease',
          opacity: '1',
        }}
        onClick={() => {
          setSelectedMenu(index);
          router.push(route);
          mobileHandler(true);
        }}
        bg={isSelected && 'rgba(0, 0, 0, 0.5)'}
        borderLeft={isSelected && '5px solid white'}
        opacity={isSelected ? '1' : '.5'}
        transition="all .3s ease"
        align="center"
        gap="15px"
        h="56px"
      >
        <Icon as={icon} h="16px" w="16px" ml="20px" color="#DDE2FF" />
        <Text
          zIndex="9999"
          fontFamily="robo"
          fontSize="16px"
          fontWeight="normal"
          color="white"
        >
          {title}
        </Text>
      </Flex>
    );
  };

  return (
    <Flex
      minW="250px"
      h="90vh"
      bg="#363740"
      direction="column"
      overflowY="scroll"
      overflowX="hidden"
      sx={hideScollbar}
    >
      <Flex justify="center" align="start" gap="10px" py="30px" w="inherit">
        <Text
          fontFamily="robo"
          fontSize="15px"
          fontWeight="extrabold"
          color="white"
          pt="5px"
        >
          HOLY INFANT NURSERY
        </Text>
      </Flex>
      <Flex direction="column" mt="15px">
        <MenuOptions
          title="Dashboard"
          icon={MdOutlineDashboard}
          index={1}
          isSelected={selectedMenu == 1 ? true : false}
          route={routerChoice[0]}
        />
        <MenuOptions
          title="Accounts"
          icon={MdManageAccounts}
          index={2}
          isSelected={selectedMenu == 2 ? true : false}
          route={routerChoice[1]}
        />
        <MenuOptions
          title="Childrens"
          icon={IoIosPeople}
          index={3}
          isSelected={selectedMenu == 3 ? true : false}
          route={routerChoice[2]}
        />
        <MenuOptions
          title="Visitations"
          icon={MdSchedule}
          index={4}
          isSelected={selectedMenu == 4 ? true : false}
          route={routerChoice[3]}
        />
        <MenuOptions
          title="Monitoring"
          icon={RiFileHistoryLine}
          index={5}
          isSelected={selectedMenu == 5 ? true : false}
          route={routerChoice[4]}
        />
        <MenuOptions
          title="Inquiries"
          icon={BsQuestionSquareFill}
          index={6}
          isSelected={selectedMenu == 6 ? true : false}
          route={routerChoice[5]}
        />
        <MenuOptions
          title="Schedules"
          icon={BsClockFill}
          index={7}
          isSelected={selectedMenu == 7 ? true : false}
          route={routerChoice[6]}
        />
      </Flex>
    </Flex>
  );
}
