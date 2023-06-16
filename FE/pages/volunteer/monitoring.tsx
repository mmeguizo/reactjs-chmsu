import Monitoring from '@/components/admin/monitoring';
import { thinScollbar } from '@/components/Scrollbar';
import { getAllOrphans } from '@/services/user.service';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import React, { ReactElement } from 'react';

export async function getServerSideProps() {
  const { data } = await getAllOrphans();

  return {
    props: { monitoring: data }, // will be passed to the page component as props
  };
}
const monitoring = (monitoring: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Monitoring data={monitoring} userType="volunteer" />
    </Box>
  );
};
monitoring.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="volunteer">{page}</Layout>;
};

export default monitoring;
