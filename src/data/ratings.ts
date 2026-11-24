/**
 * Every mark in the "How we compare" grid: which of the 49 mechanics concepts each option
 * explains (E), has the student build from steps (S), or has the student make (M), and the
 * page each mark was read on, with that page's own words. The rules are in compare.ts.
 * Read on 2026-11-24, from each maker's or organizer's own sites only.
 *
 * Marks were given generously to the other options: a thin mention still earns the mark, and
 * for VEX and FIRST guidance on designing a custom robot counts as "made by the student" even
 * where no task is set. A concept that is missing earned nothing we could find.
 */
import type { Key, Rating } from './compare';

const E = (url: string, q: string): Rating => ({ m: 'E', url, q });
const S = (url: string, q: string): Rating => ({ m: 'S', url, q });
const M = (url: string, q: string): Rating => ({ m: 'M', url, q });
/** Built from steps, where the instructions are pictures: `seen` says what they show. */
const SHOWN = (url: string, seen: string): Rating => ({ m: 'S', url, seen });
const W: Rating[] = [{ m: 'W' }];

// ---- VEX V5: the VEX Library, V5 STEM Labs and activities, and the build instructions ----
const KB = 'https://kb.vex.com/hc/en-us/articles/';
const LAB = 'https://education.vex.com/stemlabs/v5/stem-labs/';
const ACT = 'https://content.vexrobotics.com/assets/education/stem-labs/docs/v5/Activities/V5%20Activity%20-%20';
const CLAWBOT = 'https://content.vexrobotics.com/docs/276-6009-750-Rev6.pdf';
const GRSF = 'https://library.globalrobotics.org/hc/en-us/articles/';
const BUILDING = KB + '360046701172-Building-with-VEX-V5';
const OWN = 'When you are ready to start building your first custom-designed robot, the following articles will assist you';
const GEAR_RATIOS = KB + '360035590932-Using-Gear-Ratios-with-the-V5-Motor';
const CHAINS = KB + '6339264416020-Overview-of-V5-Chains-and-Sprockets';
const SHAFTS = KB + '360035591372-Using-V5-Shafts';
const ARMS = KB + '360037389012-Building-V5-Robot-Arms';
const LIFTS = KB + '360037388692-Building-V5-Robot-Lift-Systems';
const DRIVE = KB + '360035952771-Creating-a-V5-Drivetrain';
const WHEELS = KB + '38888566734612-Understanding-VEX-V5-Wheels';
const ASSEMBLY = KB + '360035592932-Selecting-a-V5-Assembly';
const LAUNCH = KB + '10004528811412-Understanding-V5-Mechanical-Launching-Systems';
const CHASSIS = KB + '360035953131-Designing-a-V5-Chassis';
const DEX = KB + '40241402832660-An-Introduction-to-Dex-The-V5RC-Push-Back-Hero-Bot';
const AXEL = KB + '28421674310420-An-Introduction-to-Axel-The-V5RC-High-Stakes-Hero-Bot';

const vex: Record<number, Rating[]> = {
  1: [E(GEAR_RATIOS, 'Torque is twisting force that helps turn something, like a wheel, gear, or robot arm.')],
  2: [E(LAB + 'mechanical-advantage/building-mechanical-advantage-with-gears', 'When two gears are meshed a mechanical advantage is produced if the circumference of the gears differs.')],
  3: [E(LAB + 'gravity-rush/center-of-gravity', 'Every object has a center of gravity (CoG).')],
  4: [E(LAUNCH, 'Both bearings and bushings work by reducing the friction between the rotating shaft and the fixed support.')],
  8: [E(LIFTS, 'They work by placing a pulley at the top of a Linear Slide Track.')],
  9: [
    E(GEAR_RATIOS, 'The gear that provides the power, or input, is called a driving gear and the gear that is being turned, or responsible for the output, is called the driven gear.'),
    S(KB + '4401920547988-An-Introduction-to-Moby-the-V5RC-Tipping-Point-Hero-Bot', 'Combining the two gear ratios of 3:1 and 5:1 form a compound gear ratio of 15:1'),
    M(GEAR_RATIOS, 'Fortunately, the gear ratios used with the build instructions for the assembly of the V5 ClawBot are sufficient to start designing custom robots.'),
  ],
  10: [E(KB + '360035952751-Using-Spur-Gears-with-the-V5-Motor', 'The VEX EDR system has two types of spur gears, the Gear Kit and the High Strength Gear Kit.'), S(CLAWBOT, '1x 84T High Strength Gear')],
  11: [E(LAB + 'mechanical-advantage/applying-gears-to-this-build', 'The resultant gear ratio from each stage of our V5 Gear Box is 1:5, a low gear ratio.'), S(LAB + 'mechanical-advantage/build-instructions', 'Build the V5 Gear Box')],
  12: [E(ACT + 'How%20Big%20Are%20Your%20Teeth.pdf', 'The tooth size for gears and sprockets is called pitch.')],
  13: [
    E(CHAINS, 'A chain and sprocket system refers to the interface between chains and sprockets for the purpose of driving, lifting, or enforcing power on another shaft.'),
    S(DEX, 'The Conveyor system on Dex uses a variety of Chain Links along with Conveyor Belt Inserts.'),
    M(CHAINS, 'There are many elements to consider when designing using chains and additional links.'),
  ],
  15: [
    E(AXEL, 'The drivetrain operates as a two-wheel direct drive drivetrain, as the shaft stretches directly from the motor to the wheels without using gears or a chain and sprocket system.'),
    S(AXEL, 'The drivetrain operates as a two-wheel direct drive drivetrain'),
  ],
  16: [E(SHAFTS, 'Shafts need to be captured in order to have the shaft spin freely and still not slide out of the assemble.'), S(CLAWBOT, '23x Rubber Shaft Collar')],
  17: [E(SHAFTS, 'In addition, in nearly all assemblies it is important to provide at least two parallel points of support.'), S(CLAWBOT, '5x Bearing Flat')],
  18: [E(ARMS, 'Linkage arms involve more than one pivoting bar which makes linkages between a tower and an end tower.')],
  19: [
    E(ARMS, 'The 4-bar arm is a linkage arm and is usually the easiest type of linkage arm to assemble.'),
    S(ACT + 'Stack%20Attack.pdf', 'Your initial test of the arm should use the 4-bar arm that is part of the Clawbot build.'),
    M(BUILDING, OWN),
  ],
  21: [E(KB + '7107240154260-Overview-of-VEX-Screws', 'For pivot points there are also #8-32 Shoulder Screws which have a short unthreaded section and this area creates less friction for a pivot point.')],
  23: [E(ASSEMBLY, 'A motor will rotate the cam which pushes the lever arm down and stretches the rubber bands.')],
  24: [E(ASSEMBLY, 'The modified spur gear is sometimes called a slip-gear.')],
  25: [
    E(ARMS, 'Arms are usually attached to a tower on the robot chassis and are used to lift another manipulator on the end of the arm.'),
    S(AXEL, 'The third motor on Axel controls the arm.'),
    M(ACT + 'Put%20a%20Ring%20on%20It.pdf', 'Modify your robot’s arm so that it can place the second roll on the taller post.'),
  ],
  26: [
    E(ARMS, 'The double reverse 4-bar arm requires the most planning and time to assemble.'),
    M(ARMS, 'When designing a double reverse 4-bar arm it is important to provide clearance so the top 4-bar can pass either to the inside or to the outside of the bottom 4-bar.'),
  ],
  27: [E(LIFTS, 'Scissor lifts are assembled by creating a pivot point at the midsection of two structural pieces of metal which are crossed.'), M(BUILDING, OWN)],
  28: [E(LIFTS, 'Chain lifts are sometimes called cascading lifts.'), M(BUILDING, OWN)],
  29: [E(LIFTS, 'Linear Slides are assembled using the Linear Motion Kit.'), M(BUILDING, OWN)],
  30: [E(LIFTS, 'This will allow the rack bracket assembly to travel up and down the linear slide track as the spur gear drives over the Rack Gear.')],
  32: [
    E(DRIVE, 'Identifying which kind of drivetrain to use is one of the first considerations when designing a robot.'),
    S(DEX, 'Dex has a four wheel, two motor drivetrain, allowing the Hero Bot to easily maneuver around the V5RC Push Back field.'),
    M(BUILDING, OWN),
  ],
  33: [E(DRIVE, 'The Standard Drivetrain is also known as a skid steer drive and is one of the most common types of drivetrains.')],
  34: [E(DRIVE, 'The Mecanum Drivetrain design utilizes Mecanum Wheels.'), M(DRIVE, 'A design mistake which can be made with the Mecanum drivetrain is not placing the Mecanum Wheels in the correct orientation.')],
  36: [
    E(WHEELS, 'Omni-directional wheels\' rollers allow a robot to turn much easier than rubber tires.'),
    S(CLAWBOT, '2x 4” Omni-Directional Wheel'),
    M(WHEELS, 'Choosing which wheel to use can be a critical decision and can determine the success of a robot’s design; each type of wheel has advantages and disadvantages.'),
  ],
  37: [
    E(KB + '360035592952-Building-V5-Robot-Claws', 'Claws are usually attached to an end of an arm and are used for grasping an object.'),
    S(ACT + 'The%20Claw.pdf', 'Make small changes to the claw already on the Clawbot.'),
    M(ACT + 'The%20Claw.pdf', 'Change the design of your claw to better move the object to the green zone.'),
  ],
  38: [
    E(ASSEMBLY, 'Roller intakes can be assembled using the Intake Rollers or wheels.'),
    S(DEX, 'Dex\'s Intake uses multiple gear trains, rubber bands, and chain links'),
    M(ASSEMBLY, 'A custom assembly for roller intakes can be made using High Strength Sprockets fixed to a shaft'),
  ],
  39: [
    E(ASSEMBLY, 'Conveyor belts are typically assembled using the Tank Tread Kit, the Tank Tread Upgrade Kit and/or the Highest Strength sprockets and chains.'),
    S(DEX, 'The Conveyor system on Dex uses a variety of Chain Links along with Conveyor Belt Inserts.'),
    M(BUILDING, OWN),
  ],
  40: [E(LAUNCH, 'An object that is used to increase rotational inertia of a system is known as a flywheel'), M(BUILDING, OWN)],
  41: [
    E(KB + '17126345547156-Understanding-the-V5-Pneumatics-Kit-Components', 'Cylinders use the energy of the compressed air to create motion.'),
    M(KB + '17193212326036-Example-V5-Pneumatics-Kit-Configurations', 'This article guides you through some V5 Pneumatics System configurations which you can then tailor to suit your own setup.'),
  ],
  42: [
    E(CHASSIS, 'There are C-Channels available in 5 Hole and 2 Hole width in both steel and aluminum.'),
    S(CLAWBOT, '2x C-Channel 1x2x1x15'),
    M(ACT + 'Hang%20Out.pdf', 'Using plates, channels, and/or angles, build a device that hangs out the largest distance off your desk.'),
  ],
  43: [
    E(KB + '360035952791-Using-V5-Fasteners', 'Fasteners are parts which connect metal pieces and other components together.'),
    S(CLAWBOT, '30x #8-32 Hex Nut'),
    M(ACT + 'Get%20in%20Shape.pdf', 'Using at least 3 screws and 3 nuts, build a triangle out of plates, channels, or angles.'),
  ],
  44: [
    E(KB + '360035590992-Stiffening-a-V5-Chassis', 'There are a number of assembly mistakes which should be avoided and techniques which can be used to stiffen a chassis and make it more rigid.'),
    M(CHASSIS, 'There are many considerations to be made when designing a robot chassis.'),
  ],
  46: [E(CHASSIS, 'VEX offers metal structure pieces in two material options: steel and aluminum.'), M(CHASSIS, 'Things to consider when selecting a structural metal material.')],
  47: [
    E(KB + '13078845924884-Understanding-and-Using-V5-Tools', 'The V5 Kits contain two main tools; the Open End Wrench and the T15/T8 Star Drive Key or T15/T8 Star Screwdriver.'),
    S(CLAWBOT, 'Hacksaw is required, ask a parent/mentor for help.'),
    M(BUILDING, 'However, custom-designed robots may require the structural parts to be cut and/or bent into custom pieces.'),
  ],
  49: [
    E(GRSF + '52987181366932-Engineering-Notebook-Basics', 'The engineering design process is the backbone of an engineering notebook.'),
    M(LAB + 'design-by-request/design-your-build', 'Answer the following questions in your engineering notebook as you design your build.'),
  ],
};

// ---- FIRST Tech Challenge: FIRST's own docs, manuals and its 2021-22 Class Pack lessons ----
const DOCS = 'https://ftc-docs.firstinspires.org/en/latest/';
const GLOSSARY = DOCS + 'glossary/glossary.html';
const PRINTED = DOCS + 'manufacturing/3d_printing/3d_printed_parts/3d_printed_parts.html';
const MAKING = DOCS + 'manufacturing/index.html';
const MENTOR = 'https://www.firstinspires.org/hubfs/web/program/ftc/ftc-mentor-manual.pdf';
const GAME = 'https://ftc-resources.firstinspires.org/ftc/game/manual';
const PACK = 'https://info.firstinspires.org/hubfs/Education_Resources/thinkscape/ftc-classpack/2021/Lesson%20Guides/';
const P_CHASSIS = PACK + 'Robot/ChassisTeacher%20(1).pdf';
const P_ARM = PACK + 'Robot/ManipulatorTeacher.pdf';
const P_MACHINES = PACK + 'MachinesMechanisms/SimpleMachinesTeacher.pdf';
const P_LINKS = PACK + 'MachinesMechanisms/LeversLinkagesTeacher.pdf';
const P_CONVEY = PACK + 'MachinesMechanisms/ConveyanceTeacher.pdf';
const P_LINEAR = PACK + 'MachinesMechanisms/LinearMotionTeacher.pdf';

const ftc: Record<number, Rating[]> = {
  1: [E(DOCS + 'tech_tips/tech-tips/tech-tip-motor-servo-power/tech-tip-motor-servo-power.html', 'Mechanical Power(W) = torque (N-m) x angular speed (rad/s)')],
  2: [E(P_LINEAR, 'Know how to calculate mechanical advantage for a pulley system.')],
  3: [E(P_CHASSIS, 'The point at which you can get the beam to balance is the center of gravity for the beam.')],
  4: [E(P_CHASSIS, 'Conduct a test with different wheel coefficients of friction to consider the impacts of using a grip wheel versus a treadwheel.')],
  6: [E(P_MACHINES, 'Explore simple and compound machines and how they are used in robot manipulators.'), M(P_MACHINES, 'Brainstorm possible ways of developing more complex machines with different combinations of simple machines.')],
  7: [E(P_LINKS, 'discuss the different types of levers covered in the curriculum')],
  8: [E(P_LINEAR, 'Know how to calculate mechanical advantage for a pulley system.'), M(P_LINEAR, 'They can use some of the REV parts to create their own pulleys for a class setting.')],
  9: [E(GLOSSARY, 'Gearing down trades speed for torque; gearing up does the reverse.'), M(MENTOR, 'Investigate and experiment with gear ratios.')],
  10: [E(P_ARM, 'Have students assemble a basic gear train as shown in the manipulator video.'), M(PRINTED, '3D Prints can also be used to make your own pulleys and gears.')],
  13: [E('https://www.firstinspires.org/hubfs/Education_Resources/scope-sequence/FTC/scope-sequence-ft-fy21.pdf', '8-2 Pulley and Chain Systems')],
  14: [M(DOCS + 'manufacturing/3d_printing/3d_printing_intro/3d_printing_intro.html', 'This can be used to create pulleys or gears with a specific number of teeth')],
  16: [M(PRINTED, 'create spacers and shims to constrain objects on your robot')],
  18: [
    E(P_LINKS, 'Understand degrees of freedom and geometry when designing mechanisms that involve linkages.'),
    M(P_LINKS, 'Prototype linkages and cams that could help you achieve your game strategy.'),
  ],
  19: [E(P_LINKS, 'Discuss with students the examples in the curriculum relating to four-bar linkages, six-bar linkages, and cams.')],
  22: [E(P_LINKS, 'Explore ways you can transform motion and develop mechanisms with linkages and cams.')],
  23: [E(P_LINKS, 'Cams can be useful for transforming rotary motion to linear motion.'), M(P_LINKS, 'consider allowing them to experiment and make one with parts from their kit')],
  25: [E(P_ARM, 'How does the length of the arm affect the angular velocity (speed), and motor torque?'), M(P_ARM, 'They should begin the process of building something that could acquire the game object.')],
  29: [
    E(P_LINEAR, 'Gain a better understanding of how to design linear slides and pulley systems.'),
    M(P_LINEAR, 'If you have determined that you should add linear slides to your robot design, develop a project management plan for how they will be prototyped and added to the robot.'),
  ],
  30: [E(P_LINEAR, 'Understand different ways of achieving linear motion through worm gears and rack and pinions.'), M(P_LINEAR, 'have students research, design, and 3D print their own')],
  32: [
    E(MENTOR, 'One of the major robot systems is the drive train, which moves it around on the field.'),
    M(MENTOR, 'The team determines what defines an acceptable performance. Experiment and determine what works best.'),
  ],
  33: [E(MENTOR, 'The most traditional drive train configuration is called "skid-steer," sometimes called "tank drive."')],
  34: [E(GLOSSARY, 'A drivetrain using wheels with rollers set at 45° around the rim.')],
  36: [E(GLOSSARY, 'An unpowered wheel, fitted with an Encoder, that rolls along the floor purely to measure how far the robot has traveled.')],
  37: [E(GAME, 'Simple gripper claws, comprised of a single actuator moving 2 gripper jaws simultaneously'), M(PRINTED, 'A common way to do this is a custom shaped claw.')],
  38: [E(P_CONVEY, 'Discover design principles needed for intake or shooting systems.'), M(PRINTED, 'creating custom intakes, primarily surgical tubing')],
  39: [
    E(P_CONVEY, 'How might adding conveyance systems and trajectory help your robot be more efficient?'),
    M(P_CONVEY, 'conduct a brainstorming session to determine how you might incorporate intakes, conveyors, or shooters into your design'),
  ],
  40: [
    E(P_CONVEY, 'Experiment with trajectory, speed, and velocity to propel objects.'),
    M(P_CONVEY, 'conduct a brainstorming session to determine how you might incorporate intakes, conveyors, or shooters into your design'),
  ],
  42: [M(PRINTED, '3D Prints can be used to make mounting brackets for motors, servos, electrical parts, bearings, and various other objects.')],
  43: [E(DOCS + 'manufacturing/3d_printing/designing_and_slicing/working_with_screws/working_with_screws.html', 'Nuts and Locknuts can be embedded into prints, removing the need for a wrench when tightening a screw.')],
  44: [
    E(P_CHASSIS, 'How can we design and build a chassis that considers the center of gravity, speed, and torque and is rigid enough to hold the robot sub-systems?'),
    M(P_CHASSIS, 'Students create their own custom chassis, modifying a build guide to fit their design criteria.'),
  ],
  46: [E(DOCS + 'manufacturing/3d_printing/filament_choice/common_filaments/common_filaments.html', 'PLA is very stiff, but can be brittle, especially under shock loads (impacts), and parts should be designed with this in mind.')],
  47: [
    E(MAKING, 'This section will cover some of the most common manufacturing methods used in FTC for creating these parts.'),
    M(MENTOR, 'These parts can be drilled, cut, or otherwise modified to create customized elements for each robot.'),
  ],
  48: [
    E(DOCS + 'cad_resources/index.html', 'Computer Aided Design (CAD) and 3D animation software is used in FIRST Tech Challenge by teams to design and visualize complex systems prior to manufacturing.'),
    M(MAKING, 'it is recommended that a team design their robot (or at least the part that needs to be made) in a CAD software'),
  ],
  49: [
    E(MENTOR, 'This journey encompasses the phases of the problem definition, concept design, system-level design, detailed design, test and verification, and production of the robot.'),
    M(GAME, 'evidence of use of the engineering process'),
  ],
};

// ---- LEGO Education Computer Science & AI kit, grades 6-8 ----
/* Only one of the kit's 30 lessons opens without signing in to LEGO's teacher portal, so
   these marks rest on that lesson, on two building-instruction files that open, and on the
   "get started" page. Nothing in what opened explains a mechanics concept by name. */
const LEGO_TEACH = 'https://teach.legoeducation.com/en-us/computer-science';
const lego: Record<number, Rating[]> = {
  10: [SHOWN('https://teach.legoeducation.com/assets/contentstack/C123_BI.pdf', 'Building instructions for "Art Designer", steps 6 to 8 and 11: two gear wheels that mesh')],
  15: [SHOWN('https://teach.legoeducation.com/assets/contentstack/C101_BI.pdf', 'Building instructions for "Restaurant Rookie", steps 1 to 4: wheels pushed straight onto the motor')],
  22: [S(LEGO_TEACH + '/lesson/drop-from-the-top/building-instructions', 'the motorized carrier will gradually move up the tower and then quickly drop down')],
  30: [SHOWN(LEGO_TEACH + '/lesson/drop-from-the-top/building-instructions', 'Building instructions for "Drop from the Top", steps 1 and 11: a geared carrier on two toothed racks')],
  49: [M(LEGO_TEACH + '/get-started', 'In design challenges, students collaboratively create their own model and code.')],
};

// ---- Makeblock mBot2 ----
/* Four of the marks (16, 25, 37, 42) need the $79.99 add-on pack, whose robotic arm is built
   from its own assembly guide. */
const MBOT_BUILD = 'https://support.makeblock.com/hc/en-us/articles/1500006253942-Assemble-mBot-Neo-mBot2';
const MBOT_ADDON = 'https://support.makeblock.com/hc/article_attachments/9673630927639';
const mbot: Record<number, Rating[]> = {
  1: [E('https://cdn.shopify.com/s/files/1/0070/5901/3716/files/EN_lesson_1.pdf?v=1723531941', 'This code block allows you to move the mBot2 forward, backward, left and right at a specific rotational speed of the wheels and for a number of seconds.')],
  15: [SHOWN(MBOT_BUILD, 'Assembly guide, step 4: a wheel is screwed onto each motor’s shaft')],
  16: [SHOWN(MBOT_ADDON, 'Add-on pack assembly guide, parts list: shaft collar, D shaft, set screw')],
  25: [SHOWN(MBOT_ADDON, 'Add-on pack assembly guide: a robotic arm, steps 1 to 21')],
  37: [SHOWN(MBOT_ADDON, 'Add-on pack assembly guide: the arm’s servo gripper, steps 8 to 11')],
  42: [SHOWN(MBOT_ADDON, 'Add-on pack assembly guide, parts list: beam, slide beam, plate, bracket')],
  43: [SHOWN(MBOT_BUILD, 'Assembly guide, parts list: M4 screws and a screwdriver')],
  44: [SHOWN(MBOT_BUILD, 'Assembly guide: a chassis that comes as one ready-made part')],
  47: [M('https://www.makeblock.com/pages/mbot2-coding-robot', 'Use a 3D printer to create struts to hold a servo.')],
};

// ---- HelpingHand, from this site as it stands ----
const SIM = '/dashboard/student/simulator/';
const L1 = '/lessons/beginner/01-finger-module/';
const L1_CAD = '/lessons/beginner/01-finger-module/cad/';
/* Explained: Lesson 1 and the Simulator's steps. Made by the student: what Lesson 1 has them
   draw in CAD. W: the hand has it or a lesson is planned, and nothing here teaches it yet. */
const hh: Record<number, Rating[]> = {
  7: [E(SIM, 'A bar that turns on a pin is a lever.')],
  18: [E(L1, 'A link is a bar that swings on a joint.'), M(L1_CAD, 'Add the rest of the folding links.')],
  19: [E(SIM, 'Four bars joined in a loop is a four-bar linkage.')],
  21: [E(L1, 'A joint is a round hole with a pin through it.'), M(L1_CAD, 'Add the first round joints above the drive bar.')],
  26: [E(SIM, 'A six-bar. A double reverse four-bar.')],
  48: [E(L1_CAD, 'You will build the finger in five steps.'), M(L1_CAD, 'In your own CAD file, add only the new piece.')],
  1: W, 2: W, 9: W, 10: W, 20: W, 22: W, 30: W, 37: W, 43: W, 47: W,
};

/* Sphero BOLT+ earned no mark on the pages that opened. Its lessons live in an app that did
   not open for the tools used, so its row is "not checked", which the page says. */
export const RATINGS: Record<Key, Record<number, Rating[]>> = { lego, vex, mbot, sphero: {}, ftc, hh };

/** How the marks above were checked on 2026-11-24: a script opened every linked page and
 *  looked for the quoted words. `quoted` marks carry a quote and `found` of them were found on
 *  their pages; the rest are on VEX STEM Lab pages, which refuse the script's requests.
 *  `pictures` marks describe a build-instruction picture and were not re-checked. */
export const CHECKED = { quoted: 134, found: 129, pictures: 10 };
