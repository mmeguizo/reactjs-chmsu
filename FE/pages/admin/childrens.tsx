import React, { ReactElement } from 'react';
import Childrens from '@/components/admin/children';
import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import { allOrphans } from '@/services/orphans.service';
import Head from 'next/head';

export async function getServerSideProps() {
  const { orphan } = await allOrphans();
  const activeOrphan = orphan.filter((orp: any) => orp.status === 'active');

  return {
    props: { activeOrphan }, // will be passed to the page component as props
  };
}
const children: NextPageWithLayout = ({ activeOrphan }: any) => {
  return (
    <>
      <Head>
        <title>Childrens</title>
      </Head>
      <Box
        w="100%"
        h="90vh"
        overflowY="auto"
        mx="20px"
        sx={thinScollbar}
        p="20px"
      >
        <Childrens orphans={activeOrphan} />
      </Box>
    </>
  );
};

children.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="admin">{page}</Layout>;
};

export default children;
