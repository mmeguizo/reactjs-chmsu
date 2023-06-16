import Delete from '@/components/global/Delete';
import Pagination from '@/components/global/Pagination';
import { deleteMonitoring } from '@/services/endpoint';
import { Capitalize } from '@/services/helpers';
import { deleteMonitor } from '@/services/user.service';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate, GrFormView } from 'react-icons/gr';
import moment from 'moment';

import {
  Avatar,
  Box,
  Flex,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  TableContainer,
  useDisclosure,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';
import AddMonitor from '@/components/global/AddMonitor';

const MonitorTable = ({ allMonitor, search, userType }: any) => {
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [userDeleteId, setUserDeleteId] = useState<string>('');
  const router = useRouter();
  const toast = useToast();
  const [selectedUpdate, setSelectedUpdate] = useState();
  const [type, setType] = useState('');

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = allMonitor.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allMonitor.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % allMonitor.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [allMonitor]);

  const deleteMonitoring = async (id: string) => {
    setUserDeleteId(id);
    onOpenDelete();
  };

  const confirmDelete = async (confirm: boolean) => {
    if (confirm) {
      const response = await deleteMonitor({ id: userDeleteId });
      if (response.success) toastUI(1, response.message, 'Orphan Deleted');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
    }
  };

  const handleUpdate = (data: any) => {
    setType('update');
    setSelectedUpdate(data);
    onOpen();
  };

  const handleView = (data: any) => {
    setType('view');
    setSelectedUpdate(data);
    onOpen();
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
      <AddMonitor {...{ isOpen, onClose, selectedUpdate }} type={type} />
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete Monitoring"
        {...{
          cancelRef,
          confirmDelete,
        }}
      />
      <TableContainer
        maxWidth="100%"
        p="30px"
        shadow="xl"
        borderRadius="md"
        mb="20px"
      >
        <Table variant="striped">
          {!allMonitor.length && <TableCaption>No History</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Added By</Th>
              <Th fontWeight="bolder">Orphan</Th>
              <Th fontWeight="bolder">Meal</Th>
              {/* <Th fontWeight="bolder">Daily Health</Th> */}
              <Th fontWeight="bolder">Date Added </Th>
              <Th w="5%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((currentItem: any) => {
              return (
                <Tr
                  key={currentItem._id}
                  fontSize="12px"
                  color="gray"
                  fontStyle="normal"
                  letterSpacing="0.2"
                >
                  <Td fontWeight="bold">
                    <Flex>
                      <Avatar src="" name={currentItem.addedByName} />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {`${Capitalize(currentItem.addedByName)}`}
                          <Badge
                            ml="1"
                            colorScheme={
                              currentItem.status === 'active' ? 'green' : 'red'
                            }
                            fontSize="10px"
                          >
                            {currentItem.status === 'active'
                              ? 'active'
                              : 'inactive'}
                          </Badge>
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentItem.role}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td fontWeight="bold">{currentItem.orphanName}</Td>

                  <Td fontWeight="bold">{currentItem.meal}</Td>
                  {/* <Td fontWeight="bold">{currentItem.daily_health}</Td> */}
                  <Td fontWeight="bold">
                    {moment(new Date(currentItem.date))
                      .utc()
                      .format('MMMM D YYYY')}
                  </Td>

                  <Td>
                    <Menu>
                      <MenuButton
                        _hover={{
                          cursor: 'pointer',
                          shadow: 'md',
                          bg: 'main',
                          transition: 'all .5s ease',
                        }}
                        transition="all .5s ease"
                        bg="transparent"
                        borderRadius="full"
                        as={IconButton}
                        aria-label="Options"
                        icon={<SlOptionsVertical />}
                      ></MenuButton>
                      <MenuList minWidth="180px">
                        {userType === 'admin' && (
                          <MenuItem
                            onClick={() => deleteMonitoring(currentItem.id)}
                          >
                            <Flex align="center" gap="3">
                              <Icon as={FcDeleteDatabase} />
                              Delete
                            </Flex>
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => handleUpdate(currentItem)}>
                          <Flex align="center" gap="3">
                            <Icon as={GrUpdate} />
                            Update
                          </Flex>
                        </MenuItem>
                        <MenuItem onClick={() => handleView(currentItem)}>
                          <Flex align="center" gap="3">
                            <Icon as={GrFormView} boxSize={4} />
                            View
                          </Flex>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Box mt="4" />
        {/* Pagination */}
        {!!allMonitor.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!allMonitor.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default MonitorTable;
