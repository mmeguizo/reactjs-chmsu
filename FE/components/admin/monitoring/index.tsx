import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { MdSearch, MdPictureAsPdf } from 'react-icons/md';
import { monitoringHeader } from '@/services/helpers';
import { FaFileCsv } from 'react-icons/fa';
import { TbFileReport } from 'react-icons/tb';
import CsvDownloader from 'react-csv-downloader';
import MonitorTable from './MonitorTable';
import AddMonitor from '@/components/global/AddMonitor';
import { pdfDownloader } from '@/services/pdfDownload';
import ReportModal from '@/components/global/ReportModal';

const Monitoring = (data: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenReport,
    onOpen: onOpenReport,
    onClose: onCloseReport,
  } = useDisclosure();

  const [search, setValue] = useState<string>('');
  const [selectSearch, setSelectSearch] = useState('date');
  const [monitor, setMonitor] = useState(data);

  useEffect(() => {
    setMonitor(data);
  }, [data]);

  const handleSearch = (e: any) => {
    const { value } = e.target;
    if (!value) {
      setValue('');
      setMonitor(data);
    }
    const filt = monitor.filter((orphan: any) => {
      return orphan[selectSearch].toLowerCase().startsWith(value);
    });
    setValue(value);
    setMonitor(filt);
  };

  const selectionChanged = (event: any) => {
    setSelectSearch(event.target.value);
  };

  const download = () => {
    const outputData = [...monitor.data.monitoring];
    const mappedData: any = [];

    outputData.forEach(
      ({
        orphanName,
        date_added,
        addedByName,
        meal,
        education,
        action,
      }: any) => {
        const data = {
          orphanName,
          date_added,
          addedByName,
          meal,
          education,
          action,
        };
        mappedData.push({ ...data });
      },
    );
    const header = [
      ['Orphan Name', 'Date Added', 'Added By', 'Meal', 'Education', 'Action'],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };
  return (
    <>
      <AddMonitor {...{ isOpen, onClose }} type="add" />
      <ReportModal {...{ isOpenReport, onCloseReport }} />
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

        <Button onClick={onOpen} aria-label="Add">
          Add Monitoring
        </Button>
        <Button
          bg="transparent"
          leftIcon={<TbFileReport />}
          onClick={onOpenReport}
        >
          Generate Report
        </Button>
        <CsvDownloader
          datas={monitor.data.monitoring}
          filename="csv"
          columns={monitoringHeader}
        >
          <Button bg="transparent" leftIcon={<FaFileCsv />}>
            Download Csv
          </Button>
        </CsvDownloader>
        <Button
          bg="transparent"
          leftIcon={<MdPictureAsPdf />}
          onClick={download}
        >
          Download Pdf
        </Button>
      </Flex>
      <MonitorTable
        allMonitor={monitor.data.monitoring}
        search={search}
        userType={data.userType}
      />
    </>
  );
};

export default Monitoring;
