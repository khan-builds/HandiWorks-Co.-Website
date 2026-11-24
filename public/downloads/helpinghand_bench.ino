// helpinghand_bench.ino
// The sketch behind the site's "Test your code" page. The page sends this board short lines
// of text over the USB cable; the board runs the motors and sends lines back.
//
// Board:   Arduino Mega 2560
// Motors:  DC motors on two Adafruit Motor Shields V2, which talk on SDA and SCL
// Sensor:  an MPU-6050 on the same SDA and SCL (it can be left out)
// Buttons: two, optional. Each goes from its pin to GND.
// Library: "Adafruit Motor Shield V2 Library" (Arduino IDE: Tools > Manage Libraries)
//
// NOT YET COMPILED, AND NOT YET RUN ON THE REAL HAND. It was written from the libraries'
// documentation on a machine with no Arduino tools. Press Verify first and fix what it reports.
// Then start with the hand held clear of everything, and time each motor before trusting any
// number below.
//
// The hand has nothing that measures where a finger is. This sketch keeps a guess for each
// motor instead: it knows how long a motor takes from open to closed, so it counts how long
// it has run it. Whenever the guess and the real finger drift apart, use Reset on the page.
//
// The lines, at 115200 baud, each ended by a newline:
//   page to board   ?           who are you
//                   T m pct     motor m to pct (0 to 100) of the way from open to closed
//                   J m dir     nudge motor m: -1 toward open, 1 toward closed, 0 stop.
//                               The guess does not change. Stops by itself after JOG_HOLD_MS.
//                   Z           the hand is open now: every guess becomes 0
//                   S           stop every motor where it is
//   board to page   HELLO helpinghand-bench 1 motors=2,3,4,5 imu=1 buttons=1
//                   P 2:45.0/60 ...       per motor: the guess / where it is going, in percent
//                   G ax ay az gx gy gz   accelerometer in g, gyroscope in degrees per second
//                   B close open          the two buttons, 1 while held down
//                   E words               something is wrong
// The page's copy of this list is src/scripts/bench/protocol.ts. Change the two together.

#include <Wire.h>
#include <Adafruit_MotorShield.h>

// ======================= YOUR WIRING: everything to change is in this block =======================

// The two shields. A shield with no address jumper soldered is 0x60; with jumper A0 bridged, 0x61.
const uint8_t SHIELD_A_ADDRESS = 0x60;
const uint8_t SHIELD_B_ADDRESS = 0x61;
Adafruit_MotorShield shieldA(SHIELD_A_ADDRESS);
Adafruit_MotorShield shieldB(SHIELD_B_ADDRESS);

// No motor is ever driven harder than this, out of 255.
const uint8_t MAX_SPEED = 175;
// No motor runs longer than this in one go, in milliseconds. Keep it above the longest TRAVEL below.
const unsigned long MAX_RUN_MS = 4000;

struct Motor {
  uint8_t id;                  // the motor's number on the wire: 0 pinky, 1 ring, 2 middle, 3 index, 4 thumb curl, 5 thumb swing
  Adafruit_MotorShield *shield;
  uint8_t port;                // M1 to M4 on that shield: 1 to 4
  int8_t closeWay;             // 1 if FORWARD closes the finger, -1 if BACKWARD does
  unsigned long travelMs;      // TRAVEL: milliseconds from fully open to fully closed at MAX_SPEED. Time it on the real hand.
  uint8_t closeAt;             // how far the "close" button takes it, in percent. From the grip of the CAD's Final v3 hand.
  // What the sketch keeps track of. Leave these alone.
  Adafruit_DCMotor *motor;
  float guess;                 // where the finger is believed to be, 0 open to 100 closed
  float goal;                  // where it has been sent
  int8_t running;              // 1 toward closed, -1 toward open, 0 released
  int8_t jogWay;               // the nudge in progress, or 0
  unsigned long runSince;
  unsigned long jogHeard;
};

// One line per motor. A finger with no motor: comment its line out, and nothing else changes.
Motor motors[] = {
  // id  shield    port  closeWay  travelMs  closeAt
  // { 0, &shieldB, 3,    1,        3000,     78 },   // pinky: no motor on this prototype
  // { 1, &shieldB, 4,    1,        3000,     78 },   // ring: no motor on this prototype
  {    2, &shieldA, 1,    1,        3000,     78 },   // middle
  {    3, &shieldA, 2,    1,        3000,     78 },   // index
  {    4, &shieldB, 1,    1,        2500,     91 },   // thumb curl
  {    5, &shieldB, 2,    1,        1500,     61 },   // thumb swing
};
const uint8_t MOTOR_COUNT = sizeof(motors) / sizeof(motors[0]);

// The two buttons. -1 means "not wired". A button goes from its pin to GND.
const int8_t BUTTON_CLOSE_PIN = -1;
const int8_t BUTTON_OPEN_PIN = -1;

// The motion sensor. Set HAS_IMU to false if there is none.
const bool HAS_IMU = true;
const uint8_t IMU_ADDRESS = 0x68;   // an MPU-6050 with its AD0 pin low

// ================================== end of the wiring block ==================================

const unsigned long JOG_HOLD_MS = 300;   // a nudge stops this long after the last "J" line for it
const unsigned long REPORT_MS = 50;      // how often the board says where things are
const unsigned long BUTTON_MS = 25;      // how often the buttons are read, which also steadies them

bool imuFound = false;
bool closeWasDown = false, openWasDown = false;
unsigned long lastLoop = 0, lastReport = 0, lastButtons = 0;
char line[40];
uint8_t lineLength = 0;

// True if something answers at this address on SDA and SCL.
bool answers(uint8_t address) {
  Wire.beginTransmission(address);
  return Wire.endTransmission() == 0;
}

// Run a motor toward closed (1), toward open (-1), or let it go (0).
void drive(Motor &m, int8_t way) {
  if (way == m.running) return;
  m.running = way;
  if (way == 0) {
    m.motor->run(RELEASE);
    return;
  }
  m.runSince = millis();
  m.motor->setSpeed(MAX_SPEED);
  m.motor->run(way * m.closeWay > 0 ? FORWARD : BACKWARD);
}

Motor *motorWithId(int id) {
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    if (motors[i].id == id) return &motors[i];
  }
  return NULL;
}

void stopAll() {
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    motors[i].goal = motors[i].guess;
    motors[i].jogWay = 0;
    drive(motors[i], 0);
  }
}

void sayHello() {
  Serial.print(F("HELLO helpinghand-bench 1 motors="));
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    if (i) Serial.print(',');
    Serial.print(motors[i].id);
  }
  Serial.print(F(" imu="));
  Serial.print(imuFound ? 1 : 0);
  Serial.print(F(" buttons="));
  Serial.println(BUTTON_CLOSE_PIN >= 0 || BUTTON_OPEN_PIN >= 0 ? 1 : 0);
}

// Act on one line from the page.
void obey(char *text) {
  char first = text[0];
  int a = 0, b = 0;
  int found = sscanf(text + 1, "%d %d", &a, &b);
  unsigned long now = millis();
  if (first == '?') {
    sayHello();
  } else if (first == 'S') {
    stopAll();
  } else if (first == 'Z') {
    for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
      motors[i].guess = 0;
      motors[i].goal = 0;
      motors[i].jogWay = 0;
      drive(motors[i], 0);
    }
  } else if (first == 'T' && found == 2) {
    Motor *m = motorWithId(a);
    if (m) {
      m->goal = constrain(b, 0, 100);
      m->jogWay = 0;
    }
  } else if (first == 'J' && found == 2) {
    Motor *m = motorWithId(a);
    if (m) {
      m->goal = m->guess;   // a nudge ends any trip the motor was on
      m->jogWay = b > 0 ? 1 : b < 0 ? -1 : 0;
      m->jogHeard = now;
      if (m->jogWay == 0) drive(*m, 0);
    }
  } else {
    Serial.print(F("E did not understand: "));
    Serial.println(text);
  }
}

// Take in whatever the page has sent, and act on each finished line.
void listen() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (lineLength) {
        line[lineLength] = 0;
        obey(line);
      }
      lineLength = 0;
    } else if (lineLength < sizeof(line) - 1) {
      line[lineLength++] = c;
    }
  }
}

// Move every motor that has somewhere to go, and keep each guess up to date.
void runMotors(unsigned long now, unsigned long passed) {
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    Motor &m = motors[i];
    if (m.jogWay != 0) {
      // A nudge: the motor turns, the guess stays. It ends when the page stops asking, or after MAX_RUN_MS.
      if (now - m.jogHeard > JOG_HOLD_MS || (m.running != 0 && now - m.runSince > MAX_RUN_MS)) {
        m.jogWay = 0;
        drive(m, 0);
      } else {
        drive(m, m.jogWay);
      }
      continue;
    }
    float left = m.goal - m.guess;
    if (fabs(left) < 0.05) {
      m.guess = m.goal;
      drive(m, 0);
      continue;
    }
    if (m.running != 0 && now - m.runSince > MAX_RUN_MS) {
      // It has run as long as it is allowed to. Stop here and call this the goal.
      m.goal = m.guess;
      drive(m, 0);
      Serial.print(F("E motor "));
      Serial.print(m.id);
      Serial.println(F(" reached MAX_RUN_MS and was stopped"));
      continue;
    }
    int8_t way = left > 0 ? 1 : -1;
    float step = passed * 100.0 / m.travelMs;
    if (m.running == way) m.guess += way * min(step, (float)fabs(left));   // it has been running this way since the last look
    drive(m, way);
  }
}

bool down(int8_t pin) {
  return pin >= 0 && digitalRead(pin) == LOW;
}

// The buttons work with no computer connected: one closes the hand, one opens it, both together stop it.
void readButtons() {
  bool closeDown = down(BUTTON_CLOSE_PIN), openDown = down(BUTTON_OPEN_PIN);
  if (closeDown == closeWasDown && openDown == openWasDown) return;
  if (closeDown && openDown) {
    stopAll();
  } else if (closeDown && !closeWasDown) {
    for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
      motors[i].goal = motors[i].closeAt;
      motors[i].jogWay = 0;
    }
  } else if (openDown && !openWasDown) {
    for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
      motors[i].goal = 0;
      motors[i].jogWay = 0;
    }
  }
  closeWasDown = closeDown;
  openWasDown = openDown;
  Serial.print(F("B "));
  Serial.print(closeDown ? 1 : 0);
  Serial.print(' ');
  Serial.println(openDown ? 1 : 0);
}

// Wake the MPU-6050. It starts asleep.
void startImu() {
  imuFound = HAS_IMU && answers(IMU_ADDRESS);
  if (!imuFound) return;
  Wire.beginTransmission(IMU_ADDRESS);
  Wire.write(0x6B);   // power management
  Wire.write(0);      // awake
  Wire.endTransmission();
}

// Read the sensor and send one "G" line: three accelerations in g, three turn rates in degrees per second.
void reportMotion() {
  Wire.beginTransmission(IMU_ADDRESS);
  Wire.write(0x3B);   // the first of 14 bytes: acceleration x y z, temperature, turn rate x y z
  if (Wire.endTransmission(false) != 0) return;
  if (Wire.requestFrom(IMU_ADDRESS, (uint8_t)14) != 14) return;
  int16_t raw[7];
  for (uint8_t i = 0; i < 7; i++) {
    uint8_t high = Wire.read();
    raw[i] = (int16_t)((high << 8) | Wire.read());
  }
  Serial.print(F("G"));
  for (uint8_t i = 0; i < 3; i++) {
    Serial.print(' ');
    Serial.print(raw[i] / 16384.0, 3);      // the sensor's 2 g range
  }
  for (uint8_t i = 4; i < 7; i++) {
    Serial.print(' ');
    Serial.print(raw[i] / 131.0, 1);        // its 250 degrees per second range
  }
  Serial.println();
}

void reportPlaces() {
  Serial.print(F("P"));
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    Serial.print(' ');
    Serial.print(motors[i].id);
    Serial.print(':');
    Serial.print(motors[i].guess, 1);
    Serial.print('/');
    Serial.print((int)(motors[i].goal + 0.5));
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  // Say so if a shield a motor needs is not answering, then carry on with the rest.
  bool needA = false, needB = false;
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    if (motors[i].shield == &shieldA) needA = true;
    if (motors[i].shield == &shieldB) needB = true;
  }
  if (needA && !answers(SHIELD_A_ADDRESS)) Serial.println(F("E shield A is not answering: check its address jumpers and SDA, SCL"));
  if (needB && !answers(SHIELD_B_ADDRESS)) Serial.println(F("E shield B is not answering: check its address jumpers and SDA, SCL"));
  if (needA) shieldA.begin();
  if (needB) shieldB.begin();
  for (uint8_t i = 0; i < MOTOR_COUNT; i++) {
    Motor &m = motors[i];
    m.motor = m.shield->getMotor(m.port);
    m.guess = 0;   // the hand is taken to be open when the board starts
    m.goal = 0;
    m.running = 0;
    m.jogWay = 0;
    m.motor->run(RELEASE);
  }
  if (BUTTON_CLOSE_PIN >= 0) pinMode(BUTTON_CLOSE_PIN, INPUT_PULLUP);
  if (BUTTON_OPEN_PIN >= 0) pinMode(BUTTON_OPEN_PIN, INPUT_PULLUP);
  startImu();
  if (HAS_IMU && !imuFound) Serial.println(F("E the motion sensor is not answering: check its wiring, or set HAS_IMU to false"));
  sayHello();
  lastLoop = millis();
}

void loop() {
  unsigned long now = millis();
  unsigned long passed = now - lastLoop;
  lastLoop = now;
  listen();
  if (now - lastButtons >= BUTTON_MS) {
    lastButtons = now;
    readButtons();
  }
  runMotors(now, passed);
  if (now - lastReport >= REPORT_MS) {
    lastReport = now;
    reportPlaces();
    if (imuFound) reportMotion();
  }
}
