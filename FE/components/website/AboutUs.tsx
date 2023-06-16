import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';

const AboutUs = () => {
  return (
    <Flex
      direction="column"
      gap="30px"
      justify="center"
      align="center"
      id="about"
      h="500px"
      mb="200px"
    >
      <Text fontFamily="robo" fontSize="50px" fontWeight="extranormal">
        About Us
      </Text>
      <Text
        maxW="80vw"
        fontFamily="robo"
        fontSize="Header.xs"
        fontWeight="300"
        align="center"
      >
        A non-profit charitable institution established in 1978 for the
        orphaned, abandoned, neglected and destitute children aged between 0 and
        6. On the average, they have 30 to 35 children in care.
      </Text>
    </Flex>
  );
};

export default AboutUs;
