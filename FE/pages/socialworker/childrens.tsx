import React, { ReactElement } from 'react';
import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import { allOrphans } from '@/services/orphans.service';
import Childrens from '@/components/socialworker/children';

export async function getServerSideProps() {
  const { orphan } = await allOrphans();

  return {
    props: { orphan }, // will be passed to the page component as props
  };
}
const children: NextPageWithLayout = ({ orphan }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Childrens orphans={orphan} />
    </Box>
  );
};

children.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="socialworker">{page}</Layout>;
};

export default children;
