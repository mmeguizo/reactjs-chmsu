import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import VolunteerSideMenu from '../styles/volunteer/VolunteerSideMenu';

const UserVolunteer = ({ isOpenMenu, onCloseMenu, btnRefMenu }: any) => {
  const closeDrawer = (close: boolean) => {
    if (close) onCloseMenu();
  };
  return (
    <Drawer
      isOpen={isOpenMenu}
      placement="left"
      onClose={onCloseMenu}
      finalFocusRef={btnRefMenu}
    >
      <DrawerOverlay />

      <DrawerContent bg="#363740" display={{ base: 'block', lg: 'none' }}>
        <DrawerCloseButton color="white" />
        <DrawerBody p="0" m="0">
          <VolunteerSideMenu closeDrawer={closeDrawer} type="mobile" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserVolunteer;
