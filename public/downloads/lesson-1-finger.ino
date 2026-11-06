// lesson-1-finger.ino
// Board: Arduino Mega 2560
// One button press closes the finger. The next press opens it.

#include <Servo.h>

const int buttonPin = 2;     // Button wire. The other button leg goes to GND.
const int servoPin = 9;      // Servo signal wire. It is usually orange or yellow.
const int openAngle = 30;    // How far the finger opens. Make this bigger to open more.
const int closedAngle = 120; // How far the finger closes. Lower it if the servo strains.

Servo finger;                // The servo that moves the finger.

bool fingerClosed = false;   // false means the finger is open.
bool buttonWasDown = false;  // Remembers the last reading so one press counts once.

void setup() {
  finger.attach(servoPin);          // Tell the Mega that pin 9 talks to the servo.
  pinMode(buttonPin, INPUT_PULLUP); // The pin stays HIGH until the button connects it to GND.
  finger.write(openAngle);          // Start with the finger open.
}

void loop() {
  bool buttonDown = digitalRead(buttonPin) == LOW; // A press reads LOW because of INPUT_PULLUP.

  if (buttonDown && !buttonWasDown) {              // The button just went down.
    fingerClosed = !fingerClosed;                  // Flip between open and closed.
    if (fingerClosed) {
      finger.write(closedAngle);                   // Move to the closed angle.
    } else {
      finger.write(openAngle);                     // Move back to the open angle.
    }
  }

  buttonWasDown = buttonDown; // Save this reading for the next loop.
  delay(20);                   // Wait a little so one press is not counted many times.
}
