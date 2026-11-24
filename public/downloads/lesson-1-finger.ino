// lesson-1-finger.ino
// Board:   Arduino Mega 2560 with an Adafruit Motor Shield on top
// Motor:   one DC motor on the shield's terminal M1, run from the battery
// Library: "Adafruit Motor Shield V2 Library" (Arduino IDE: Tools > Manage Libraries)
// One button press closes the finger. The next press opens it.
//
// Written from the library's documentation and not yet run on a real finger:
// press Verify first, and time the move before trusting runTime.

#include <Wire.h>
#include <Adafruit_MotorShield.h> // The library for the motor shield.

const int buttonPin = 2;    // Button wire. The other button leg goes to GND.
const int motorSpeed = 150; // How hard the motor turns, from 0 to 255.
const int runTime = 1500;   // How long the motor runs for one move, in milliseconds.

Adafruit_MotorShield shield = Adafruit_MotorShield(); // The motor shield on top of the Mega.
Adafruit_DCMotor *finger = shield.getMotor(1);        // The motor on terminal M1.

bool fingerClosed = false;  // false means the finger is open.
bool buttonWasDown = false; // Remembers the last reading so one press counts once.

void setup() {
  pinMode(buttonPin, INPUT_PULLUP); // HIGH at rest, LOW when the button connects the pin to GND.
  shield.begin();                   // Wake up the motor shield.
  finger->setSpeed(motorSpeed);     // Set how hard the motor turns.
}

void loop() {
  bool buttonDown = digitalRead(buttonPin) == LOW; // A press reads LOW because of INPUT_PULLUP.

  if (buttonDown && !buttonWasDown) { // The button just went down.
    fingerClosed = !fingerClosed;      // Flip between open and closed.
    if (fingerClosed) {
      finger->run(FORWARD);            // Turn one way to close the finger.
    } else {
      finger->run(BACKWARD);           // Turn the other way to open it.
    }
    delay(runTime);                    // Let the motor run for the whole move.
    finger->run(RELEASE);              // Stop the motor.
  }

  buttonWasDown = buttonDown; // Save this reading for the next loop.
  delay(20);                   // Wait a little so one press is not counted many times.
}
