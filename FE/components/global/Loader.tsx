import React from 'react';
import { ILoader } from '@/services/types';
import { Spinner } from '@chakra-ui/react';
const Loader = ({ size, color, thickness }: ILoader) => {
  return (
    <Spinner
      thickness={thickness}
      speed="0.65s"
      emptyColor="gray.200"
      color={color}
      boxSize={size}
    />
  );
};

export default Loader;
