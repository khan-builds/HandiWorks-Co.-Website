import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    lessonNumber: z.number().int().min(1),
    summary: z.string().max(200),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    durationMinutes: z.number().int().positive(),
    status: z.enum(['published', 'draft', 'coming-soon']),
    objectives: z.array(z.string()).min(1).max(6),
    materials: z.array(
      z.object({
        name: z.string(),
        quantity: z.number().int().positive(),
        note: z.string().optional(),
      }),
    ),
    prerequisites: z.array(z.string()).default([]),
    expectedOutcome: z.string(),
    downloads: z
      .array(
        z.object({
          label: z.string(),
          file: z.string(),
          sizeKb: z.number().optional(),
        }),
      )
      .default([]),
    heroImage: z.string().optional(),
  }),
});

export const collections = { lessons };
