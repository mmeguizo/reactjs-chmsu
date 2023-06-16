import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Collapse,
  FormHelperText,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CgCalendarDates } from 'react-icons/cg';

const CalendarModal = ({
  errors,
  register,
  name,
  setValue,
  placeholder,
  getValues,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dateValue, setDateValue] = useState(getValues(name) || '');

  const calendarChange = (date: any) => {
    const dateTime = moment(date).format('YYYY-MM-DD');
    setValue(name, dateTime, { shouldValidate: true });
    setDateValue(date);
    onClose();
  };

  return (
    <>
      <FormControl isInvalid={!!errors}>
        <Text pb="2" fontWeight="semibold">
          {placeholder}
        </Text>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={CgCalendarDates} color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={placeholder}
            value={dateValue ? moment(dateValue).format('YYYY-MM-DD') : ''}
            onClick={onOpen}
            readOnly
            _invalid={{
              border: '2px solid #E53E3E',
            }}
            _focus={{
              border: '2px solid blue',
            }}
            {...register(name)}
          />
        </InputGroup>
        <Collapse in={!!errors}>
          {!!errors && (
            <FormHelperText fontSize="SubHeader.md" color="red">
              {errors.message as string}
            </FormHelperText>
          )}
        </Collapse>
      </FormControl>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb="5">
          <ModalHeader>{placeholder}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Calendar
                onChange={calendarChange}
                value={dateValue ? new Date(dateValue) : new Date()}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarModal;
