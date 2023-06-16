import React, { useEffect, useState } from 'react';
import AddUser from '../../global/AddUser';
import {
  Flex,
  InputGroup,
  useDisclosure,
  InputLeftElement,
  Icon,
  Input,
  Button,
  Select,
} from '@chakra-ui/react';
import { MdSearch, MdPictureAsPdf } from 'react-icons/md';
import CsvDownloader from 'react-csv-downloader';
import { FaFileCsv } from 'react-icons/fa';
import { scheduleHeader } from '@/services/helpers';
import { pdfDownloader } from '@/services/pdfDownload';
import ScheduleTable from '@/components/global/ScheduleTable';
import AddSchedule from '@/components/global/AddSchedule';

const Schedules = ({ schedules }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allSched, setAllSched] = useState(schedules);
  const [search, setValue] = useState<string>('');
  const [selectSearch, setSelectSearch] = useState('schedule');

  useEffect(() => {
    setAllSched(schedules);
  }, [schedules]);

  const filteredSched = allSched.filter((sched: any) => {
    return sched[selectSearch].toLowerCase().startsWith(search.toLowerCase());
  });

  const selectionChanged = (e: any) => {
    setSelectSearch(e.target.value);
  };

  const download = () => {
    const outputData = [...allSched];
    const mappedData: any = [];
    outputData.forEach(({ volunteers, schedule_date, schedule }) => {
      const data = {
        volunteers,
        schedule_date,
        schedule,
      };
      mappedData.push({ ...data });
    });
    const header = [['Volunteer Name', 'Schedule Date', 'Schedue Time']];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };

  return (
    <>
      <AddSchedule {...{ isOpen, onClose }} type="add" />
      <Flex justify="space-between">
        {/* <Text>Accounts</Text> */}
        <Flex>
          <Select variant="normal" w="130px" onChange={selectionChanged}>
            <option value="schedule">schedule</option>
            <option value="role">Role</option>
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
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Button onClick={onOpen} aria-label="Add">
          Add Schedule
        </Button>
        <CsvDownloader datas={allSched} filename="csv" columns={scheduleHeader}>
          <Button bg="transparent" leftIcon={<FaFileCsv />}>
            Download Csv
          </Button>
        </CsvDownloader>
        <Button
          bg="transparent"
          onClick={download}
          disabled={!schedules.length}
          leftIcon={<MdPictureAsPdf />}
        >
          Download Pdf
        </Button>
      </Flex>
      <ScheduleTable
        {...{ search }}
        schedules={filteredSched}
        userType="admin"
      />
    </>
  );
};

export default Schedules;
