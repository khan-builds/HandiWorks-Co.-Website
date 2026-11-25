/**
 * The comparison on The Problem page: five widely used options and HelpingHand.
 *
 * Rules, agreed with Lingbo on 2026-11-24 and shown to the reader in the "How we compare"
 * window on the page:
 *   - Every cell about another maker's product is a fact read on that maker's own page, with
 *     the link. A cell nobody could read at its source says "To be confirmed".
 *   - Mechanics is rated against CONCEPTS, a list merged from the seven public lists in LISTS.
 *     A concept can earn three marks: E, explained (an official lesson or help page teaches it
 *     by name); S, built from steps (the official build instructions for a set model have the
 *     student assemble it); M, made by the student (official material asks the student to
 *     draw or design their own).
 *   - HelpingHand is rated the same way. Anything no lesson on this site teaches today is W,
 *     shown as "* (WIP)", even where the hand already has the part.
 * Checked on 2026-11-24. Prices change: read them again before quoting one in print.
 */
export type Src = { label: string; url: string };
export type Cell = { text: string; detail?: string; src?: Src; tbc?: boolean };
export type Key = 'lego' | 'vex' | 'mbot' | 'sphero' | 'ftc' | 'hh';
/** How the robot gets built: from a step-by-step manual, to the student's own design, with
 *  nothing to build at all, or guided with the reason given at each step. */
export type Build = 'steps' | 'own' | 'none' | 'guided';

export type Option = {
  key: Key;
  name: string;
  maker: string;
  ours?: boolean;
  reach: Cell;
  cost: Cell;
  ages: Cell;
  more: Cell;
  build: Cell & { kind: Build; tag: string };
  circuits: Cell;
  code: Cell;
  /** One thing the option does well, in fairness to it. */
  good: string;
  /** Said under the strip where the usual count would mislead. */
  mechanicsNote?: string;
};

const LEGO: Src = { label: 'LEGO Education, product page (set 45522)', url: 'https://education.lego.com/en-us/products/lego-education-computer-science-and-ai/45522/' };
const VEX_KB_BUILD: Src = { label: 'VEX Library, Building with VEX V5', url: 'https://kb.vex.com/hc/en-us/articles/360046701172-Building-with-VEX-V5' };
const VEX_KB_KITS: Src = { label: 'VEX Library, Selecting a V5 Robot Kit', url: 'https://kb.vex.com/hc/en-us/articles/360035591012-Selecting-a-V5-Robot-Kit' };
const VEX_KB_V5: Src = { label: 'VEX Library, V5', url: 'https://kb.vex.com/hc/en-us/categories/360002333191-V5' };
const VEX_STORE: Src = { label: 'VEX Robotics, V5 Competition Starter Kit', url: 'https://www.vexrobotics.com/v5-competition-starter-kit.html' };
const MBOT: Src = { label: 'Makeblock, mBot2 product page', url: 'https://www.makeblock.com/products/buy-mbot2' };
const MBOT_ADDON: Src = { label: 'Makeblock, mBot2 Smart World 3-in-1 Add-on Pack', url: 'https://www.makeblock.com/products/smart-world-3-in-1-add-on-pack-for-mbot2' };
const SPHERO: Src = { label: 'Sphero, BOLT+ product page', url: 'https://sphero.com/products/sphero-bolt-plus' };
const FIRST_COST: Src = { label: 'FIRST, Cost & Registration', url: 'https://www.firstinspires.org/programs/cost-and-registration' };
const FTC_START: Src = { label: 'FIRST, Get Started with FIRST Tech Challenge', url: 'https://www.firstinspires.org/programs/ftc/get-started' };

/** VEX's starter robot for the 2026-27 V5 competition game, "Flex". The file is VEX's, on
 *  VEX's server: 215 pages, one assembly picture to a page. It is shown in a frame and never
 *  copied into this repo: its cover says "All Rights Reserved". */
export const manual = {
  name: 'Flex, the starter robot for this season’s VEX V5 competition',
  pages: 215,
  pdf: 'https://content.vexrobotics.com/docs/25-26/v5rc-override/flex_build_instructions-v4.pdf',
  about: { label: 'Global Robotics & Science Foundation, Hero Bot Build Instructions for VEX V5 Override', url: 'https://library.globalrobotics.org/hc/en-us/articles/50816633183124-Hero-Bot-Build-Instructions-for-VEX-V5-Override' },
  advice: VEX_KB_BUILD,
};

export const options: Option[] = [
  {
    key: 'lego',
    name: 'Computer Science & AI kit, grades 6–8',
    maker: 'LEGO Education',
    reach: { text: 'No figure published', detail: 'We found no count of schools or students on LEGO Education’s site.' },
    cost: { text: '$529.95', detail: 'For 4 students. $3,499 for 24.', src: LEGO },
    ages: { text: 'Grades 6–8', detail: 'Other grades need other kits.', src: LEGO },
    more: { text: 'None found' },
    build: { kind: 'steps', tag: 'Step by step', text: 'Building instructions in the box', src: LEGO },
    circuits: { text: 'Ready-made motors and a sensor', src: LEGO },
    code: { text: 'Blocks and Python', src: LEGO },
    good: 'Comes with 30 lessons and notes for the teacher.',
    mechanicsNote: 'Only 1 of its 30 lessons opens without signing in.',
  },
  {
    key: 'vex',
    name: 'V5 Competition Starter Kit',
    maker: 'VEX Robotics',
    reach: { text: '316,271 students', detail: 'In all VEX competitions, 2024–25.', src: { label: 'REC Foundation, annual report 2024–25', url: 'https://online.flippingbook.com/view/607606491' } },
    cost: { text: 'To be confirmed', detail: 'VEX’s store blocks our price check.', src: VEX_STORE, tbc: true },
    ages: { text: 'To be confirmed', detail: 'Not on the pages we could open.', tbc: true },
    more: { text: 'To be confirmed', detail: 'Next kit up: the Competition Super Kit.', src: VEX_KB_KITS, tbc: true },
    build: { kind: 'steps', tag: 'Step by step first', text: 'A 215-page manual for the first robot. Teams design the next one.', src: VEX_KB_BUILD },
    circuits: { text: 'Motors and sensors plug into ports', src: VEX_KB_KITS },
    code: { text: 'Blocks, Python and C++', src: VEX_KB_V5 },
    good: 'Teaches gear ratios and mechanical advantage by name, and teams go on to design their own robot.',
  },
  {
    key: 'mbot',
    name: 'mBot2',
    maker: 'Makeblock',
    reach: { text: '200,000+ schools', detail: 'All Makeblock products. No date given.', src: { label: 'Makeblock, About us', url: 'https://www.makeblock.com/pages/about-us' } },
    cost: { text: '$149.99', detail: 'One robot. 6 for $1,199.99, for 6 to 12 students.', src: MBOT },
    ages: { text: 'Ages 8 and up', src: MBOT },
    more: { text: '$79.99', detail: 'An add-on pack: arm, carrier or surveying robot.', src: MBOT_ADDON },
    build: { kind: 'steps', tag: 'Step by step', text: '“A series of concrete steps are provided for beginners.”', src: MBOT },
    circuits: { text: 'Plug-in modules', src: MBOT },
    code: { text: 'Blocks and Python', src: MBOT },
    good: 'The lowest price of the five.',
  },
  {
    key: 'sphero',
    name: 'BOLT+',
    maker: 'Sphero',
    reach: { text: '20,000 institutions', detail: '“Over 40,000 educators, 20,000 education institutions”, written in 2021.', src: { label: 'Sphero, What is Sphero?', url: 'https://sphero.com/blogs/news/what-is-sphero' } },
    cost: { text: '$199', detail: 'For 2 students. $3,499 for 15 robots, 30 students.', src: SPHERO },
    ages: { text: 'Grades 3–10', src: SPHERO },
    more: { text: '$25', detail: 'A chariot it pulls, for building blocks.', src: { label: 'Sphero, Chariot', url: 'https://sphero.com/products/chariot' } },
    build: { kind: 'none', tag: 'Nothing to build', text: 'A sealed ball in “a durable waterproof shell”', src: SPHERO },
    circuits: { text: 'Sealed inside the shell', src: SPHERO },
    code: { text: 'Blocks, JavaScript and Python', src: SPHERO },
    good: 'Works the moment it is switched on, and survives a classroom.',
    mechanicsNote: 'Not checked: Sphero’s lesson site did not open for us.',
  },
  {
    key: 'ftc',
    name: 'FIRST Tech Challenge',
    maker: 'FIRST',
    reach: { text: '109,000+ students', detail: 'In 81 countries, 2024–25 season.', src: { label: 'FIRST, At a glance', url: 'https://www.firstinspires.org/about/at-a-glance' } },
    cost: { text: 'About $1,850', detail: '$350 a season plus about $1,500 of parts. Teams of 8 to 12.', src: FIRST_COST },
    ages: { text: 'Grades 7–12', src: FIRST_COST },
    more: { text: '$350 a season', detail: 'Paid again each year, for a new game.', src: FIRST_COST },
    build: { kind: 'own', tag: 'Own design', text: 'Students “design and build” a robot “from a kit of parts”', src: FTC_START },
    circuits: { text: 'Teams wire it themselves', src: { label: 'FIRST Tech Challenge Docs, Robot Wiring Guide', url: 'https://ftc-docs.firstinspires.org/en/latest/robot_building/wiring_guide/wiring-guide.html' } },
    code: { text: 'Blocks and Java', src: { label: 'FIRST Tech Challenge Docs, Programming Resources', url: 'https://ftc-docs.firstinspires.org/en/latest/programming_resources/index.html' } },
    good: 'The one option here where students design the whole robot.',
  },
  {
    key: 'hh',
    name: 'HelpingHand',
    maker: 'HandiWorks Co.',
    ours: true,
    reach: { text: 'Prototype', detail: 'Not yet used in a classroom.' },
    /* Rounded, and "parts, not a price" in the row itself (Lingbo, 2026-11-25): the total is
       $153.41 with a fifth of it contingency, and the rows beside it are selling prices. The
       exact table is on The Kit. Typed here, not computed: `cost` is defined further down. */
    cost: { text: 'About $150', detail: 'Parts for one hand, for 4 students. Parts, not a price.', src: { label: 'Our cost table, on The Kit', url: '/kit/#cost' } },
    ages: { text: 'Ages 11 and up' },
    more: { text: 'Print more parts', detail: 'Each added finger needs one more motor.' },
    build: { kind: 'guided', tag: 'Guided: the student draws the parts', text: 'Five CAD steps, each saying what the part is for, then one change of the student’s own', src: { label: 'Lesson 1, Draw the finger', url: '/lessons/beginner/01-finger-module/cad/' } },
    circuits: { text: 'Lesson 1: a DC motor and a button. The rest * (WIP)', src: { label: 'Lesson 1, Wire the Arduino Mega', url: '/lessons/beginner/01-finger-module/hardware/' } },
    code: { text: 'Lesson 1: one Arduino program. The rest * (WIP)', src: { label: 'Lesson 1, Program the finger', url: '/lessons/beginner/01-finger-module/software/' } },
    good: '',
  },
];

/** The seven public lists the concepts are merged from. A concept names the lists that have it. */
export const LISTS: Src[] = [
  { label: 'Purdue SIGBots Wiki, Hardware', url: 'https://wiki.purduesigbots.com/' },
  { label: 'Game Manual 0, the FIRST Tech Challenge community guide', url: 'https://gm0.org/en/latest/' },
  { label: 'VEX STEM Labs and VEX Library', url: 'https://kb.vex.com/hc/en-us/categories/360002333191-V5' },
  { label: 'REV Robotics documentation, build systems', url: 'https://docs.revrobotics.com/' },
  { label: 'Carnegie Mellon, Introduction to Mechanisms', url: 'https://www.cs.cmu.edu/~rapidproto/mechanisms/tablecontents.html' },
  { label: 'Project Lead The Way, Principles of Engineering course outline', url: 'https://www.pltw.org/hubfs/PLTW_Engineering/CourseDocuments/POE_CourseOutline_ENG.pdf' },
  { label: 'FRCDesign.org, design handbook', url: 'https://frcdesign.org/design-handbook/' },
];

export type Concept = { n: number; name: string; lists: number[] };
export const GROUPS: { name: string; short: string; concepts: Concept[] }[] = [
  {
    name: 'Forces and key ideas', short: 'Forces',
    concepts: [
      { n: 1, name: 'Torque, speed and power', lists: [1, 3, 5, 6] },
      { n: 2, name: 'Mechanical advantage', lists: [3] },
      { n: 3, name: 'Center of mass', lists: [1, 3] },
      { n: 4, name: 'Friction', lists: [3] },
      { n: 5, name: 'Internal forces: stress and strain', lists: [1, 6] },
    ],
  },
  {
    name: 'Simple machines', short: 'Simple machines',
    concepts: [
      { n: 6, name: 'Simple and compound machines; efficiency', lists: [3, 5, 6] },
      { n: 7, name: 'Lever, wheel and axle, inclined plane, wedge, screw', lists: [5] },
      { n: 8, name: 'Pulley systems', lists: [3, 5, 6] },
    ],
  },
  {
    name: 'Gears', short: 'Gears',
    concepts: [
      { n: 9, name: 'Gear ratios', lists: [1, 3, 5, 6] },
      { n: 10, name: 'Gears and gear trains', lists: [1, 2, 3, 4, 5, 6] },
      { n: 11, name: 'Planetary gear trains and gearboxes', lists: [2, 4, 5] },
      { n: 12, name: 'Gear-tooth geometry', lists: [4, 5] },
    ],
  },
  {
    name: 'Chain, belt, shafts and bearings', short: 'Chain and shafts',
    concepts: [
      { n: 13, name: 'Sprockets and chain', lists: [1, 2, 3, 4] },
      { n: 14, name: 'Timing belts and pulleys', lists: [2, 4, 5] },
      { n: 15, name: 'Direct drive', lists: [2] },
      { n: 16, name: 'Shafts, spacers, collars and shaft retention', lists: [2, 3, 4] },
      { n: 17, name: 'Bearings; supporting and constraining motion', lists: [1, 4] },
    ],
  },
  {
    name: 'Linkages and cams', short: 'Linkages',
    concepts: [
      { n: 18, name: 'Linkages: links, pairs, chains, degrees of freedom', lists: [2, 5] },
      { n: 19, name: 'Four-bar linkage', lists: [1, 2, 5] },
      { n: 20, name: 'Slider-crank', lists: [5] },
      { n: 21, name: 'Pivots and joints', lists: [1, 4, 7] },
      { n: 22, name: 'Types of motion, and turning one into another', lists: [3, 5, 6] },
      { n: 23, name: 'Cams', lists: [5] },
      { n: 24, name: 'Ratchet, clutch, Geneva wheel, universal joint', lists: [5] },
    ],
  },
  {
    name: 'Lifts, arms and linear motion', short: 'Lifts and arms',
    concepts: [
      { n: 25, name: 'Arms and lifting mechanisms', lists: [1, 2, 3, 4] },
      { n: 26, name: 'Double reverse four-bar, six-bar, chain bar', lists: [1, 2] },
      { n: 27, name: 'Scissor lift', lists: [1, 3] },
      { n: 28, name: 'Elevator lifts and rigging', lists: [1, 2, 4, 7] },
      { n: 29, name: 'Linear slides', lists: [2, 4] },
      { n: 30, name: 'Lead screws, linear actuators, rack and pinion', lists: [2, 4] },
      { n: 31, name: 'Turrets', lists: [2] },
    ],
  },
  {
    name: 'Drivetrains and wheels', short: 'Drivetrains',
    concepts: [
      { n: 32, name: 'Drivetrain design', lists: [1, 2, 3, 4, 7] },
      { n: 33, name: 'Tank drive', lists: [1, 2] },
      { n: 34, name: 'Holonomic and mecanum drive', lists: [1, 2, 4] },
      { n: 35, name: 'Swerve drive', lists: [4, 7] },
      { n: 36, name: 'Wheel types', lists: [1, 3, 4] },
    ],
  },
  {
    name: 'Grippers, launchers and pneumatics', short: 'Grippers',
    concepts: [
      { n: 37, name: 'Claws and passive manipulators', lists: [2, 3] },
      { n: 38, name: 'Roller intakes', lists: [1, 2, 7] },
      { n: 39, name: 'Transfers and conveyors', lists: [2, 4] },
      { n: 40, name: 'Launchers: flywheel, catapult, puncher', lists: [1, 3, 7] },
      { n: 41, name: 'Pneumatics and fluid power', lists: [1, 3, 6] },
    ],
  },
  {
    name: 'Structure, fastening and making', short: 'Structure and making',
    concepts: [
      { n: 42, name: 'Structural members and brackets', lists: [1, 3, 4, 7] },
      { n: 43, name: 'Fasteners', lists: [1, 2, 3, 4, 7] },
      { n: 44, name: 'Chassis design, bracing and stiffening', lists: [1, 3] },
      { n: 45, name: 'Statics: beams, trusses, free-body diagrams', lists: [6] },
      { n: 46, name: 'Materials', lists: [2, 6, 7] },
      { n: 47, name: 'Fabrication and tools: 3D printing, laser cutting, machining', lists: [1, 2, 3, 7] },
      { n: 48, name: 'CAD and 3D modeling', lists: [1, 2, 3, 4, 6] },
      { n: 49, name: 'Engineering design process', lists: [2, 3, 6] },
    ],
  },
];
export const CONCEPT_COUNT = GROUPS.reduce((sum, g) => sum + g.concepts.length, 0);

export type Mark = 'E' | 'S' | 'M' | 'W';
/** One mark on one concept, with the page it was read on. `q` is the page's own words;
 *  `seen` is our description of a page that is pictures. */
export type Rating = { m: Mark; url?: string; q?: string; seen?: string };

export { RATINGS, CHECKED } from './ratings';
import { RATINGS } from './ratings';

const has = (key: Key, n: number, m: Mark) => (RATINGS[key][n] ?? []).some((r) => r.m === m);
/** One cell of an option's strip: a group, and what the option does in it. */
export function strip(key: Key) {
  return GROUPS.map((g) => ({
    name: g.name,
    short: g.short,
    of: g.concepts.length,
    explained: g.concepts.filter((c) => has(key, c.n, 'E')).length,
    steps: g.concepts.filter((c) => has(key, c.n, 'S')).length,
    made: g.concepts.filter((c) => has(key, c.n, 'M')).length,
    wip: g.concepts.filter((c) => has(key, c.n, 'W')).length,
  }));
}
export function totals(key: Key) {
  const cells = strip(key);
  const sum = (pick: (c: (typeof cells)[number]) => number) => cells.reduce((s, c) => s + pick(c), 0);
  return { explained: sum((c) => c.explained), steps: sum((c) => c.steps), made: sum((c) => c.made), wip: sum((c) => c.wip) };
}

/** What researchers say about building from steps. Each sentence was read in the paper. */
export const research: { quote: string; who: string; note: string; src: Src }[] = [
  {
    quote: 'Most of those curricula propose usually a restricted step-by-step guided approach for learners or strictly scripted workshops to assembly and program prescribed models of robots that do not lead to any meaningful learning.',
    who: 'Alimisis, Open Research Europe, 2021',
    note: 'A review of curricula from makers of well-known kits. It gives no count.',
    src: { label: 'Alimisis (2021), Technologies for an inclusive robotics education', url: 'https://doi.org/10.12688/openreseurope.13321.2' },
  },
  {
    quote: 'Some groups meticulously followed the graphical assembly instructions of LEGO® robots without understanding the functionality component of the construction.',
    who: 'Kaloti-Hallak, Armoni and Ben-Ari, Informatics in Education, 2019',
    note: 'Eight competition groups, ages 13 to 15. Almost all of them still learned something that mattered.',
    src: { label: 'Kaloti-Hallak, Armoni & Ben-Ari (2019), The effect of robotics activities on learning the engineering design process', url: 'https://files.eric.ed.gov/fulltext/EJ1212912.pdf' },
  },
  {
    quote: 'In these activities, students are making something, but the learning experience is limited.',
    who: 'Resnick and Rosenbaum, Designing for Tinkerability, 2013',
    note: 'On lessons that say “Here are the instructions for making your robotic car. Follow the instructions carefully.”',
    src: { label: 'Resnick & Rosenbaum (2013), Designing for Tinkerability', url: 'https://web.media.mit.edu/~mres/papers/designing-for-tinkerability.pdf' },
  },
];
/** The other side, so the page does not overclaim: guidance helps beginners. */
export const guidance = {
  quote: 'For novices, studying worked examples seems invariably superior to discovering or constructing a solution to a problem.',
  src: { label: 'Kirschner, Sweller & Clark (2006), Why minimal guidance during instruction does not work', url: 'https://doi.org/10.1207/s15326985ep4102_1' },
};
/** Why these four makers: the one free market estimate found. The full report is paid. */
export const market: Src = { label: 'Verified Market Research, Top 7 educational robot companies (March 2026)', url: 'https://www.verifiedmarketresearch.com/blog/top-7-educational-robot-companies-enhancing-student-engagement-and-understanding/' };

/** The team's cost table of 2026-11-24 (docs/cost-table-2026-11-24.png). Unit costs are the
 *  team's, from NYU Tandon's EG1004 price list. */
export const cost = {
  rows: [
    { item: 'Arduino Mega 2560', qty: 1, unit: 22.99 },
    { item: 'Battery', qty: 1, unit: 24.99 },
    { item: 'IMU (tilt sensor)', qty: 1, unit: 18.0 },
    { item: 'Adafruit Motor Shield', qty: 2, unit: 19.95 },
    { item: 'DC motor', qty: 6, unit: 1.16 },
    { item: '3D prints', qty: 1, unit: 15.0 },
  ],
  contingency: 0.2,
  date: '24 Nov 2026',
  src: { label: 'NYU Tandon EG1004 price list', url: 'https://eg.poly.edu/' },
};
/** How the price is said in a headline or beside another maker's price: to the nearest $10,
 *  with "about", because a fifth of the total is contingency. The table on The Kit keeps the
 *  cents. Lingbo chose this on 2026-11-25. */
export const about = (x: number, cap = false) => `${cap ? 'About' : 'about'} $${(Math.round(x / 10) * 10).toLocaleString('en-US')}`;
export const money = (x: number) => `$${x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
export function costTotals() {
  const parts = cost.rows.reduce((s, r) => s + r.qty * r.unit, 0);
  const extra = Math.round(parts * cost.contingency * 100) / 100;
  return { parts, extra, total: Math.round((parts + extra) * 100) / 100 };
}
