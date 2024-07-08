'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker, TimePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useCreateAppointment } from '@/hooks';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '@/lib';
import { Textarea } from '@/components/ui/textarea';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export function View() {
  // Local state
  // Dates
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [title, setTitle] = useState<string>('');

  // Mutations
  const { mutateAsync: createAppointment } = useCreateAppointment();

  const handleCreate = async () => {
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

    await createAppointment({
      from: startDateTime.toISOString(),
      to: endDateTime.toISOString(),
      title: title,
    });

    // Clear fields
    setDate(dayjs());
    setStartTime(null);
    setEndTime(null);
    setTitle('');
  };

  return (
    <div className="flex max-w-2xl flex-1 items-center">
      <Card className="flex-1 max-md:rounded-none">
        <CardHeader>
          <CardTitle>Nov termin</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-1 animate-in flex-col justify-center gap-4 text-foreground">
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
              }}
              allowClear
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
              showNow={false}
              disabledTime={() => ({
                disabledHours: () => [0, 1, 2, 3, 4, 5, 23],
              })}
              hideDisabledOptions
              value={[startTime, endTime]}
              onChange={(dates) => {
                setStartTime(dates?.[0] || null);
                setEndTime(dates?.[1] || null);
              }}
              allowClear={false}
              inputReadOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="opis">Opis</Label>
            <Textarea id="opis" value={title} onChange={(e) => {
              setTitle(e.target.value);
            }} placeholder='Opis termina' rows={6}  />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-1 items-center justify-end">
            <Button onClick={handleCreate}>Dodaj</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
