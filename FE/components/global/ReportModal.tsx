import { getAllActiveChild, monitoringById } from '@/services/user.service';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Input,
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
  Spinner,
  Center,
  Stack,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Select } from 'chakra-react-select';
import Calendar from 'react-calendar';
import moment from 'moment';
import { pdfDownloader } from '@/services/pdfDownload';
import { Capitalize } from '@/services/helpers';
import { loginAuth } from '@/services/auth';

const ReportModal = ({ isOpenReport, onCloseReport }: any) => {
  const [orphans, setOrphans] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [range, setRange] = useState('');
  const [orphanID, setOrphanID] = useState('');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    getAllOrphans();
  }, [isOpenReport]);

  const getAllOrphans = async () => {
    const res = await getAllActiveChild();
    res.data.map((orphan: any) => {
      orphan.label = orphan.orphans;
      orphan.value = orphan.id;
    });
    setOrphans(res.data);
  };

  const onChange = (range: any) => {
    setStartDate(range[0]);
    setEndDate(range[1]);
    const sDate = moment(range[0]).format('MMM Do YY');
    const eDate = moment(range[1]).format('MMM Do YY');
    const val = `${sDate} - ${eDate}`;
    setRange(val);
    onToggle();
  };

  const orphanChange = (e: any) => {
    setOrphanID(e.value);
  };

  const handleSubmit = async () => {
    try {
      if (!orphanID || !range) return alert('Fill up all inputs');
      setLoading(true);
      const payload = {
        orphanID,
        endDate,
        startDate,
      };
      console.log(payload);

      const response = await monitoringById(payload);
      console.log(response);
      if (!response.data.length) setResultText('No results found.');
      setLoading(false);
      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const download = () => {
    const outputData = [...report];
    const mappedData: any = [];

    outputData.forEach(
      ({
        orphanName,
        date_added,
        education,
        meal,
        action,
        daily_health,
      }: any) => {
        const data = {
          orphanName,
          date_added,
          education,
          meal,
          action,
          daily_health: daily_health.map((obj: any) => {
            return obj.label;
          }),
        };

        mappedData.push({ ...data });
      },
    );
    const header = [
      [
        'Orphan Name',
        'Date Added',
        'Education,',
        'Meal',
        'Action',
        'Daily Health',
      ],
    ];
    const body = mappedData.map(Object.values);
    pdfDownloader(header, body);
    // window.location.reload();
  };
  return (
    <Modal isOpen={isOpenReport} onClose={onCloseReport} isCentered>
      <ModalOverlay />
      <ModalContent maxW="70%">
        <ModalHeader>Generate Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="inherit">
          <Flex justify="center" gap="10">
            <Box w="40%">
              <Text fontWeight="bold">Orphan: </Text>
              <Select
                name="orphan_id"
                onChange={orphanChange}
                colorScheme="blue"
                options={orphans}
                // defaultValue={mealOptions[0]}
              />
            </Box>

            <Box w="30%">
              <Text fontWeight="bold">Date Range: </Text>
              <Input
                placeholder="Date Range"
                shadow="sm"
                readOnly
                onClick={onToggle}
                value={range}
              />
              <Box>
                <Collapse in={isOpen} animateOpacity>
                  <Calendar
                    selectRange={true}
                    onChange={onChange}
                    value={[startDate, endDate]}
                  />
                </Collapse>
              </Box>
            </Box>
            <Button onClick={handleSubmit} mt="5">
              Submit
            </Button>
          </Flex>
          {loading ? (
            <Center>
              <Spinner size="xl" mt="10" />
            </Center>
          ) : (
            <>
              {report.length > 0 ? (
                <TableContainer mt="10">
                  <Table variant="striped" colorScheme="teal">
                    <Thead>
                      <Tr>
                        <Th>Orphan Name</Th>
                        <Th>Date Added</Th>
                        <Th>Education</Th>
                        <Th>Meal</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {report.map((rep: any) => {
                        return (
                          <Tr key={rep._id}>
                            <Td>{Capitalize(rep.orphanName)}</Td>
                            <Td>{rep.date_added}</Td>
                            <Td>{rep.education}</Td>
                            <Td>{rep.meal}</Td>
                            <Td>{rep.action}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Text textAlign="center" mt="10">
                  {resultText}
                </Text>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {report.length > 0 && (
            <Button onClick={download} mt="5">
              Download Pdf
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
