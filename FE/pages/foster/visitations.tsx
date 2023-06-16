import React, { ReactElement } from 'react';
import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import { getAllVisit, getAllVisitationForUser } from '@/services/user.service';
import Visitations from '@/components/foster/visitations';
import jwt_decode from 'jwt-decode';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  const { userId }: { userId: string } = jwt_decode(token);
  const { data: visits } = await getAllVisitationForUser({ user_id: userId });

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
  return <Layout type="foster">{page}</Layout>;
};

export default visitations;
