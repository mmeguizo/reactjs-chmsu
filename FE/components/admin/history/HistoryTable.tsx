import Pagination from '@/components/global/Pagination';
import { Capitalize } from '@/services/helpers';
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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';

const HistoryTable = ({ allHistory, search }: any) => {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 10;
  const currentItems = allHistory.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allHistory.length / 10);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 10) % allHistory.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [allHistory]);
  return (
    <>
      <TableContainer>
        <Table variant="striped">
          {!allHistory.length && <TableCaption>No History</TableCaption>}
          <Thead
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize="12px"
            color="gray"
            fontStyle="normal"
            letterSpacing="0.2"
          >
            <Tr>
              <Th fontWeight="bolder">Date Added</Th>
              <Th fontWeight="bolder">Action</Th>
              <Th fontWeight="bolder">Added By</Th>
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
                  <Td fontWeight="bold">{currentItem.date}</Td>
                  <Td fontWeight="bold">{currentItem.action}</Td>

                  <Td fontWeight="bold">{currentItem.createdBy}</Td>
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
                        <MenuItem>Delete</MenuItem>
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
        {!!allHistory.length && !search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
        {!!allHistory.length && search && (
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        )}
      </TableContainer>
    </>
  );
};

export default HistoryTable;
