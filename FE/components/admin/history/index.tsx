import React, { useState } from 'react';
import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import { MdSearch, MdPictureAsPdf } from 'react-icons/md';
import { UserHeaders } from '@/services/helpers';
import { FaFileCsv } from 'react-icons/fa';
import CsvDownloader from 'react-csv-downloader';
import HistoryTable from './HistoryTable';

const History = ({ histories }: any) => {
  console.log(histories);

  const [search, setValue] = useState<string>('');
  const [selectSearch, setSelectSearch] = useState('date');
  const [history, setHistory] = useState(histories);

  const handleSearch = (e: any) => {
    const { value } = e.target;
    if (!value) {
      setValue('');
      setHistory(histories);
    }
    const filt = histories.filter((orphan: any) => {
      return orphan[selectSearch].toLowerCase().startsWith(value);
    });
    setValue(value);
    setHistory(filt);
  };

  const selectionChanged = (event: any) => {
    setSelectSearch(event.target.value);
  };
  return (
    <>
      <Flex justify="space-between">
        <Flex>
          <Select variant="normal" w="130px" onChange={selectionChanged}>
            <option value="date">Date</option>
            <option value="action">Action</option>
            <option value="createdBy">Added By</option>
          </Select>
          <InputGroup w="300px">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Search"
              shadow="sm"
              variant="search"
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </Flex>
        <CsvDownloader datas={histories} filename="csv" columns={UserHeaders}>
          <Button bg="transparent" leftIcon={<FaFileCsv />}>
            Download Csv
          </Button>
        </CsvDownloader>
        <Button bg="transparent" leftIcon={<MdPictureAsPdf />}>
          Download Pdf
        </Button>
      </Flex>
      <HistoryTable allHistory={history} search={search} />
    </>
  );
};

export default History;
