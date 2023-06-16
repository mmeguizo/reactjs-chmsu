import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  TableContainer,
  useToast,
  Icon,
} from '@chakra-ui/react';
import ServiceModal from './ServiceModal';
import AgencyModal from './AgencyModal';
import { addWebsiteService, getlatestData } from '@/services/user.service';
import { AiFillDelete } from 'react-icons/ai';

const WebsiteDrawer = ({
  isOpenWebsiteMenu,
  onCloseWebsiteMenu,
  btnRefWebsite,
}: any) => {
  const [allServices, setAllServices] = useState<any>([]);
  const [allAgency, setAllAgency] = useState<any>([]);
  const [information, setInformation] = useState('');
  const [contact_number, setContact_number] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const toast = useToast();

  const {
    isOpen: isOpenService,
    onOpen: onOpenService,
    onClose: onCloseService,
  } = useDisclosure();
  const {
    isOpen: isOpenAgency,
    onOpen: onOpenAgency,
    onClose: onCloseAgency,
  } = useDisclosure();

  const service = () => {
    onOpenService();
  };
  const addService = (params: any) => {
    setAllServices((prev: any) => [...prev, params]);
  };

  const agency = () => {
    onOpenAgency();
  };

  const addAgency = (params: any) => {
    setAllAgency((prev: any) => [...prev, params]);
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

  const onSubmit = async (data: any) => {
    data.preventDefault();
    try {
      const payload = {
        services: allServices,
        trusted_agency: allAgency,
        information,
        contact_number,
        email,
        address,
      };
      await addWebsiteService(payload);
      toastUI(1, 'Website successfully updated', 'Success');
      onCloseWebsiteMenu();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { landingPageData }: { landingPageData: any } =
        await getlatestData();

      setAllServices(landingPageData.services);
      setAllAgency(landingPageData.trusted_agency);
      setInformation(landingPageData.information);
      setContact_number(landingPageData.contact_number);
      setEmail(landingPageData.email);
      setAddress(landingPageData.address);
    })();
  }, []);

  const handleDeleteService = (id: any) => {
    setAllServices(
      allServices.filter((service: any, index: any) => {
        return index !== id;
      }),
    );
  };

  const handleDeleteAgency = (id: any) => {
    setAllAgency(
      allAgency.filter((service: any, index: any) => {
        return index !== id;
      }),
    );
  };

  return (
    <>
      <ServiceModal {...{ isOpenService, onCloseService, addService }} />
      <AgencyModal {...{ isOpenAgency, onCloseAgency, addAgency }} />
      <Drawer
        isOpen={isOpenWebsiteMenu}
        placement="right"
        onClose={onCloseWebsiteMenu}
        finalFocusRef={btnRefWebsite}
      >
        <DrawerOverlay />
        <form onSubmit={onSubmit}>
          <DrawerContent maxW="700px">
            <DrawerCloseButton />
            <DrawerHeader>Update Website</DrawerHeader>
            <DrawerBody>
              <Stack gap="5">
                <FormControl>
                  <FormLabel>Information</FormLabel>
                  <Input
                    type="text"
                    placeholder="Information"
                    value={information}
                    onChange={(e: any) => setInformation(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contact Number</FormLabel>
                  <Input
                    type="text"
                    placeholder="Contact Number"
                    value={contact_number}
                    onChange={(e: any) => setContact_number(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel> Email</FormLabel>
                  <Input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e: any) => setAddress(e.target.value)}
                  />
                </FormControl>
              </Stack>

              <Stack mt="10">
                <Text fontWeight="bold" mt={5}>
                  Services we offer
                </Text>
                <ServiceTable
                  allServices={allServices}
                  handleDeleteService={handleDeleteService}
                />
              </Stack>
              <Stack mt="10">
                <Text fontWeight="bold" mt={5}>
                  Agencies
                </Text>

                <AgencyTable
                  allAgency={allAgency}
                  handleDeleteAgency={handleDeleteAgency}
                />
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onCloseWebsiteMenu}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={service} mr={3}>
                Add Service
              </Button>
              <Button colorScheme="blue" onClick={agency} mr={3}>
                Add Agency
              </Button>
              <Button colorScheme="blue" type="submit">
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};

const ServiceTable = ({ allServices, handleDeleteService }: any) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Services</Th>
            <Th>Message</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {allServices.map((service: any, index: number) => {
            return (
              <Tr key={index}>
                <Td>{service.name}</Td>
                <Td>{service.value}</Td>
                <Td>
                  <Icon
                    onClick={() => handleDeleteService(index)}
                    as={AiFillDelete}
                    color="red"
                    _hover={{
                      cursor: 'pointer',
                      shadow: 'md',
                      transition: 'all .5s ease',
                    }}
                    transition="all .5s ease"
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const AgencyTable = ({ allAgency, handleDeleteAgency }: any) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Agency</Th>
            <Th>Message</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {allAgency.map((agency: any, index: number) => {
            return (
              <Tr key={index}>
                <Td>{agency.name}</Td>
                <Td>{agency.value}</Td>
                <Td>
                  <Icon
                    onClick={() => handleDeleteAgency(index)}
                    as={AiFillDelete}
                    color="red"
                    _hover={{
                      cursor: 'pointer',
                      shadow: 'md',
                      transition: 'all .5s ease',
                    }}
                    transition="all .5s ease"
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default WebsiteDrawer;
