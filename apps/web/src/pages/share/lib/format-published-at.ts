import { shareMessages } from '../messages/strings';

const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatPublishedAt = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const dayDiff =
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000;

  if (dayDiff === 0) {
    return shareMessages.publishedToday;
  }

  if (dayDiff === 1) {
    return shareMessages.publishedYesterday;
  }

  const formatted = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `${shareMessages.publishedOn} ${formatted}`;
};
