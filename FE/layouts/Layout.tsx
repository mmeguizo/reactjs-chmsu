import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Navbar from '@/components/styles/Navbar';
import AdminSideMenu from '@/components/styles/admin/AdminSideMenu';
import FosterSideMenu from '@/components/styles/foster/FosterSideMenu';
import SocialWorkerSideMenu from '@/components/styles/socialworker/SocialWorkerSideMenu';
import { thinScollbar } from '@/components/Scrollbar';
import VolunteerSideMenu from '@/components/styles/volunteer/VolunteerSideMenu';

export default function Layout({ type, children }: any) {
  return (
    <>
      <Container
        p="0"
        m="0"
        maxW="none"
        h="100vh"
        overflowX="hidden"
        overflowY="hidden"
      >
        <Navbar type={type} />
        <Flex p={0} h="100vh" w="100vw">
          <Box display={{ base: 'none', lg: 'block' }}>
            {type === 'admin' && <AdminSideMenu />}
            {type === 'foster' && <FosterSideMenu />}
            {type === 'socialworker' && <SocialWorkerSideMenu />}
            {type === 'volunteer' && <VolunteerSideMenu />}
          </Box>

          <Flex h="90vh" w="100%" overflow="scroll hidden" sx={thinScollbar}>
            {children}
          </Flex>
        </Flex>
      </Container>
    </>
  );
}
