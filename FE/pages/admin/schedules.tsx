import { thinScollbar } from '@/components/Scrollbar';
import Schedules from '@/components/admin/schedules';
import { allSchedule } from '@/services/user.service';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import React, { ReactElement } from 'react';
export async function getServerSideProps() {
  const { data } = await allSchedule();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
const schedules = ({ data }: any) => {
  console.log(data);

  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Schedules schedules={data} />
    </Box>
  );
};
schedules.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="admin">{page}</Layout>;
};

export default schedules;
