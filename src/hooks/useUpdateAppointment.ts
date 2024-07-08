import { createClient } from '@/lib/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateAppointment = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateAppointment'],
    mutationFn: async (data: {
      id: number;
      from: string;
      to: string;
      title: string;
    }) => {
      // First update the appointment
      await supabase
        .from('appointments')
        .update({
          from: data.from,
          to: data.to,
          title: data.title,
        })
        .eq('id', data.id)
        .single()
        .throwOnError();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
