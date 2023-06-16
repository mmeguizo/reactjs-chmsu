import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuItem,
  MenuButton,
  IconButton,
  MenuList,
  useDisclosure,
  Flex,
  Avatar,
  Box,
  Text,
  Badge,
  TableCaption,
  useToast,
  Icon,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate } from 'react-icons/gr';
import { FaChild } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';

import { SlOptionsVertical } from 'react-icons/sl';
import Pagination from '@/components/global/Pagination';
import Delete from '@/components/global/Delete';
import { removeVisit, statusUpdate } from '@/services/user.service';
import { useRouter } from 'next/router';
import Update from '@/components/global/Update';
import AddVisitation from './AddVisitation';
import { Capitalize } from '@/services/helpers';
const VisitTable = ({ visits, search, userType }: any) => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userid, SetUserid] = useState('');
  const cancelRef = React.useRef();
  const cancelRefUpdate = React.useRef();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();

  const [userDeleteId, setUserDeleteId] = useState<string>('');
  const [selectedUpdate, setSelectedUpdate] = useState();
  const [type, setType] = useState('');
  //delete dialog
  const confirmDelete = async (confirm: boolean) => {
    if (confirm) {
      const response = await removeVisit({ id: userDeleteId });
      if (response.success) toastUI(1, response.message, 'Orphan Deleted');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
    }
  };

  const confirmUpdate = async (confirm: boolean) => {
    if (confirm) {
      const response = await statusUpdate({
        id: userid,
        status: 'approved',
      });
      if (response.success) toastUI(1, response.message, 'Visit confirmed');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
    }
  };
  //delete
  const deleteAccount = (objectId: string) => {
    setUserDeleteId(objectId);
    onOpenDelete();
  };

  //Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = visits.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(visits.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % visits.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [visits]);

  // //update
  const handleUpdate = (data: any) => {
    setType('update');
    setSelectedUpdate(data);
    onOpen();
  };

  // //view
  // const handleView = (data: any) => {
  //   setType('view');
  //   setSelectedUpdate(data);
  //   onOpen();
  // };

  const handleStatus = (id: string) => {
    SetUserid(id);
    onOpenUpdate();
  };

  const orphanSelect = (id: string, visitId: string) => {
    if (userType === 'admin') {
      router.push(
        { pathname: '/admin/childrens', query: { id, visitId } },
        '/admin/childrens',
      );
    } else {
      router.push(
        { pathname: '/socialworker/childrens', query: { id } },
        '/socialworker/childrens',
      );
    }
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
      {console.log({ userType: userType })}
      <AddVisitation {...{ isOpen, onClose, selectedUpdate, type }} />
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete Visit"
        {...{
          cancelRef,
          confirmDelete,
        }}
      />
      <Update
        isOpen={isOpenUpdate}
        onClose={onCloseUpdate}
        name="Update Visit"
        {...{
          cancelRefUpdate,
          confirmUpdate,
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
          {!visits.length && <TableCaption>No Visit</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Created By</Th>
              <Th fontWeight="bolder">Purpose</Th>
              <Th fontWeight="bolder">Orphan</Th>
              <Th fontWeight="bolder">Date added</Th>
              <Th w="5%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((currentItem: any, index: number) => {
              return (
                <Tr
                  key={index}
                  fontSize="12px"
                  color="gray"
                  fontStyle="normal"
                  letterSpacing="0.2"
                >
                  <Td>
                    <Flex align="center">
                      <Avatar src="" name={currentItem.users} />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {`${Capitalize(currentItem.users)}`}
                        </Text>
                        <Badge
                          colorScheme={
                            currentItem.status === 'pending'
                              ? 'red'
                              : currentItem.status === 'booked'
                              ? 'yellow'
                              : 'green'
                          }
                          fontSize="10px"
                        >
                          {currentItem.status}
                        </Badge>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>{currentItem.purpose}</Td>
                  <Td>
                    {currentItem.status === 'pending' ? (
                      <Badge ml="1" colorScheme="red" fontSize="10px">
                        {currentItem.status}
                      </Badge>
                    ) : (
                      <>{currentItem.orphan}</>
                    )}
                  </Td>
                  <Td>{currentItem.date_added}</Td>
                  <Td>
                    {/* {userType === 'foster' ? (
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
                          <MenuItem>Update</MenuItem>
                        </MenuList>
                      </Menu>
                    ) : ( */}
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
                        <MenuItem onClick={() => handleUpdate(currentItem)}>
                          <Flex align="center" gap="3">
                            <Icon as={GrUpdate} />
                            Update
                          </Flex>
                        </MenuItem>

                        {userType === 'admin' && (
                          <MenuItem
                            onClick={() => deleteAccount(currentItem.id)}
                          >
                            <Flex align="center" gap="3">
                              <Icon as={FcDeleteDatabase} />
                              Delete
                            </Flex>
                          </MenuItem>
                        )}
                        {currentItem.status === 'pending' &&
                          userType !== 'foster' && (
                            <MenuItem
                              onClick={() => handleStatus(currentItem.id)}
                            >
                              <Flex align="center" gap="3">
                                <Icon as={GiConfirmed} />
                                Confirm Visit
                              </Flex>
                            </MenuItem>
                          )}

                        {currentItem.status === 'approved' &&
                          userType !== 'foster' && (
                            <MenuItem
                              onClick={() =>
                                orphanSelect(
                                  currentItem.user_id,
                                  currentItem.id,
                                )
                              }
                            >
                              <Flex align="center" gap="3">
                                <Icon as={FaChild} color="red" />
                                Select Orphan
                              </Flex>
                            </MenuItem>
                          )}
                      </MenuList>
                    </Menu>
                    {/* )} */}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Box mt="4" />
        {!!visits.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!visits.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default VisitTable;
