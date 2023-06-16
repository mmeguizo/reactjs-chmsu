import { thinScollbar } from '@/components/Scrollbar';
import { Box } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import History from '@/components/admin/history';
import Layout from 'layouts/Layout';
import { histories } from '@/services/user.service';
// response
const history = () => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      Histories
      {/* <History histories={response.history} /> */}
    </Box>
  );
};

// export async function getStaticProps() {
//   const response = await histories();
//   return {
//     props: { response }, // will be passed to the page component as props
//     revalidate: 60, // will revalidate every 60 seconds in build
//   };
// }

history.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="admin">{page}</Layout>;
};

export default history;
