import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAppointments = (isLoggedIn: boolean) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ['appointments'],
    refetchInterval: 30000,
    queryFn: async (): Promise<{
      appointments:
        | {
          id: number;
            from: string;
            to: string;
            title: string | null;
            created_at: string;
            updated_at: string | null;
          }[]
        | null;
    }> => {
      if (isLoggedIn) {
        const { data } = await supabase
          .from('appointments')
          .select('*')
          .throwOnError();

        return {
          appointments: data,
        };
      }

      const result = await fetch('/api/appointments', {
        method: 'GET',
        cache: 'no-cache',
      });

      const { appointments } = await result.json();

      return {
        appointments,
      };
    },
  });
};
