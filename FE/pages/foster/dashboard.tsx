import React, { ReactElement } from 'react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import { thinnerScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import { getAllVisitationForUser } from '@/services/user.service';
import FosterDashboard from '@/components/global/FosterDashboard';
import jwt_decode from 'jwt-decode';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  const { userId }: { userId: string } = jwt_decode(token);
  const { data: visits } = await getAllVisitationForUser({ user_id: userId });
  console.log(visits);
  return {
    props: { visits }, // will be passed to the page component as props
  };
}

const dashboard: NextPageWithLayout = ({ visits }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinnerScollbar}
      p="20px"
    >
      <FosterDashboard response={visits} />
    </Box>
  );
};

dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="foster">{page}</Layout>;
};
export default dashboard;
