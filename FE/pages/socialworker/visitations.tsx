import React, { ReactElement } from 'react';
import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
// import Visitations from '@/components/admin/visitations';
import { getAllVisit } from '@/services/user.service';
import Visitations from '@/components/socialworker/visitations';

export async function getServerSideProps() {
  const { data: visits } = await getAllVisit();
  return {
    props: { visits }, // will be passed to the page component as props
  };
}
const visitations: NextPageWithLayout = ({ visits }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Visitations visits={visits} />
    </Box>
  );
};

visitations.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="socialworker">{page}</Layout>;
};

export default visitations;
