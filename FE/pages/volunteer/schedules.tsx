import { thinScollbar } from '@/components/Scrollbar';
import { schedById } from '@/services/user.service';
import {
  Avatar,
  Box,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import Layout from 'layouts/Layout';
import React, { ReactElement } from 'react';
import jwt_decode from 'jwt-decode';
import { Capitalize } from '@/services/helpers';

export async function getServerSideProps(context: any) {
  const { token } = context.req.cookies;
  const { userId }: { userId: string } = jwt_decode(token);
  const { data } = await schedById({ volunteer_id: userId });
  return {
    props: { data }, // will be passed to the page component as props
  };
}

const schedules = ({ data }: any) => {
  return (
    <Box
      w="100%"
      h="90vh"
      overflowY="auto"
      mx="20px"
      sx={thinScollbar}
      p="20px"
    >
      <TableContainer p="30px" shadow="xl" borderRadius="md" mb="20px" w="100%">
        <Table variant="striped">
          {!data.length && <TableCaption>No Schedule</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Volunteer Name</Th>
              <Th fontWeight="bolder">Schedule Date</Th>
              <Th fontWeight="bolder">Schedue Time</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((currentItem: any) => {
              return (
                <Tr
                  key={currentItem._id}
                  fontSize="12px"
                  color="gray"
                  fontStyle="normal"
                  letterSpacing="0.2"
                >
                  <Td>
                    <Flex>
                      <Avatar src="" name={currentItem.volunteers} />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {`${Capitalize(currentItem.volunteers)}`}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentItem.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td fontWeight="bold">{currentItem.schedule_date}</Td>
                  <Td fontWeight="bold">{currentItem.schedule}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
schedules.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="volunteer">{page}</Layout>;
};

export default schedules;
