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
import { SlOptionsVertical } from 'react-icons/sl';
import Pagination from '@/components/global/Pagination';
import AddUser from './AddUser';
import Delete from '@/components/global/Delete';
import { removeUser } from '@/services/user.service';
import { useRouter } from 'next/router';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate, GrFormView } from 'react-icons/gr';

const TableAccounts = ({ users, search, userType }: any) => {
  console.log(users);

  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const [userDeleteId, setUserDeleteId] = useState<string>('');
  const [selectedUpdate, setSelectedUpdate] = useState();
  const [type, setType] = useState('');
  //delete dialog
  const confirmDelete = async (confirm: boolean) => {
    if (confirm) {
      const response = await removeUser({ id: userDeleteId });
      if (response.success) toastUI(1, response.message, 'Orphan Deleted');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
    }
  };

  //delete
  const deleteAccount = (id: string) => {
    setUserDeleteId(id);
    onOpenDelete();
  };

  //Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = users.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(users.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % users.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [users]);

  //update
  const handleUpdate = (data: any) => {
    setType('update');
    setSelectedUpdate(data);
    onOpen();
  };

  //view
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
      <AddUser {...{ isOpen, onClose, selectedUpdate, type }} />
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete User"
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
          {!users.length && <TableCaption>No Accounts</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th w="35%" fontWeight="bolder">
                Profile
              </Th>
              <Th fontWeight="bolder">Email </Th>
              <Th fontWeight="bolder">Date Added</Th>
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
                  <Td>
                    <Flex>
                      <Avatar src="" name={currentItem.email} />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {currentItem.username}
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
                  <Td fontWeight="bold">{currentItem.email}</Td>
                  <Td fontWeight="bold">{currentItem.date_added}</Td>
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
                        <MenuItem
                          minH="40px"
                          onClick={() => handleUpdate(currentItem)}
                        >
                          <Flex align="center" gap="3">
                            <Icon as={GrUpdate} />
                            Update
                          </Flex>
                        </MenuItem>
                        {userType === 'admin' && (
                          <MenuItem
                            minH="40px"
                            onClick={() => deleteAccount(currentItem.id)}
                          >
                            <Flex align="center" gap="3">
                              <Icon as={FcDeleteDatabase} />
                              Delete
                            </Flex>
                          </MenuItem>
                        )}
                        <MenuItem
                          minH="40px"
                          onClick={() => handleView(currentItem)}
                        >
                          <Flex align="center" gap="3">
                            <Icon as={GrFormView} boxSize={4} />
                            View Profile
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
        {!!users.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!users.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default TableAccounts;
