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
import { childheaders, UserHeaders } from '@/services/helpers';
import { pdfDownloader } from '@/services/pdfDownload';
import AddOrphan from '../../global/AddOrphan';
import ChildrenTable from '@/components/global/ChildrenTable';
import { useRouter } from 'next/router';

const Childrens = ({ orphans }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setValue] = useState<string>('');
  const [selectSearch, setSelectSearch] = useState('firstname');
  const [allOrphans, setAllOrphans] = useState(orphans);
  const [type] = useState('add');
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [VisitId, setVisitId] = useState('');

  useEffect(() => {
    if (router.query.id) {
      setUserId(router.query.id as string);
      setVisitId(router.query.visitId as string);
    }
  }, [router]);

  useEffect(() => {
    setAllOrphans(orphans);
  }, [orphans]);

  const handleSearch = (e: any) => {
    const { value } = e.target;
    if (!value) {
      setValue('');
      setAllOrphans(orphans);
    }
    const filt = orphans.filter((orphan: any) => {
      return orphan[selectSearch].toLowerCase().startsWith(value);
    });
    setValue(value);
    setAllOrphans(filt);
  };

  const selectionChanged = (event: any) => {
    setSelectSearch(event.target.value);
  };

  const download = () => {
    const outputData = [...allOrphans];
    const mappedData: any = [];
    outputData.forEach(
      ({
        firstname,
        lastname,
        gender,
        age,
        present_whereabouts,
        moral,
      }: any) => {
        const data = {
          firstname,
          lastname,
          gender,
          age,
          present_whereabouts,
          moral,
        };
        mappedData.push({ ...data });
      },
    );
    const header = [
      [
        'Firstname',
        'Lastname',
        'Gender',
        'Age',
        'Present Whereabouts',
        'Moral',
      ],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };
  return (
    <>
      <AddOrphan {...{ isOpen, onClose, type }} />
      <Flex justify="space-between" w="100%">
        <Flex>
          <Select variant="normal" w="130px" onChange={selectionChanged}>
            <option value="firstname">Firstname</option>
            <option value="lastname">Lastname</option>
            <option value="status">Status</option>
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
        <Button onClick={onOpen}>Add Orphan</Button>
        {/* <Button onClick={update}>update User</Button> */}

        <CsvDownloader datas={allOrphans} filename="csv" columns={childheaders}>
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
      <ChildrenTable
        orphans={allOrphans}
        search={search}
        userId={userId}
        userType="admin"
        VisitId={VisitId}
      />
    </>
  );
};

export default Childrens;
