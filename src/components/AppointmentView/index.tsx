'use client';

import { Label } from '@/components/ui/label';
import { DatePicker, TimePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '@/lib';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { useUpdateAppointment } from '@/hooks/useUpdateAppointment';
import { useDeleteAppointment } from '@/hooks/useDeleteAppointment';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/modal';
import { Textarea } from '@/components/ui/textarea';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

type AppointmentViewProps = {
  isOpen: boolean;
  close: () => void;
  data:
    | {
        id: number;
        from: string;
        to: string;
        title: string | null;
        created_at: string;
        updated_at: string | null;
      }
    | undefined;
  isLoggedIn: boolean;
};

export const AppointmentView = ({
  isOpen,
  close,
  data,
  isLoggedIn,
}: AppointmentViewProps) => {
  if (!data) return null;

  // Dates
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(data.from));
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(
    dayjs(data.from)
  );
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs(data.to));
  const [title, setTitle] = useState<string>(data.title ?? '');

  const [thingsChanged, setThingsChanged] = useState(false);

  // Mutations
  const { mutateAsync: updateAppointment } = useUpdateAppointment();
  const { mutateAsync: deleteAppointment } = useDeleteAppointment();

  const handleUpdate = async () => {
    if (!date || !startTime || !endTime) {
      return;
    }

    const dateString = date.format('YYYY.MM.DD');
    const startTimeString = startTime.format('HH:mm');
    const endTimeString = endTime.format('HH:mm');

    // Combine date and time
    const startDateTime = dayjs(
      `${dateString} ${startTimeString}`,
      DATE_TIME_FORMAT
    );
    const endDateTime = dayjs(
      `${dateString} ${endTimeString}`,
      DATE_TIME_FORMAT
    );


    await updateAppointment({
      id: data.id,
      from: startDateTime.toISOString(),
      to: endDateTime.toISOString(),
      title: title,
    });

    // Close the Modal
    close();
  };

  const handleDelete = async () => {
    await deleteAppointment(data.id);
    close();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={close} isDismissable={!isLoggedIn}>
      <ModalContent className="sm:max-w-2xl">
        <ModalHeader className="mb-4">Termin</ModalHeader>
        <ModalBody className="flex flex-col gap-4 overflow-auto text-foreground">
          <div className="flex flex-col gap-4 text-foreground">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date-picker">Dan</Label>
              <DatePicker
                id="date-picker"
                placeholder="Datum"
                size="large"
                showNow={false}
                value={date}
                onChange={(_date) => {
                  setDate(_date);
                  setThingsChanged(true);
                }}
                disabled={!isLoggedIn}
                allowClear={false}
                inputReadOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time-picker-range">Ura</Label>
              <TimePicker.RangePicker
                id="time-picker-range"
                placeholder={['Začetek', 'Konec']}
                size="large"
                format={TIME_FORMAT}
                minuteStep={30}
                hourStep={1}
                needConfirm
                showNow={false}
                disabledTime={() => ({
                  disabledHours: () => [0, 1, 2, 3, 4, 5, 23],
                })}
                hideDisabledOptions
                value={[startTime, endTime]}
                onChange={(dates) => {
                  setStartTime(dates?.[0] || null);
                  setEndTime(dates?.[1] || null);
                  setThingsChanged(true);
                }}
                disabled={!isLoggedIn}
                allowClear={false}
                inputReadOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="opis">Opis</Label>
              <Textarea id="opis" value={title} onChange={(e) => {
                setTitle(e.target.value);
                setThingsChanged(true);
              }} placeholder={isLoggedIn ? "Opis termina": "Zasedeno"} rows={6} disabled={!isLoggedIn} />
            </div>
          </div>
        </ModalBody>
        {isLoggedIn && (
          <ModalFooter className="flex w-full justify-between">
            <div className="flex w-full">
              <div className="flex-1">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="items-start"
                onClick={handleUpdate}
                disabled={!thingsChanged}
              >
                Shrani
              </Button>
            </div>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
