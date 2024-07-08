import { createClient } from '@/lib/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateAppointment = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createAppointment'],
    mutationFn: async (data: {
      from: string;
      to: string;
      title: string;
    }) => {
      // First create the appointment
      const { data: appointment } = await supabase
        .from('appointments')
        .insert({
          from: data.from,
          to: data.to,
          title: data.title,
        })
        .select('id')
        .single()
        .throwOnError();

      if (!appointment) throw new Error('Appointment not created');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
