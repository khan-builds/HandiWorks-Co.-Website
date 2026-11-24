/** What one hand is made of and what a classroom needs besides. The Kit and For teachers both
    read this, so the two pages cannot disagree.
    Sources: the team's cost table of 2026-11-24 (the bought parts; the prices themselves are
    in compare.ts), the team's final poster (the circuit), and the CAD notes on the build
    machine (the printed parts and their sizes, SLDP CAD, Final v3). Add nothing that is not in
    one of those. */

/* Whether a kit arrives with its parts already printed is not decided, so the site says
   "printed" or "bought" and does not say by whom. */
export const printed = [
  { item: 'Four finger modules', note: 'Each is a three-segment finger on its own motor housing.' },
  { item: 'Thumb module', note: 'It swings across the palm and curls, on two motors.' },
  { item: 'Palm', note: 'One part with a socket for each finger module.' },
  { item: 'Electronics housing', note: 'A plate for the boards, a curved shell that is the back of the hand, and an end cap.' },
];

/* `qty` 0 means the cost table gives no count: it keeps these under contingency. */
export const bought = [
  { item: 'Arduino Mega 2560', qty: 1, note: 'The small programmable board that runs the hand.' },
  { item: 'Adafruit Motor Shield', qty: 2, note: 'Each one switches three motors on and off.' },
  { item: 'DC motor', qty: 6, note: 'One in each finger, two in the thumb.' },
  { item: 'Battery', qty: 1, note: '7.2 V. It powers the motors.' },
  { item: 'Tilt sensor (IMU)', qty: 1, note: 'So the hand can tell which way it is being held.' },
  { item: 'Push buttons and wiring', qty: 0, note: 'Two buttons open and close the grip from the first lesson.' },
  { item: 'Screws and nuts', qty: 0, note: 'Small metric screws (M3) hold nearly everything together.' },
];

/* What a classroom needs that is not part of the hand. The print sizes are the current
   design's largest parts: the electronics plate, 155 x 176 mm on the bed, and the shell,
   144 mm tall. Whether anything has to be soldered is the team's to confirm: it is not here. */
export const needs = [
  { item: 'A 3D printer', note: 'Ordinary PLA plastic, with no support material. The largest part of the current design is about 16 × 18 cm, and the tallest stands 14.5 cm.' },
  { item: 'A computer', note: 'With the free Arduino IDE, a CAD tool such as Tinkercad, and a USB cable to the Arduino.' },
  { item: 'Small hex keys', note: 'For the screws.' },
];

/** One hand for a group of four (Lingbo, 2026-11-24), so a class of 24 needs six. */
export const GROUP = 4;
export const CLASS_SIZE = 24;
