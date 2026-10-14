/**
 * ByteLipi Universal Shield (Receiver) Code for L293D Expansion Board
 */
radio.setGroup(1)

// --- RADIO VALUE LISTENER (Motors & Servos) ---
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "M1") {
        // Motor 1: Direction on P12, Speed PWM on P13[cite: 1]
        if (value >= 0) {
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.analogWritePin(AnalogPin.P13, Math.map(value, 0, 100, 0, 1023))
        } else {
            pins.digitalWritePin(DigitalPin.P12, 1)
            pins.analogWritePin(AnalogPin.P13, Math.map(Math.abs(value), 0, 100, 0, 1023))
        }
    } else if (name == "M2") {
        // Motor 2: Direction on P14, Speed PWM on P15[cite: 1]
        if (value >= 0) {
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.analogWritePin(AnalogPin.P15, Math.map(value, 0, 100, 0, 1023))
        } else {
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.analogWritePin(AnalogPin.P15, Math.map(Math.abs(value), 0, 100, 0, 1023))
        }
    } else if (name == "S4") {
        pins.servoWrite(AnalogPin.P4, value)[cite: 1]
    } else if (name == "S10") {
        pins.servoWrite(AnalogPin.P10, value)[cite: 1]
    } else if (name == "S6") {
        pins.servoWrite(AnalogPin.P6, value)[cite: 1]
    } else if (name == "S16") {
        pins.servoWrite(AnalogPin.P16, value)[cite: 1]
    } else if (name == "TONE") {
        music.playTone(value, music.beat(BeatFraction.Half))
    } else if (name == "ICON") {
        if (value == 1) basic.showIcon(IconNames.Heart)
        else if (value == 2) basic.showIcon(IconNames.Yes)
        else if (value == 3) basic.showIcon(IconNames.No)
        else if (value == 4) basic.showIcon(IconNames.Skull)
    }
})

// --- RADIO STRING LISTENER (Sensors & Commands) ---
radio.onReceivedString(function (receivedString: string) {
    if (receivedString == "STOP") {
        stopAllMotors()
    } else if (receivedString == "REQ_SONAR") {
        // Ultrasonic sensor on P3 (Trig) and P8 (Echo)[cite: 1]
        let distance = sonar.ping(DigitalPin.P3, DigitalPin.P8, PingUnit.Centimeters)
        radio.sendValue("SONAR_RES", distance)
    } else if (receivedString == "REQ_P0_A") {
        let val = pins.analogReadPin(AnalogPin.P0)[cite: 1]
        radio.sendValue("P0_RES", val)
    } else if (receivedString == "REQ_P1_D") {
        let state = pins.digitalReadPin(DigitalPin.P1)[cite: 1]
        radio.sendValue("P1_RES", state)
    } else if (receivedString == "REQ_P2") {
        let p2Val = pins.analogReadPin(AnalogPin.P2)[cite: 1]
        radio.sendValue("P2_RES", p2Val)
    } else if (receivedString.substr(0, 4) == "TXT:") {
        let textToShow = receivedString.substr(4, receivedString.length - 4)
        basic.showString(textToShow)
    }
})

function stopAllMotors() {
    pins.analogWritePin(AnalogPin.P13, 0)[cite: 1]
    pins.analogWritePin(AnalogPin.P15, 0)[cite: 1]
    pins.digitalWritePin(DigitalPin.P12, 0)[cite: 1]
    pins.digitalWritePin(DigitalPin.P14, 0)[cite: 1]
}
