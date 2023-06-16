// import Pagination from '@/components/global/Pagination';
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
import { SlOptionsVertical } from 'react-icons/sl';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrFormView } from 'react-icons/gr';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/global/Pagination';
import { Capitalize } from '@/services/helpers';
import Delete from '@/components/global/Delete';
import ReadModal from './ReadModal';
import { updateStatusInquiry, inquiryDelete } from '@/services/user.service';
import { useRouter } from 'next/router';

const InqueryTable = ({ allInquery, search }: any) => {
  const toast = useToast();
  const router = useRouter();
  const cancelRef = React.useRef();
  // const [orphanDeleteId, setOrphanDeleteId] = useState<string>('');
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [messageData, setMessageData] = useState();
  const [deleteId, setDeleteId] = useState('');
  //Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = allInquery.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allInquery.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % allInquery.length;
    setItemOffset(newOffset);
  };
  useEffect(() => {
    setItemOffset(0);
  }, [allInquery]);

  //delete dialog
  const confirmDelete = async (confirm: boolean) => {
    if (confirm) {
      await inquiryDelete({ id: deleteId });
      router.replace(router.asPath);

      toastUI(1, 'Inquiry Deleted Successfully', 'Success');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    onOpenDelete();
  };
  const viewMessage = (data: any) => {
    setMessageData(data);
    onOpen();
  };

  const setMessageToRead = async (id: string) => {
    allInquery.map((inquery: any) =>
      inquery.id === id ? (inquery.read = true) : null,
    );
    const payload = {
      id,
      read: true,
    };
    await updateStatusInquiry(payload);
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
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete Inquiry"
        {...{
          cancelRef,
          confirmDelete,
        }}
      />
      <ReadModal {...{ isOpen, onClose, messageData, setMessageToRead }} />
      <TableContainer p="30px" shadow="xl" borderRadius="md" mb="20px" w="100%">
        <Table variant="striped">
          {!allInquery.length && <TableCaption>No Accounts</TableCaption>}
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
              <Th fontWeight="bolder">Phone</Th>
              <Th fontWeight="bolder">Message</Th>
              <Th fontWeight="bolder">Date Added</Th>
              <Th></Th>
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
                      <Avatar src="" name={currentItem.name} />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {`${Capitalize(currentItem.name)}`}
                          <Badge
                            ml="1"
                            colorScheme={!currentItem.read ? 'red' : 'green'}
                            fontSize="10px"
                          >
                            {!currentItem.read ? 'unread' : 'read'}
                          </Badge>
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentItem.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td fontWeight="bold">{currentItem.phone}</Td>
                  <Td fontWeight="bold">
                    {currentItem.message.length > 15
                      ? `${currentItem.message.substring(0, 15)}...`
                      : currentItem.message}
                  </Td>
                  <Td fontWeight="bold">{currentItem.date_added}</Td>
                  <Td>
                    <Flex justify="center">
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
                          <MenuItem onClick={() => viewMessage(currentItem)}>
                            <Icon as={GrFormView} boxSize={4} />
                            View
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDelete(currentItem.id)}
                          >
                            <Flex align="center" gap="3">
                              <Icon as={FcDeleteDatabase} />
                              Delete
                            </Flex>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Box mt="4" />
        {/* Pagination */}
        {!!allInquery.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!allInquery.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default React.memo(InqueryTable);
