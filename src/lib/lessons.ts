import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

export interface LessonSummary {
  slug: string;
  title: string;
  lessonNumber: number;
  summary: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  status: 'published' | 'draft' | 'coming-soon';
  heroImage?: string;
}

export type LessonData = CollectionEntry<'lessons'>['data'];

function toSummary(entry: CollectionEntry<'lessons'>): LessonSummary {
  return {
    slug: entry.id,
    title: entry.data.title,
    lessonNumber: entry.data.lessonNumber,
    summary: entry.data.summary,
    level: entry.data.level,
    durationMinutes: entry.data.durationMinutes,
    status: entry.data.status,
    ...(entry.data.heroImage ? { heroImage: entry.data.heroImage } : {}),
  };
}

/** Drafts only for teachers. Sorted by lessonNumber. */
export async function getLessons(user: SessionUser): Promise<LessonSummary[]> {
  const entries = await getCollection('lessons');
  return entries
    .filter((entry) => entry.data.status !== 'draft' || user.role === 'teacher')
    .map(toSummary)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
}

/** Null if missing, coming-soon, or a draft viewed by a student. */
export async function getLesson(slug: string, user: SessionUser) {
  const entry = await getEntry('lessons', slug);
  if (!entry) return null;
  if (entry.data.status === 'coming-soon') return null;
  if (entry.data.status === 'draft' && user.role !== 'teacher') return null;
  const { Content, headings } = await render(entry);
  return {
    summary: toSummary(entry),
    data: entry.data,
    Content,
    headings,
  };
}
