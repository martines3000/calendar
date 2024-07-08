'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppointments } from '@/hooks';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AppointmentView } from '@/components/AppointmentView';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const VIEW_TYPES = ['timeGrid3Day', 'timeGrid7Day', 'listMonth'];
const DAY_NAMES = [
  'Nedelja',
  'Ponedeljek',
  'Torek',
  'Sreda',
  'Četrtek',
  'Petek',
  'Sobota',
];

const translateDay = (day: string) => {
  switch (day) {
    case 'Monday':
      return 'Ponedeljek';
    case 'Tuesday':
      return 'Torek';
    case 'Wednesday':
      return 'Sreda';
    case 'Thursday':
      return 'Četrtek';
    case 'Friday':
      return 'Petek';
    case 'Saturday':
      return 'Sobota';
    case 'Sunday':
      return 'Nedelja';
  }

  const [shortName, _] = day.split(' ');

  switch (shortName) {
    case 'Mon':
      return 'Pon';
    case 'Tue':
      return 'Tor';
    case 'Wed':
      return 'Sre';
    case 'Thu':
      return 'Čet';
    case 'Fri':
      return 'Pet';
    case 'Sat':
      return 'Sob';
    case 'Sun':
      return 'Ned';
  }

  return '';
};

const getTitle = (
  players: { id: number; firstname: string; lastname: string | null }[]
) => {
  if (players.length === 0) return 'Zasedeno';

  return players
    .map((player) => {
      if (!player.lastname) return player.firstname;

      return `${player.firstname.charAt(0).toUpperCase()}. ${player.lastname}`;
    })
    .join(', ');
};

type ViewProps = {
  isLoggedIn: boolean;
};

export const View = ({ isLoggedIn }: ViewProps) => {
  const calendarRef = useRef<FullCalendar | null>(null);

  // Local state
  const [viewType, setViewType] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Queries
  const { data } = useAppointments(isLoggedIn);

  // Memos
  const events = useMemo(() => {
    if (!data || !data.appointments) return [];

    return data.appointments.map((appointment) => {
      return {
        id: appointment.id.toString(),
        start: appointment.from,
        end: appointment.to,
        title: appointment.title === null || appointment.title === '' ? 'Zasedeno' : appointment.title,
        allDay: false,
      };
    });
  }, [data]);

  const getAppointment = (id: string) => {
    const _id = Number.parseInt(id);

    return data?.appointments?.find((appointment) => appointment.id === _id);
  };

  const nextView = useCallback(() => {
    setViewType((prev) => {
      const next = (prev + 1) % VIEW_TYPES.length;
      return next;
    });
  }, []);

  useEffect(() => {
    calendarRef.current?.getApi().changeView(VIEW_TYPES[viewType]);
  }, [viewType]);

  return (
    <div className="h-full overflow-auto">
      <AppointmentView
        isOpen={selectedEvent !== null}
        close={() => setSelectedEvent(null)}
        data={getAppointment(selectedEvent ?? '')}
        isLoggedIn={isLoggedIn}
      />
      <div className="h-full w-full overflow-hidden">
        <div className="flex h-full flex-col space-y-8">
          <div className="flex-1 overflow-auto">
            <FullCalendar
              ref={calendarRef}
              allDaySlot={false}
              plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
              headerToolbar={false}
              initialView={VIEW_TYPES[0]}
              footerToolbar={false}
              nowIndicator={false}
              editable={false}
              height={'auto'}
              dayHeaderContent={(info) => {
                if (info.view.type === 'listMonth') {
                  const day = info.date.getDay();
                  const dayName = DAY_NAMES[day];

                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="font-medium text-md">{dayName}</div>
                        <div className="ml-2 flex items-center">
                          <div className="font-medium text-md">
                            {`${info.date.getDate()}/${
                              info.date.getMonth() + 1
                            }`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center max-md:flex-col">
                      <div className="font-medium text-md">
                        {translateDay(info.text)}
                      </div>
                      <div className="flex items-center md:ml-2">
                        <div className="font-medium text-md">
                          {`${info.date.getDate()}/${info.date.getMonth() + 1}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
              views={{
                timeGrid3Day: {
                  type: 'timeGrid',
                  duration: { days: 3 },
                },
                timeGrid7Day: {
                  type: 'timeGrid',
                  duration: { days: 7 },
                },
              }}
              selectable={false}
              slotLabelFormat={{
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'narrow',
              }}
              eventTimeFormat={{
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'narrow',
              }}
              slotDuration={'00:30:00'}
              slotMinTime={'06:00:00'}
              slotMaxTime={'23:00:00'}
              events={events}
              noEventsContent={
                <div className="flex flex-col items-center justify-center gap-y-4">
                  <h1 className="text-center font-bold text-xl">
                    Ni terminov za prikaz. Pojdi nazaj z gumbom:
                  </h1>
                  <Button
                    size="default"
                    onClick={() => {
                      calendarRef.current?.getApi().today();
                    }}
                  >
                    Danes
                  </Button>
                </div>
              }
              eventContent={(eventInfo) => {
                return (
                  <>
                    <i className="overflow-hidden">{eventInfo.event.title}</i>
                  </>
                );
              }}
              eventClick={(info) => {
                setSelectedEvent(info.event.id);
              }}
            />
          </div>
          <div className="flex justify-center gap-x-1 pb-4">
            <Button size="sm" onClick={() => nextView()}>
              Pogled
            </Button>
            <Button
              size="sm"
              onClick={() => {
                calendarRef.current?.getApi().today();
              }}
            >
              Danes
            </Button>
            <Button
              size="sm"
              onClick={() => {
                calendarRef.current?.getApi().prev();
              }}
            >
              Nazaj
            </Button>
            <Button
              size="sm"
              onClick={() => {
                calendarRef.current?.getApi().next();
              }}
            >
              Naprej
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
