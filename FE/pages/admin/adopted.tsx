import React, { ReactElement } from 'react';
import Childrens from '@/components/admin/children';
import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import { allAdoptedOrphan } from '@/services/orphans.service';
import Head from 'next/head';

export async function getServerSideProps() {
  const { orphan } = await allAdoptedOrphan();
  const adoptedOrphan = orphan.filter((orp: any) => orp.status === 'adopted');
  return {
    props: { adoptedOrphan }, // will be passed to the page component as props
  };
}
const adopted: NextPageWithLayout = ({ adoptedOrphan }: any) => {
  return (
    <>
      <Head>
        <title>Adopted Childrens</title>
      </Head>
      <Box
        w="100%"
        h="90vh"
        overflowY="auto"
        mx="20px"
        sx={thinScollbar}
        p="20px"
      >
        <Childrens orphans={adoptedOrphan} />
      </Box>
    </>
  );
};

adopted.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="admin">{page}</Layout>;
};

export default adopted;
