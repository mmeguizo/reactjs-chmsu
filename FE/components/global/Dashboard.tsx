import {
  Flex,
  Stack,
  Text,
  Icon,
  Box,
  Grid,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { IoIosPeople } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';
import PdfDownload from './PdfDownload';

type TDashboard = {
  icon: any;
  title: string;
  total: number;
};

const Card = ({ icon, title, total }: TDashboard) => {
  return (
    <>
      <Flex
        bg="#0093E9"
        h="100px"
        m="5"
        borderRadius="5"
        bgImage="linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
        transition="all 0.5s ease"
        _hover={{
          transform: 'scale(1.1)',
          cursor: 'pointer',
        }}
      >
        <Box p="4">
          <Text fontWeight="bold" fontSize="20" color="white">
            {title?.toUpperCase() || ''}
          </Text>
        </Box>
        <Flex flexGrow="1" align="flex-end" justify="end" p="5" gap="2">
          <Icon as={icon} h="30px" w="30px" color="white" />
          <Text fontWeight="bold" fontSize="32" color="white">
            {total}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

const Dashboard = ({ response }: any) => {
  const {
    isOpen: isOpenDownload,
    onOpen: onOpenDownload,
    onClose: onCloseDownload,
  } = useDisclosure();
  return (
    <>
      <PdfDownload {...{ isOpenDownload, onCloseDownload }} />
      <Button onClick={() => onOpenDownload()} aria-label="Add">
        Download PDF
      </Button>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
      >
        <Card
          icon={IoIosPeople}
          title={response[0].name}
          total={response[0].total}
        />
        <Card
          icon={IoIosPeople}
          title={response[1].name}
          total={response[1].total}
        />
        <Card
          icon={IoIosPeople}
          title={response[2].name}
          total={response[2].total}
        />
        <Card
          icon={IoIosPeople}
          title={response[3].name}
          total={response[3].total}
        />
        <Card
          icon={FaHome}
          title={response[4].name}
          total={response[4].total}
        />
        <Card
          icon={FaHome}
          title={response[5].name}
          total={response[5].total}
        />
      </Grid>
    </>
  );
};

export default Dashboard;
