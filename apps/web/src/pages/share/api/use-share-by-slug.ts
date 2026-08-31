import { shareSlugSchema } from '@md-share/contracts';
import { useQuery } from '@tanstack/react-query';
import { getShareBySlug } from '@shared/api/shares';

export const shareQueryKey = (slug: string) => ['shares', slug] as const;

export const useShareBySlug = (slug: string | undefined) => {
  const parsedSlug =
    slug !== undefined ? shareSlugSchema.safeParse(slug) : null;
  const isValidSlug = parsedSlug?.success === true;
  const validSlug = parsedSlug?.success === true ? parsedSlug.data : '';

  return useQuery({
    queryKey: shareQueryKey(validSlug),
    queryFn: () => getShareBySlug(validSlug),
    enabled: isValidSlug,
    retry: false,
  });
};
