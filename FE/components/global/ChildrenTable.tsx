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
import { LOCALDEV } from '@/services/endpoint';
import { SlOptionsVertical } from 'react-icons/sl';
import { FcDeleteDatabase } from 'react-icons/fc';
import { GrUpdate, GrFormView, GrSelect } from 'react-icons/gr';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/global/Pagination';
import moment from 'moment';
import { Capitalize } from '@/services/helpers';
import Delete from '@/components/global/Delete';
import AddOrphan from './AddOrphan';
import { removeOrphan } from '@/services/orphans.service';
import { useRouter } from 'next/router';
import { selectOrphanWithVisit } from '@/services/user.service';

const ChildrenTable = ({ orphans, search, userId, userType, VisitId }: any) => {
  const router = useRouter();
  const toast = useToast();

  const cancelRef = React.useRef();
  const [orphanDeleteId, setOrphanDeleteId] = useState<string>('');
  const [type, setType] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUpdate, setSelectedUpdate] = useState();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  //Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = orphans.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(orphans.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % orphans.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [orphans]);

  //delete dialog
  const confirmDelete = async (confirm: boolean) => {
    if (confirm) {
      const response = await removeOrphan({ id: orphanDeleteId });
      if (response.success) toastUI(1, response.message, 'Orphan Deleted');
      else toastUI(2, response.message, 'Someting went wrong');
      router.replace(router.asPath);
    }
  };

  //delete
  const deleteAccount = (objectId: string) => {
    setOrphanDeleteId(objectId);
    onOpenDelete();
  };

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

  const selectOrphan = async (orpanId: string, status: string) => {
    try {
      if (status === 'adopted') {
        toastUI(2, 'Orphan is already adopted', 'Adopted');
        return;
      }
      const res = await selectOrphanWithVisit({
        id: VisitId,
        orphan_id: orpanId,
      });
      console.log(res);

      toastUI(1, 'Selected Success', 'Success');
      if (userType === 'admin') router.push('/admin/visitations');
      else router.push('/socialworker/visitations');
    } catch (error) {
      console.log(error);
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
      <AddOrphan {...{ isOpen, onClose, selectedUpdate, type }} />
      <Delete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        name="Delete Orphan"
        {...{
          cancelRef,
          confirmDelete,
        }}
      />
      <TableContainer p="30px" shadow="xl" borderRadius="md" mb="20px" w="100%">
        <Table variant="striped">
          {!orphans.length && <TableCaption>No Accounts</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Profile</Th>
              <Th fontWeight="bolder">Adopted By</Th>
              <Th fontWeight="bolder">Gender</Th>
              <Th fontWeight="bolder">Date of birth</Th>
              <Th fontWeight="bolder">Date of Admission</Th>
              <Th fontWeight="bolder">Date surrendered</Th>
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
                      <Avatar
                        src={`${LOCALDEV}/images/${currentItem.avatar}`}
                        name={currentItem.firstname}
                      />
                      <Box ml="3">
                        <Text fontWeight="bold">
                          {`${Capitalize(currentItem.firstname)} ${Capitalize(
                            currentItem.lastname,
                          )}`}
                          <Badge
                            ml="1"
                            colorScheme={
                              currentItem.status === 'active' ? 'green' : 'red'
                            }
                            fontSize="10px"
                          >
                            {currentItem.status === 'active'
                              ? 'active'
                              : 'adopted'}
                          </Badge>
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {` ${currentItem.age} ${
                            currentItem.age <= 1 ? 'year' : 'years'
                          } old`}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td fontWeight="bold">{currentItem?.foster}</Td>
                  <Td fontWeight="bold">
                    {currentItem.gender ? currentItem.gender : ''}
                  </Td>
                  <Td fontWeight="bold">
                    {currentItem.dob
                      ? moment(currentItem.dob).format('MMM DD YYYY')
                      : ''}
                  </Td>
                  <Td fontWeight="bold">
                    {currentItem.dob
                      ? moment(currentItem.date_admission).format('MMM DD YYYY')
                      : ''}
                  </Td>
                  <Td fontWeight="bold">
                    {currentItem.dob
                      ? moment(currentItem.date_surrendered).format(
                          'MMM DD YYYY',
                        )
                      : ''}
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
                        <>
                          {VisitId ? (
                            <MenuItem
                              onClick={() =>
                                selectOrphan(currentItem.id, currentItem.status)
                              }
                            >
                              <Flex align="center" gap="3">
                                <Icon as={GrSelect} />
                                Select
                              </Flex>
                            </MenuItem>
                          ) : (
                            <>
                              <MenuItem
                                onClick={() => handleUpdate(currentItem)}
                              >
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
                              <MenuItem onClick={() => handleView(currentItem)}>
                                <Flex align="center" gap="3">
                                  <Icon as={GrFormView} boxSize="4" />
                                  View Profile
                                </Flex>
                              </MenuItem>
                            </>
                          )}
                        </>
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
        {!!orphans.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!orphans.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default React.memo(ChildrenTable);
