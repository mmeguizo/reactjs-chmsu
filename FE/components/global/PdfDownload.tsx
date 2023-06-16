import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { allUser, getAllOrphans, getAllVisit } from '@/services/user.service';
import { pdfDownloader } from '@/services/pdfDownload';
import { Spinner } from '@chakra-ui/react';
import { allOrphans } from '@/services/orphans.service';

const PdfDownload = ({ isOpenDownload, onCloseDownload }: any) => {
  const [loading, setLoading] = useState(false);

  const downloadChildActive = async () => {
    setLoading(true);
    const { orphan } = await allOrphans();
    const activeOrphan = orphan.filter((orp: any) => orp.status === 'active');
    const outputData = [...activeOrphan];
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
    setLoading(false);

    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };
  const downloadChildAdopted = async () => {
    setLoading(true);
    const { orphan } = await allOrphans();
    const activeOrphan = orphan.filter((orp: any) => orp.status === 'adopted');
    const outputData = [...activeOrphan];
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
    setLoading(false);

    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };

  const downloadUser = async () => {
    setLoading(true);
    const { user: users } = await allUser();
    const outputData = [...users];
    const mappedData: any = [];
    outputData.forEach(({ email, username, role, status }) => {
      const data = {
        email,
        username,
        role,
        status,
      };
      mappedData.push({ ...data });
    });
    setLoading(false);

    const header = [['Email', 'Username', 'Role', 'status']];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };

  const downloadVisitations = async () => {
    setLoading(true);
    const { data: visits } = await getAllVisit();
    const outputData = [...visits];

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
    setLoading(false);

    const header = [
      ['Created By', 'Orphan Name', 'Purpose', 'Status', 'Date Added'],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
  };

  const downloadMonitoring = async () => {
    setLoading(true);

    const { data } = await getAllOrphans();

    const outputData = [...data];
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
    setLoading(false);

    const header = [
      ['Orphan Name', 'Date Added', 'Added By', 'Meal', 'Education', 'Action'],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    window.location.reload();
  };
  return (
    <Modal isOpen={isOpenDownload} onClose={onCloseDownload} isCentered>
      <ModalOverlay />
      <ModalContent maxW="300px">
        <ModalHeader>PDF Download</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Flex justify="center" align="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            <>
              <Flex justify="space-between" align="center">
                <Text>Accounts</Text>
                <Button onClick={() => downloadUser()}>Download</Button>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Childrens</Text>
                <Button onClick={() => downloadChildActive()}>Download</Button>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Adopted</Text>
                <Button onClick={() => downloadChildAdopted()}>Download</Button>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Visitations</Text>
                <Button onClick={() => downloadVisitations()}>Download</Button>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text>Monitoring</Text>
                <Button onClick={() => downloadMonitoring()}>Download</Button>
              </Flex>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex gap="2">
            <Button
              variant="outline"
              onClick={() => {
                onCloseDownload();
              }}
            >
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PdfDownload;
