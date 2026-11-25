export type PortionKey = 'cad' | 'hardware' | 'software';

/** The three parts of every lesson, in order. ("Portion" in the code, "part" on the page.) */
export const PORTIONS: { key: PortionKey; label: string; step: number; blurb: string }[] = [
  { key: 'cad', label: 'CAD', step: 1, blurb: 'Draw the part in 3D on a computer, one piece at a time, and check each piece against the example. Then change one piece and predict what it does.' },
  { key: 'hardware', label: 'Hardware', step: 2, blurb: 'Wire the motor and the controls to the Arduino Mega.' },
  { key: 'software', label: 'Software', step: 3, blurb: 'Upload a program and make it move.' },
];

export const TRACKS = {
  beginner: { label: 'Beginner track', tagline: 'Every lesson has three parts: CAD (drawing the part in 3D on a computer), hardware, and software. Each part is one class session.' },
  intermediate: { label: 'Intermediate track', tagline: 'In progress. Follows the same CAD, hardware, software structure with harder mechanisms and more autonomy.' },
} as const;

export type TrackKey = keyof typeof TRACKS;

export function splitLessonId(id: string): { track: TrackKey; slug: string } {
  const [track, slug] = id.split('/') as [TrackKey, string];
  return { track, slug };
}

/** What a lesson's label says. A lesson the team has not signed off is a demo, in Lingbo's
    words of 2026-11-24: "demo subject to change". Set `reviewed: true` in its frontmatter and
    it becomes "Live". */
export const DEMO_LABEL = 'Demo · subject to change';

/** A coming-soon lesson gets a page of its own once it has more to say than a line: its
    concepts. Until then it is one row under "Coming next" and nothing links to it. */
export function hasOwnPage(data: { status: string; concepts: string[] }): boolean {
  return data.status === 'published' || data.concepts.length > 0;
}
