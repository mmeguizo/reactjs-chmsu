import React, { useState } from 'react';
import {
  Button,
  Box,
  Flex,
  Input,
  Text,
  Textarea,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  useToast,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { homeScrollbar } from '@/components/Scrollbar';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import ThirdSection from './ThirdSection';
import { inquiryAdd } from '@/services/user.service';
import SponsorSection from './SponsorSection';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { AiOutlineYoutube } from 'react-icons/ai';
import AboutUs from './AboutUs';

const Website = ({ allServices, allAgency }: any) => {
  const toast = useToast();
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    name: '',
    message: '',
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    await inquiryAdd(form);
    setForm({ email: '', phone: '', name: '', message: '' });
    setLoader(false);
    toastUI(1, 'Inquiry successfully sent', 'Success');
  };
  const toastUI = (type: number, description: string, title: string) => {
    toast({
      status: type == 1 ? 'success' : 'error',
      variant: 'left-accent',
      position: 'top-right',
      isClosable: true,
      title,
      description: `${description}`,
      duration: 5000,
    });
  };
  return (
    <>
      <Box
        h="100vh"
        overflowY="scroll"
        overflowX="hidden"
        scrollBehavior="smooth"
        sx={homeScrollbar}
        pos="relative"
        m="0"
        p="0"
        w="100vw"
      >
        <FirstSection />
        {allAgency.length > 0 && <SecondSection {...{ allAgency }} />}
        {allServices.length > 0 && <ThirdSection {...{ allServices }} />}
        {/* <SponsorSection />
        <ThirdSection resources={resources} /> */}
        <AboutUs />
        <Flex>
          <Flex
            w="100vw"
            justify="center"
            align="center"
            h="600px"
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: '10', lg: '0' }}
          >
            <Flex w="100%" maxH="800px">
              <Flex
                py="10"
                display="column"
                shadow="2xl"
                mx={{ base: '5%' }}
                px={{ base: '5%' }}
                w="inherit"
              >
                <Text fontSize="32px" fontWeight="bolder" align="center" mt="5">
                  Contact Us
                </Text>
                <Box>
                  <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="10" w="auto">
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
                          placeholder="Name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                          type="email"
                          placeholder="Email address"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          required
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone number</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+63</InputLeftAddon>
                          <Input
                            type="number"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            required
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          placeholder="Message"
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                          required
                        />
                      </FormControl>
                      <Button
                        mt="3"
                        type="submit"
                        isLoading={loader}
                        loadingText="Sending..."
                      >
                        Submit
                      </Button>
                    </Flex>
                  </form>
                </Box>
              </Flex>
            </Flex>
            <Flex w="100%" h="700px" id="contact">
              <iframe
                src="https://maps.google.com/maps?q=JW37+PW8,%20San%20Francisco%20St.%20San%20Sebastian%20Village,%20Brgy.%20Sum-Ag,%20Bacolod,%206100%20Negros%20Occidental&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                aria-hidden="false"
              ></iframe>
            </Flex>
          </Flex>
        </Flex>
        <Flex w="100%" h="10vh" bg="#22242A" mt="20">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="inherit"
            px="30px"
          >
            <Text color="white" fontSize="16px">
              © 2023 All Rights Reserved
            </Text>
            <HStack gap="3" mr="10">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={FiFacebook} color="gray.300" w={5} h={5} />
              </a>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Website;
