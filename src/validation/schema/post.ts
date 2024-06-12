import { z } from 'zod';

const Category = [
  'UNCATEGORIZED',
  'ANNOUNCEMENTS',
  'HOMEWORK',
  'EVENTS',
  'DISCUSSION',
  'QUESTIONS',
  'RESOURCES',
  'NEWS',
] as const;

export const postCreateSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255),
  category: z.enum(Category).optional(),
  content: z.string().min(1, 'Content is required.').max(65535),
  image: z.string().optional(),
});
