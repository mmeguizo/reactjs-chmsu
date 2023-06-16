import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { LOCALDEV } from '@/services/endpoint';

type ImageFile = {
  setImage: (image: any) => void;
  profileUrl?: string;
};
const ImageUpload = ({ setImage, profileUrl }: ImageFile) => {
  const [imagePreview, setImagePreview] = useState('');

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    } else {
      setImagePreview('');
      setImage(null);
    }
  };
  return (
    <Box>
      {imagePreview || profileUrl ? (
        <Flex alignItems="center" justifyContent="center">
          <Image
            src={
              imagePreview
                ? imagePreview
                : profileUrl
                ? LOCALDEV + '/images/' + profileUrl
                : ''
            }
            w="200px"
            h="200px"
          />
        </Flex>
      ) : (
        <Box borderWidth="1px" p={2} rounded="md">
          <Text textAlign="center">No image selected</Text>
        </Box>
      )}

      <FormControl mt={4}>
        <FormLabel>Select an image to upload</FormLabel>
        <input type="file" accept="image/*" onChange={handleFileSelect} />
      </FormControl>
    </Box>
  );
};

export default ImageUpload;
