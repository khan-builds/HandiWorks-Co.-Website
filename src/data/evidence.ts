/**
 * Figures for The Problem page. Each one was checked against its primary source and carries
 * the link and the year. Most come from the team's research doc, tagged "verified" or
 * "verified-older" there. `pursuit` is the figure on the team poster, checked against the
 * report itself on 2026-11-17. Do not add a figure nobody has opened the source for.
 * Research doc: https://docs.google.com/document/d/16nejGyEHBNWbVGut84JWVoOm16CMv4mFmbZtgO3BGVU/edit
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

const CODE_2025 = { source: 'Code.org, 2025 State of AI + CS Education', url: 'https://advocacy.code.org/stateofcs/', year: '2024–25 school year' };
const CODE_2024 = { source: 'Code.org / CSTA / ECEP, 2024 State of Computer Science Education', url: 'https://drive.google.com/file/d/1iXkNx3m80BcHC_5GghjPrppf47EDmpiC/view', year: '2023–24 school year' };

export const headline: Figure[] = [
  { value: '60%', label: 'of US public high schools offer a foundational computer science course', detail: 'Only 6.1% of high-school students are enrolled in one. Access has sat at 60% for two years.', ...CODE_2025, tag: 'verified' },
  { value: '37%', label: 'of US middle schools offer computer science at all', ...CODE_2024, tag: 'verified' },
  { value: '$24,250', label: 'median season budget for one FIRST Robotics Competition team', detail: 'Registration alone is $6,500 for the 2026–27 season.', source: 'FIRST, Median Team Budget for FRC (rev. Aug 2025) and Cost & Registration', url: 'https://info.firstinspires.org/hubfs/web/program/frc/resources/example-budget.pdf', year: '2025', tag: 'verified' },
];

/** `label` is the boxed section label, `title` the sentence under it. */
export const sections: { label: string; title: string; intro: string; figures: Figure[] }[] = [
  {
    label: 'Access',
    title: 'Access depends on where you live and how big your school is',
    intro: 'The same course is far more likely to exist in a large suburban school than in a small rural one.',
    figures: [
      { value: '70 / 58 / 56%', label: 'of suburban, urban, and rural high schools offer computer science', ...CODE_2024, tag: 'verified' },
      { value: '2.1×', label: 'large schools are 2.1 times more likely than small schools to offer these courses', detail: '91% of large schools versus 43% of small schools.', ...CODE_2024, tag: 'verified' },
      { value: '66%', label: 'of Native American and Alaskan students attend a school that offers computer science, the lowest of any group', ...CODE_2024, tag: 'verified' },
      { value: '34%', label: 'of students enrolled in foundational computer science are young women', ...CODE_2025, tag: 'verified' },
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
    title: 'The teachers who could run it are stretched thin',
    intro: 'Most computer science teachers are part-time in the subject and often the only one in their building.',
    figures: [
      { value: '42%', label: 'of PK–12 computer science teachers are full-time CS teachers', source: 'CSTA, 2025 Computer Science Teacher Landscape (2,882 teachers)', url: 'https://landscape.csteachers.org/', year: 'Fall 2024', tag: 'verified' },
      { value: '50%', label: 'have no other computer science teacher at their school', source: 'CSTA, 2025 Computer Science Teacher Landscape', url: 'https://landscape.csteachers.org/', year: 'Fall 2024', tag: 'verified' },
      { value: '17%', label: 'can take professional development as often as they need', source: 'CSTA, 2025 Computer Science Teacher Landscape', url: 'https://landscape.csteachers.org/', year: 'Fall 2024', tag: 'verified' },
    ],
  },
  {
    label: 'Evidence',
    title: 'Hands-on robotics works when students can get it',
    intro: 'The research is positive on learning and attitudes, with honest caveats on effect sizes and study design.',
    figures: [
      { value: 'g = 0.49', label: 'pooled effect of educational robotics on STEM learning across 21 studies', detail: 'Learning performance g = 0.67; attitudes g = 0.50. Computational-thinking effects were not significant.', source: 'Ouyang & Xu, International Journal of STEM Education (meta-analysis)', url: 'https://doi.org/10.1186/s40594-024-00469-4', year: '2024', tag: 'verified' },
      { value: '83% vs 61%', label: 'of FIRST alumni majored in a STEM field, compared with similar non-participants', detail: 'Correlational and funded by FIRST. Engineering or CS majors: 61% versus 26%.', source: 'Brandeis University, FIRST Longitudinal Study Final Report', url: 'https://heller.brandeis.edu/cyc/reports/the-first-longitudinal-study-final-report.pdf', year: '2024 (10-year study)', tag: 'verified' },
    ],
  },
];

export const older: Figure = {
  value: '16.9%',
  label: 'of students attended a high school that offered a robotics course',
  detail: 'The most recent national figure we could find. It is from 2013 transcripts, so treat it as a floor, not a current number.',
  source: 'NCES, HSLS:09 Table J4',
  url: 'https://nces.ed.gov/surveys/hsls09/tables/engineering_courses_available_to_students_j4.asp',
  year: '2013',
  tag: 'verified-older',
};

export const arduino = {
  value: '$49.90',
  label: 'Arduino Mega 2560 Rev3, the controller inside every HelpingHand kit',
  source: 'Arduino official US store',
  url: 'https://store-usa.arduino.cc/products/arduino-mega-2560-rev3',
  year: '2026',
};

/**
 * The poster's figure. Gallup with Amazon Future Engineer, "Developing Careers of the Future",
 * 2021, printed page 14 and chart 6: a web survey of 4,116 US students in grades 5 to 12,
 * fielded June 2 to 20, 2021. The question was "Do you have plans or hope to someday go to
 * college for computer science or a computer science related major?". Yes: 42% where the
 * student says the school offers computer science classes, 18% where it does not.
 * "Don't know": 22% and 35%. The report is about computer science, not "tech" in general.
 */
export const pursuit = {
  caption: 'Plan to study computer science in college',
  without: { value: '18%', fill: 18, short: 'No computer science classes at school', label: 'of students whose school does not offer computer science classes' },
  withClasses: { value: '42%', fill: 42, short: 'Computer science classes at school', label: 'of students whose school does offer them' },
  detail: 'As reported by students in grades 5 to 12. Those without the classes also answered "don\'t know" more often, 35% against 22%.',
  source: 'Gallup and Amazon Future Engineer, Developing Careers of the Future',
  url: 'https://www.amazonfutureengineer.com/research/developing-careers-report.pdf',
  year: '2021',
};
