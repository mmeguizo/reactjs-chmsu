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
import Delete from '@/components/global/Delete';
import { removeUser } from '@/services/user.service';
import { useRouter } from 'next/router';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate, GrFormView } from 'react-icons/gr';
import AddSchedule from './AddSchedule';

const ScheduleTable = ({ schedules, search, userType }: any) => {
  console.log(schedules);

  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const [deleteSched, setDeleteSched] = useState<string>('');
  const [selectedUpdate, setSelectedUpdate] = useState();
  const [type, setType] = useState('add');
  //delete dialog
  const confirmDelete = async (confirm: boolean) => {
    console.log(confirm);

    if (confirm) {
      // const response = await removeUser({ id: userDeleteId });
      // if (response.success) toastUI(1, response.message, 'Orphan Deleted');
      // else toastUI(2, response.message, 'Someting went wrong');
      // router.replace(router.asPath);
    }
  };

  //delete
  const deleteAccount = (id: string) => {
    setDeleteSched(id);
    onOpenDelete();
  };

  //Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = schedules.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(schedules.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % schedules.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [schedules]);

  //update
  const handleUpdate = (data: any) => {
    setType('update');
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
      <AddSchedule {...{ isOpen, onClose, selectedUpdate, type }} />
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete Schedule"
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
          {!schedules.length && <TableCaption>No Accounts</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Name</Th>
              <Th fontWeight="bolder">Shcedule </Th>
              <Th fontWeight="bolder">Schedule Date</Th>
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
                    <Flex align="center">
                      <Avatar src="" name={currentItem.volunteers} />
                      <Box ml="3">
                        <Text fontWeight="bold">{currentItem.volunteers}</Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td fontWeight="bold">{currentItem.schedule}</Td>
                  <Td fontWeight="bold">{currentItem.schedule_date}</Td>

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
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Box mt="4" />
        {!!schedules.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!schedules.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default ScheduleTable;
