import Dashboard from '@/components/global/Dashboard';
import { thinnerScollbar } from '@/components/Scrollbar';
import { allCounts } from '@/services/user.service';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import React, { ReactElement } from 'react';

const dashboard: NextPageWithLayout = ({ response }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinnerScollbar}
      p="20px"
    >
      <Dashboard response={response} />
    </Box>
  );
};

export async function getStaticProps() {
  const response = await allCounts();
  return {
    props: { response }, // will be passed to the page component as props
    revalidate: 30, // will revalidate every 30 seconds in build
  };
}

dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="admin">{page}</Layout>;
};

export default dashboard;
