import { Box, Collapse, Flex, Grid, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { thinnerScollbar } from '../Scrollbar';

const Card = ({ img, name, value }: any) => {
  const [show, SetShow] = useState(false);
  return (
    <Flex
      direction="column"
      w="400px"
      shadow="xl"
      pl="40px"
      pr="30px"
      gap="20px"
      h="450px"
      overflowY="scroll"
      overflowX="hidden"
      sx={thinnerScollbar}
      onClick={() => SetShow(!show)}
    >
      <Box mt="30px" />

      <Image src="mapcursor.png" alt="" w="50px" h="50px" />
      <Text>{name}</Text>
      <Text>{value}</Text>
      {/* <Collapse in={show}>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </Collapse> */}
      <Box mb="30px" />
    </Flex>
  );
};
const SecondSection = ({ allAgency }: any) => {
  return (
    <>
      <Text
        fontFamily="robo"
        fontWeight="bold"
        fontSize="30px"
        textAlign="center"
        mt="100"
        id="services"
      >
        Our Agencies
      </Text>
      <Flex
        justify="center"
        align="center"
        flexWrap="wrap"
        gap="20px"
        pt="50px"
        pb="100px"
      >
        {allAgency.map(({ img, name, value }: any, index: number) => {
          return (
            <Box key={index}>
              <Card {...{ img, name, value }} />
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

export default SecondSection;
