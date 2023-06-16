import { Stack, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import React from 'react';

const Child = () => {
  return (
    <Stack>
      <FormControl>
        <FormLabel>DESCRIPTION OF THE CHILD UPON ADMISSION.</FormLabel>
        <Textarea placeholder="..." />
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>
      <FormControl>
        <FormLabel>DEVELOPMENTAL HISTORY OF THE CHILD</FormLabel>
        <Textarea placeholder="..." />
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>
      <FormControl>
        <FormLabel>DESCRIPTION OF THE CHILD’S PRESENT ENVIRONMENT.</FormLabel>
        <Textarea placeholder="..." />
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>
    </Stack>
  );
};

export default Child;
