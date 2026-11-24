/**
 * Figures for The Problem page. Each one was checked against its primary source and carries
 * the link and the year. Do not add a figure nobody has opened the source for.
 *
 * The page is about robotics and engineering as a whole: mechanics, circuits and code. Until
 * 2026-11-24 most of its figures were about computer science courses; Lingbo asked for that
 * to change. The school, class and teacher figures now come from the 2018 NSSME+, the
 * national survey that asks schools about engineering courses, clubs and competition teams.
 * The table each one is read from is named beside it. The cost and evidence figures come
 * from the team's research doc, tagged "verified" or "verified-older" there:
 * https://docs.google.com/document/d/16nejGyEHBNWbVGut84JWVoOm16CMv4mFmbZtgO3BGVU/edit
 */
export type Figure = {
  value: string;
  label: string;
  detail?: string;
  source: string;
  url: string;
  year: string;
  tag: 'verified' | 'verified-older';
};

/** Horizon Research, December 2018: 1,273 schools and 7,600 teachers, nationally
 *  representative. Percentages are of schools, of classes or of teachers, as each label says. */
const NSSME = { source: 'Horizon Research, Report of the 2018 NSSME+', url: 'https://horizon-research.com/NSSME/wp-content/uploads/2020/04/Report_of_the_2018_NSSME.pdf', year: '2018' };
/** Gallup Panel web survey, Sept. 11 to 19, 2023: 2,006 people aged 12 to 26. */
const GEN_Z = { source: 'Gallup and Walton Family Foundation, Voices of Gen Z: Perspectives on STEM Education and Careers', url: 'https://nextgeninsights.waltonfamilyfoundation.org/wp-content/uploads/2024/05/Voices-of-Gen-Z.pdf', year: '2023' };

/**
 * The two numbers in the page header. NSSME+ Table 7.10, "Participation in engineering
 * competitions": the survey's question reads "Has one or more teams participating in
 * engineering competitions (e.g., Robotics)". Schools of every grade level, in quarters by the
 * share of students eligible for free or reduced-price lunch: 36% (standard error 3.6) in the
 * quarter with the fewest, 25% (3.7) in the quarter with the most. The two middle quarters
 * are 39% and 25% (Table E-38).
 */
export const gap = {
  caption: 'Schools with a team in engineering competitions such as robotics',
  highPoverty: { value: '25%', fill: 25, short: 'Highest-poverty schools', label: 'of the quarter of schools with the most students eligible for free or reduced-price lunch' },
  lowPoverty: { value: '36%', fill: 36, short: 'Lowest-poverty schools', label: 'of the quarter of schools with the fewest' },
  detail: 'US schools of every grade level, in quarters by the share of students eligible for free or reduced-price lunch.',
  ...NSSME,
};

export const headline: Figure[] = [
  // Table 7.7.
  { value: '35%', label: 'of US middle schools have a team in an engineering competition such as robotics', detail: 'So do 24% of elementary schools and 47% of high schools.', ...NSSME, tag: 'verified' },
  // Table 4.4.
  { value: '46%', label: 'of US high schools offer an engineering course', detail: 'Physics is offered in 82% and biology in 97%. Only 17% offer a second year of engineering.', ...NSSME, tag: 'verified' },
  { value: '$24,250', label: 'median season budget for one FIRST Robotics Competition team', detail: 'Registration alone is $6,500 for the 2026–27 season.', source: 'FIRST, Median Team Budget for FRC (rev. Aug 2025) and Cost & Registration', url: 'https://info.firstinspires.org/hubfs/web/program/frc/resources/example-budget.pdf', year: '2025', tag: 'verified' },
];

/** `label` is the boxed section label, `title` the sentence under it. */
export const sections: { label: string; title: string; intro: string; figures: Figure[] }[] = [
  {
    label: 'Access',
    title: 'Access depends on how big a school is and how much money its families have',
    intro: 'A robotics team or an engineering club is more than twice as common in the largest schools as in the smallest, and more common where few students are low-income. Whether the school is rural, suburban or urban matters much less.',
    figures: [
      // Table 7.10, by school size.
      { value: '45% vs 20%', label: 'of the largest and the smallest schools have a team in engineering competitions such as robotics', detail: 'Schools of every grade level, in four groups by size.', ...NSSME, tag: 'verified' },
      // Table 7.10, by free or reduced-price lunch. The report's own example of the gap.
      { value: '39% vs 26%', label: 'of the lowest-poverty and the highest-poverty schools offer an engineering club', detail: 'The quarters of schools with the fewest and the most students eligible for free or reduced-price lunch.', ...NSSME, tag: 'verified' },
      // Table E-40.
      { value: '32 / 32 / 29%', label: 'of rural, suburban, and urban schools have a team in engineering competitions', ...NSSME, tag: 'verified' },
    ],
  },
  {
    label: 'In class',
    title: 'Fewer than half of students get hands-on work in class',
    intro: 'Most students are told how math and science are used in the real world. Far fewer build or program anything themselves.',
    figures: [
      { value: '42%', label: 'of middle and high school students have used technology such as coding programs, robots or 3D printers in class', detail: '29% have built an electrical circuit. 81% say they learned how math and science are used in the real world.', ...GEN_Z, tag: 'verified' },
      // Table 5.26.
      { value: '51%', label: 'of middle school science classes take up engineering only a few times a year', detail: 'Another 10% never do. 5% do so once or twice a week.', ...NSSME, tag: 'verified' },
    ],
  },
  {
    label: 'Cost',
    title: 'Robotics kits are priced for budgets most classrooms do not have',
    intro: 'Equipping a class of 24 to 30 students with a mainstream kit costs thousands of dollars before any curriculum or training.',
    figures: [
      { value: '$3,499', label: 'LEGO Education Computer Science & AI Kit bundle for 24 students', detail: '$529.95 per kit of 4 students.', source: 'LEGO Education, product page (set 45522)', url: 'https://education.lego.com/en-us/products/lego-education-computer-science-and-ai/45522/', year: '2026', tag: 'verified' },
      { value: '$479.99', label: 'VEX IQ Education Kit, one kit', detail: 'Verified on an archived vendor page; current list price may be slightly higher.', source: 'VEX Robotics, product page', url: 'https://www.vexrobotics.com/228-8899.html', year: '2025', tag: 'verified' },
      { value: '$3,499', label: 'Sphero BOLT+ Power Pack of 15 robots', source: 'Sphero, middle school collection', url: 'https://sphero.com/collections/middle-school', year: '2026', tag: 'verified' },
      { value: '~$1,800', label: 'to start a FIRST Tech Challenge team, before events', source: 'FIRST, How to Get Started with FIRST Tech Challenge', url: 'https://www.firstinspires.org/programs/ftc/get-started', year: '2026–27', tag: 'verified' },
    ],
  },
  {
    label: 'Teachers',
    title: 'Few teachers were ever taught engineering themselves',
    intro: 'Engineering has not historically been part of the school curriculum, and few science teachers have taken a course in it.',
    figures: [
      // Table 2.38.
      { value: '3%', label: 'of elementary teachers feel very well prepared to teach engineering', detail: '51% say they are not adequately prepared. For life science the two figures are 24% and 3%.', ...NSSME, tag: 'verified' },
      // Table 2.7.
      { value: '3 / 10 / 13%', label: 'of elementary, middle, and high school science teachers have taken a college course in engineering', ...NSSME, tag: 'verified' },
      // Table 2.42, "Developing possible solutions".
      { value: '14%', label: 'of middle school science teachers feel very well prepared to teach students to develop possible solutions to an engineering problem', detail: '28% say they are not adequately prepared. Among high school science teachers it is 8% and 34%.', ...NSSME, tag: 'verified' },
    ],
  },
  {
    label: 'Evidence',
    title: 'Hands-on robotics works when students can get it',
    intro: 'The research is positive on learning and attitudes, with honest caveats on effect sizes and study design.',
    figures: [
      { value: 'g = 0.49', label: 'pooled effect of educational robotics on STEM learning across 21 studies', detail: 'Learning performance g = 0.67; attitudes g = 0.50. Computational-thinking effects were not significant.', source: 'Ouyang & Xu, International Journal of STEM Education (meta-analysis)', url: 'https://doi.org/10.1186/s40594-024-00469-4', year: '2024', tag: 'verified' },
      { value: '83% vs 61%', label: 'of FIRST alumni majored in a STEM field, compared with similar non-participants', detail: 'Correlational and funded by FIRST. Engineering or CS majors: 61% versus 26%.', source: 'Brandeis University, FIRST Longitudinal Study Final Report', url: 'https://heller.brandeis.edu/cyc/reports/the-first-longitudinal-study-final-report.pdf', year: '2024 (10-year study)', tag: 'verified' },
      { value: '2.6×', label: 'students taught four or five technology topics, such as robotics and 3D design, are 2.6 times more likely to want a STEM job than those taught one or none', detail: 'They are also 2.2 times more likely to declare a STEM major. A one-time survey: it shows a link, not a cause.', ...GEN_Z, tag: 'verified' },
      /* The figure on the team poster, which words it as "tech". Printed page 14 and chart 6
         of the report: a web survey of 4,116 US students in grades 5 to 12, June 2 to 20,
         2021. The question was "Do you have plans or hope to someday go to college for
         computer science or a computer science related major?". Yes: 42% where the student
         says the school offers computer science classes, 18% where it does not. "Don't know":
         22% and 35%. It led the page until 2026-11-24. */
      { value: '42% vs 18%', label: 'of students plan to study computer science in college, where their school offers computer science classes and where it does not', detail: 'The figure on our poster. It is about computer science classes, not robotics. As reported by students in grades 5 to 12.', source: 'Gallup and Amazon Future Engineer, Developing Careers of the Future', url: 'https://www.amazonfutureengineer.com/research/developing-careers-report.pdf', year: '2021', tag: 'verified' },
    ],
  },
];

/** "What nobody counts": the two national measures closest to robotics, both old, one ended. */
export const uncounted: Figure[] = [
  {
    value: '16.9%',
    label: 'of students attended a high school that offered a robotics course',
    detail: 'The most recent national figure we could find. It is from 2013 transcripts, so treat it as a floor, not a current number.',
    source: 'NCES, HSLS:09 Table J4',
    url: 'https://nces.ed.gov/surveys/hsls09/tables/engineering_courses_available_to_students_j4.asp',
    year: '2013',
    tag: 'verified-older',
  },
  {
    value: '46%',
    label: 'of eighth graders reached Proficient on the national test of technology and engineering literacy',
    detail: 'The test was given in 2014 and 2018. There will be no newer result: it was retired in 2023.',
    source: 'NCES, Condition of Education: Technology and Engineering Literacy',
    url: 'https://nces.ed.gov/programs/coe/indicator/snd/technology-engineering-literacy',
    year: '2018',
    tag: 'verified-older',
  },
];

/** Two things the page says in a sentence, not as a figure. Each was opened on 2026-11-24. */
export const notes = {
  retired: { source: 'National Assessment Governing Board, news release of August 4, 2023', url: 'https://www.nagb.gov/news-and-events/news-releases/2023/governing-board-decides-to-sunset-the-naep-tel-assessment.html' },
  nextSurvey: { source: 'CADRE, The 2027 National Survey of Science, Mathematics, Computer Science, and Engineering Education', url: 'https://cadrek12.org/projects/2027-national-survey-science-mathematics-computer-science-and-engineering-education' },
};
