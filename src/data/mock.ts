/** Demo data for the mocked dashboards. Every student name is fictional. */
import type { PortionKey } from '../lib/lessons';

export type Status = 'done' | 'in-progress' | 'not-started';

export const demoClass = {
  name: 'Period 3 · Intro Robotics',
  teacher: 'Ms. Rivera',
  school: 'Demo Middle School',
};

export const students: { name: string; cad: Status; hardware: Status; software: Status }[] = [
  { name: 'Avery Lin', cad: 'done', hardware: 'done', software: 'in-progress' },
  { name: 'Jordan Okafor', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Priya Natarajan', cad: 'done', hardware: 'done', software: 'done' },
  { name: 'Mateo Alvarez', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Sam Whitfield', cad: 'in-progress', hardware: 'not-started', software: 'not-started' },
  { name: 'Noor Haddad', cad: 'done', hardware: 'done', software: 'in-progress' },
  { name: 'Eli Brennan', cad: 'done', hardware: 'not-started', software: 'not-started' },
  { name: 'Keiko Tanaka', cad: 'done', hardware: 'done', software: 'done' },
  { name: 'Darius Cole', cad: 'in-progress', hardware: 'not-started', software: 'not-started' },
  { name: 'Maya Feldman', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Tomás Reyes', cad: 'done', hardware: 'done', software: 'in-progress' },
  { name: 'Lena Novak', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Isaiah Brooks', cad: 'done', hardware: 'done', software: 'not-started' },
  { name: 'Hana Kim', cad: 'done', hardware: 'done', software: 'done' },
  { name: 'Owen Gallagher', cad: 'in-progress', hardware: 'not-started', software: 'not-started' },
  { name: 'Zara Ahmed', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Luca Moretti', cad: 'done', hardware: 'done', software: 'in-progress' },
  { name: 'Imani Walker', cad: 'done', hardware: 'in-progress', software: 'not-started' },
  { name: 'Felix Nguyen', cad: 'not-started', hardware: 'not-started', software: 'not-started' },
  { name: 'Rosa Delgado', cad: 'done', hardware: 'done', software: 'in-progress' },
];

/** Completion is counted from the roster on the dashboard, so the meters and this list always agree.
    Titles and paths must match the real Lesson 1 pages. */
export const LESSON_1 = { title: 'Lesson 1 · Build a Finger', path: '/lessons/beginner/01-finger-module/' };

export const assignments: { title: string; due: string; portion: PortionKey }[] = [
  { title: 'Lesson 1 · CAD', due: 'Nov 10', portion: 'cad' },
  { title: 'Lesson 1 · Hardware', due: 'Nov 14', portion: 'hardware' },
  { title: 'Lesson 1 · Software', due: 'Nov 19', portion: 'software' },
];

export const studentPersona = {
  name: 'Jordan',
  fullName: 'Jordan Okafor',
  className: demoClass.name,
  progress: { cad: 'done' as Status, hardware: 'in-progress' as Status, software: 'not-started' as Status },
  assigned: [
    { title: 'Lesson 1 · Hardware', due: 'Nov 14', path: '/lessons/beginner/01-finger-module/hardware/' },
    { title: 'Lesson 1 · Software', due: 'Nov 19', path: '/lessons/beginner/01-finger-module/software/' },
  ],
  bookmarks: [
    { title: 'Lesson 1 · CAD', path: '/lessons/beginner/01-finger-module/cad/' },
    { title: 'Lesson 1 · Hardware', path: '/lessons/beginner/01-finger-module/hardware/' },
    { title: 'Lesson 2 · Gears and managing multiple motors', path: '/lessons/beginner/02-gears-and-motors/' },
  ],
};

export const STATUS_LABEL: Record<Status, string> = { done: 'Done', 'in-progress': 'In progress', 'not-started': 'Not started' };
