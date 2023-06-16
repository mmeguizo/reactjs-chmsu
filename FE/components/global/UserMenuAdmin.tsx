import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import AdminSideMenu from '../styles/admin/AdminSideMenu';

const UserMenuAdmin = ({ isOpenMenu, onCloseMenu, btnRefMenu }: any) => {
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
          <AdminSideMenu closeDrawer={closeDrawer} type="mobile" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserMenuAdmin;
