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
  useToast,
} from '@chakra-ui/react';
import { MdSearch, MdPictureAsPdf } from 'react-icons/md';
import { inquiriesHeader } from '@/services/helpers';
import { FaFileCsv } from 'react-icons/fa';
import CsvDownloader from 'react-csv-downloader';
import InqueryTable from '@/components/global/InqueryTable';
import ReadAllModal from '@/components/global/ReadAllModal';
import { readAll } from '@/services/user.service';
import { useRouter } from 'next/router';
import { pdfDownloader } from '@/services/pdfDownload';

const Inquiries = ({ inquery }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setValue] = useState<string>('');
  const [inqueries, setInqueries] = useState(inquery);
  const cancelRef = React.useRef();
  const toast = useToast();
  const router = useRouter();
  const [selectSearch, setSelectSearch] = useState('reads');

  useEffect(() => {
    setInqueries(inquery);
  }, [inquery]);

  useEffect(() => {
    if (router.query.status) setValue(router.query.status as string);
  }, [router]);

  const filteredData = inqueries.filter((inq: any) => {
    return inq[selectSearch].toLowerCase().startsWith(search.toLowerCase());
  });
  const selectionChanged = (event: any) => {
    setSelectSearch(event.target.value);
  };
  const confirmRead = async (confirm: boolean) => {
    if (confirm) {
      const response = await readAll();
      if (response) toastUI(1, response.message, 'Success');
      router.replace(router.asPath);
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

  const download = () => {
    const outputData = [...filteredData];
    const mappedData: any = [];

    outputData.forEach(
      ({ name, email, phone, message, date_added, reads }: any) => {
        const data = {
          name,
          email,
          phone,
          message,
          date_added,
          reads,
        };
        mappedData.push({ ...data });
      },
    );
    const header = [
      ['Name', 'Email', 'Phone Number', 'Message', 'Date Added', 'Status'],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };
  return (
    <>
      <ReadAllModal
        name="Read all inquiry"
        {...{
          onClose,
          isOpen,
          cancelRef,
          confirmRead,
        }}
      />
      <Flex justify="space-between">
        <Flex>
          <Select
            variant="normal"
            w="130px"
            onChange={selectionChanged}
            value={router.query.status ? 'reads' : 'name'}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="reads">Status</option>
            <option value="phone">Phone Number</option>
            <option value="message">Message</option>
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
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Button aria-label="Mark all as read" onClick={onOpen}>
          Mark all as read
        </Button>
        <CsvDownloader
          datas={inqueries}
          filename="csv"
          columns={inquiriesHeader}
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
      <InqueryTable allInquery={filteredData} search={search} />
    </>
  );
};

export default Inquiries;
