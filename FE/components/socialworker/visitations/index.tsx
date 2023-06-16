import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MdSearch, MdPictureAsPdf } from 'react-icons/md';
import CsvDownloader from 'react-csv-downloader';
import { FaFileCsv } from 'react-icons/fa';
import { visitHeader } from '@/services/helpers';
import { pdfDownloader } from '@/services/pdfDownload';
import AddVisitation from '../../global/AddVisitation';
import VisitTable from '@/components/global/VisitTable';

const Visitation = ({ visits }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setValue] = useState<string>('');
  const [selectSearch, setSelectSearch] = useState('firstname');
  const [allVisits, setAllVisits] = useState(visits);

  useEffect(() => {
    setAllVisits(visits);
  }, [visits]);

  const handleSearch = (e: any) => {
    const { value } = e.target;
    if (!value) {
      setValue('');
      setAllVisits(visits);
    }
    const filt = visits.filter((orphan: any) => {
      return orphan[selectSearch].toLowerCase().startsWith(value);
    });
    setValue(value);
    setAllVisits(filt);
  };

  const selectionChanged = (event: any) => {
    setSelectSearch(event.target.value);
  };

  const download = () => {
    const outputData = [...allVisits];

    const mappedData: any = [];
    outputData.forEach(
      ({ users, orphan, purpose, status, date_added }: any) => {
        const data = {
          users,
          orphan,
          purpose,
          status,
          date_added,
        };
        mappedData.push({ ...data });
      },
    );
    const header = [
      ['Created By', 'Orphan Name', 'Purpose', 'Status', 'Date Added'],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
  };
  return (
    <>
      <AddVisitation {...{ isOpen, onClose }} type="add" />
      <Flex justify="space-between" w="100%">
        <Flex>
          <Select variant="normal" w="150px" onChange={selectionChanged}>
            <option value="users">Name</option>
            <option value="purpose">Purpose</option>
            <option value="status">Status</option>
            <option value="orphan">Orphan</option>
            <option value="date_added">Date Added</option>
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
        <Button onClick={onOpen}>Add Visitation</Button>
        {/* <Button onClick={update}>update User</Button> */}

        <CsvDownloader datas={allVisits} filename="csv" columns={visitHeader}>
          <Button bg="transparent" leftIcon={<FaFileCsv />}>
            Download Csv
          </Button>
        </CsvDownloader>
        <Button
          bg="transparent"
          onClick={download}
          //   disabled={!users.length}
          leftIcon={<MdPictureAsPdf />}
        >
          Download Pdf
        </Button>
      </Flex>
      <VisitTable visits={allVisits} search={search} userType="socialworker" />
    </>
  );
};

export default Visitation;
