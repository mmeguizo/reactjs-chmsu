import { Flex, Text, Button } from '@chakra-ui/react';
import React from 'react';

const SponsorSection = () => {
  return (
    <>
      <Flex
        direction="column"
        gap="100px"
        pt="50px"
        justify="center"
        align="center"
        id="section2"
      >
        <Text fontFamily="robo" fontSize="50px" fontWeight="extranormal">
          Lorem ipsum dolor sit amet
        </Text>
        <Text
          w="500px"
          fontFamily="robo"
          fontSize="Header.xs"
          fontWeight="300"
          align="center"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod
          tempor
        </Text>
        {/* <Button
          w="200px"
          h="50px"
          borderRadius="full"
          bg="black500"
          color="white"
          _hover={{
            color: 'black',
            bg: 'gray300',
            transform: 'scale(1.1)',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          Request
        </Button> */}
        <Text fontFamily="robo" fontWeight="extranormal" fontSize="30px">
          Our Sponsors
        </Text>
      </Flex>
    </>
  );
};

export default SponsorSection;
