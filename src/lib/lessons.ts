export type PortionKey = 'cad' | 'hardware' | 'software';

/** The three parts of every lesson, in order. ("Portion" in the code, "part" on the page.) */
export const PORTIONS: { key: PortionKey; label: string; step: number; blurb: string }[] = [
  { key: 'cad', label: 'CAD', step: 1, blurb: 'Draw the mechanism one piece at a time and check each piece against the example.' },
  { key: 'hardware', label: 'Hardware', step: 2, blurb: 'Wire the motor and the controls to the Arduino Mega.' },
  { key: 'software', label: 'Software', step: 3, blurb: 'Upload a sketch and make it move.' },
];

export const TRACKS = {
  beginner: { label: 'Beginner track', tagline: 'Start here. Every lesson introduces a new mechanism and a new idea in CAD and hardware, while the software lessons build on each other.' },
  intermediate: { label: 'Intermediate track', tagline: 'In progress. Follows the same CAD, hardware, software structure with harder mechanisms and more autonomy.' },
} as const;

export type TrackKey = keyof typeof TRACKS;

export function splitLessonId(id: string): { track: TrackKey; slug: string } {
  const [track, slug] = id.split('/') as [TrackKey, string];
  return { track, slug };
}
