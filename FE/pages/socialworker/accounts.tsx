import { thinScollbar } from '@/components/Scrollbar';
import Accounts from '@/components/socialworker/accounts';
import { allUser } from '@/services/user.service';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import React, { ReactElement } from 'react';

export async function getServerSideProps() {
  const { user: users } = await allUser();
  return {
    props: { users }, // will be passed to the page component as props
  };
}
const accounts: NextPageWithLayout = ({ users }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Accounts users={users} />
    </Box>
  );
};

accounts.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="socialworker">{page}</Layout>;
};
export default accounts;
