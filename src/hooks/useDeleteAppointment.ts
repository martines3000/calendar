import { createClient } from '@/lib/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteAppointment = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteAppointment'],
    mutationFn: async (id: number) => {
      await supabase.from('appointments').delete().eq('id', id).throwOnError();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
