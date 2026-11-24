import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


const material = z.object({
  name: z.string(),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

/** One entry per lesson: src/content/lessons/<track>/<slug>/index.mdx */
const lessons = defineCollection({
  loader: glob({
    pattern: '*/*/index.mdx',
    base: './src/content/lessons',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ''),
  }),
  schema: z.object({
    track: z.enum(['beginner', 'intermediate']),
    number: z.number().int().min(1),
    title: z.string(),
    summary: z.string().max(240),
    status: z.enum(['published', 'coming-soon']),
    durationMinutes: z.number().int().positive().optional(),
    concepts: z.array(z.string()).default([]),
    materials: z.array(material).default([]),
    slidesUrl: z.string().url().optional(),
    docsUrl: z.string().url().optional(),
    modelSrc: z.string().optional(),
    /** Caption under the model: say what it is and where it comes from. */
    modelCaption: z.string().optional(),
    /** Set to true once the team has reviewed the text. Until then the page says "Demo · subject to change". */
    reviewed: z.boolean().default(false),
  }),
});

/** One entry per part: src/content/lessons/<track>/<slug>/{cad,hardware,software}.mdx */
const portions = defineCollection({
  loader: glob({
    pattern: '*/*/{cad,hardware,software}.mdx',
    base: './src/content/lessons',
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    portion: z.enum(['cad', 'hardware', 'software']),
    title: z.string(),
    objectives: z.array(z.string()).min(1).max(8),
    durationMinutes: z.number().int().positive(),
    status: z.enum(['published', 'placeholder']),
    modelSrc: z.string().optional(),
    modelCaption: z.string().optional(),
    docsUrl: z.string().url().optional(),
    slidesUrl: z.string().url().optional(),
    reviewed: z.boolean().default(false),
  }),
});

export const collections = { lessons, portions };
