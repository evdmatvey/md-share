import { useMutation } from '@tanstack/react-query';
import { createShare } from '@shared/api/shares';

export const useCreateShare = () => {
  return useMutation({
    mutationFn: createShare,
  });
};
