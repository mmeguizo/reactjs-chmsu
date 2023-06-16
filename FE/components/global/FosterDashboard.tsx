import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import React from 'react';
import { IoIosPeople } from 'react-icons/io';

const FosterDashboard = ({ response }: any) => {
  return (
    <Flex
      bg="#0093E9"
      h="100px"
      m="5"
      borderRadius="5"
      w="25%"
      bgImage="linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
      transition="all 0.5s ease"
      _hover={{
        transform: 'scale(1.1)',
      }}
    >
      <Box p="4">
        <Text fontWeight="bold" fontSize="20" color="white">
          NO. OF VISITS
        </Text>
      </Box>
      <Flex flexGrow="1" align="flex-end" justify="end" p="5" gap="2">
        <Icon as={IoIosPeople} h="30px" w="30px" color="white" />
        <Text fontWeight="bold" fontSize="32" color="white">
          {response.length}
        </Text>
      </Flex>
    </Flex>
  );
};

export default FosterDashboard;
