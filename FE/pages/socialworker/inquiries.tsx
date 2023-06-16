import Inquiries from '@/components/admin/inquiries';
import { thinScollbar } from '@/components/Scrollbar';
import { allInqueries } from '@/services/user.service';
import { Box } from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import { NextPageWithLayout } from 'pages/_app';
import React, { ReactElement } from 'react';

export async function getServerSideProps() {
  const { inquiryData } = await allInqueries();

  return {
    props: { inquiryData }, // will be passed to the page component as props
  };
}
const inquiries: NextPageWithLayout = ({ inquiryData }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <Inquiries inquery={inquiryData} />
    </Box>
  );
};

inquiries.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="socialworker">{page}</Layout>;
};
export default inquiries;
