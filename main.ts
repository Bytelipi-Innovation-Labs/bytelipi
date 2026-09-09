// ============================================================
// ByteLipi Controller Extension
// Version 1.0
//
// CONTROLLER = 100% ROBOT BRAIN
// SHIELD     = HARDWARE EXECUTOR
//
// Controller decides:
// - Movement
// - Speed
// - Movement duration
// - Sensor interpretation
// - Servo position
// - Radar scan
// - OLED messages
// - Sound
// - IF / ELSE
// - Loops
// - Sequences
//
// Shield only:
// - Drives motors
// - Moves servos
// - Reads sensors
// - Returns raw sensor data
// - Executes display/sound commands
// ============================================================


//% color="#1E88E5" icon="\uf135" block="ByteLipi"
namespace ByteLipi {

    // ========================================================
    // RADIO
    // ========================================================

    const RADIO_GROUP = 1

    let robotSpeed = 70

    let lastDistance = 0

    let lastP0Digital = 0
    let lastP1Digital = 0
    let lastP2Digital = 0

    let lastP0Analog = 0
    let lastP1Analog = 0
    let lastP2Analog = 0

    let connected = false

    // ========================================================
    // INITIALIZE
    // ========================================================

    /**
     * Start ByteLipi Controller.
     */
    //% block="ByteLipi initialize"
    //% blockId=bytelipiInitialize
    //% weight=100
    //% group="Connection"
    export function initialize(): void {

        radio.setGroup(RADIO_GROUP)
        radio.setTransmitPower(7)

        connected = true

        radio.sendString("HB")
    }


    // ========================================================
    // SPEED
    // ========================================================

    /**
     * Set robot speed from 0 to 100.
     */
    //% block="set robot speed %speed"
    //% blockId=bytelipiSetSpeed
    //% speed.min=0 speed.max=100 speed.defl=70
    //% weight=95
    //% group="Motion"
    export function setSpeed(speed: number): void {

        speed = Math.max(0, Math.min(100, speed))

        robotSpeed = speed
    }


    /**
     * Get current robot speed.
     */
    //% block="robot speed"
    //% blockId=bytelipiGetSpeed
    //% weight=94
    //% group="Motion"
    export function getSpeed(): number {

        return robotSpeed
    }


    // ========================================================
    // MOTOR 1 / MOTOR 2
    // ========================================================

    /**
     * Set Motor 1 speed.
     * Positive = forward
     * Negative = backward
     */
    //% block="motor 1 speed %speed"
    //% blockId=bytelipiMotor1
    //% speed.min=-100 speed.max=100 speed.defl=70
    //% weight=90
    //% group="Motors"
    export function motor1(speed: number): void {

        speed = Math.max(-100, Math.min(100, speed))

        radio.sendValue("M1", speed)
    }


    /**
     * Set Motor 2 speed.
     */
    //% block="motor 2 speed %speed"
    //% blockId=bytelipiMotor2
    //% speed.min=-100 speed.max=100 speed.defl=70
    //% weight=89
    //% group="Motors"
    export function motor2(speed: number): void {

        speed = Math.max(-100, Math.min(100, speed))

        radio.sendValue("M2", speed)
    }


    // ========================================================
    // CONTINUOUS MOVEMENT
    // ========================================================

    /**
     * Move forward continuously.
     */
    //% block="forward"
    //% blockId=bytelipiForward
    //% weight=85
    //% group="Motion"
    export function forward(): void {

        motor1(robotSpeed)
        motor2(robotSpeed)
    }


    /**
     * Move backward continuously.
     */
    //% block="backward"
    //% blockId=bytelipiBackward
    //% weight=84
    //% group="Motion"
    export function backward(): void {

        motor1(-robotSpeed)
        motor2(-robotSpeed)
    }


    /**
     * Turn left continuously.
     */
    //% block="turn left"
    //% blockId=bytelipiTurnLeft
    //% weight=83
    //% group="Motion"
    export function turnLeft(): void {

        motor1(-robotSpeed)
        motor2(robotSpeed)
    }


    /**
     * Turn right continuously.
     */
    //% block="turn right"
    //% blockId=bytelipiTurnRight
    //% weight=82
    //% group="Motion"
    export function turnRight(): void {

        motor1(robotSpeed)
        motor2(-robotSpeed)
    }


    /**
     * Stop both motors.
     */
    //% block="stop"
    //% blockId=bytelipiStop
    //% weight=81
    //% group="Motion"
    export function stop(): void {

        radio.sendString("STOP")
    }


    // ========================================================
    // CONTROLLER-SIDE TIMED MOVEMENT
    //
    // IMPORTANT:
    // The Shield does NOT decide how long the robot moves.
    //
    // Controller:
    //     MOTOR COMMAND
    //     WAIT
    //     STOP
    // ========================================================

    /**
     * Move forward for a selected time.
     */
    //% block="move forward for %milliseconds ms"
    //% blockId=bytelipiForwardFor
    //% milliseconds.min=10 milliseconds.max=30000 milliseconds.defl=1000
    //% weight=80
    //% group="Motion"
    export function forwardFor(milliseconds: number): void {

        motor1(robotSpeed)
        motor2(robotSpeed)

        basic.pause(milliseconds)

        stop()
    }


    /**
     * Move backward for a selected time.
     */
    //% block="move backward for %milliseconds ms"
    //% blockId=bytelipiBackwardFor
    //% milliseconds.min=10 milliseconds.max=30000 milliseconds.defl=1000
    //% weight=79
    //% group="Motion"
    export function backwardFor(milliseconds: number): void {

        motor1(-robotSpeed)
        motor2(-robotSpeed)

        basic.pause(milliseconds)

        stop()
    }


    /**
     * Turn left for a selected time.
     */
    //% block="turn left for %milliseconds ms"
    //% blockId=bytelipiTurnLeftFor
    //% milliseconds.min=10 milliseconds.max=10000 milliseconds.defl=500
    //% weight=78
    //% group="Motion"
    export function turnLeftFor(milliseconds: number): void {

        motor1(-robotSpeed)
        motor2(robotSpeed)

        basic.pause(milliseconds)

        stop()
    }


    /**
     * Turn right for a selected time.
     */
    //% block="turn right for %milliseconds ms"
    //% blockId=bytelipiTurnRightFor
    //% milliseconds.min=10 milliseconds.max=10000 milliseconds.defl=500
    //% weight=77
    //% group="Motion"
    export function turnRightFor(milliseconds: number): void {

        motor1(robotSpeed)
        motor2(-robotSpeed)

        basic.pause(milliseconds)

        stop()
    }


    // ========================================================
    // ULTRASONIC
    // ========================================================

    /**
     * Request ultrasonic distance from Shield.
     */
    //% block="ultrasonic distance (cm)"
    //% blockId=bytelipiUltrasonic
    //% weight=70
    //% group="Sensors"
    export function ultrasonic(): number {

        radio.sendString("REQ_SONAR")

        // Allow the Shield to answer.
        basic.pause(35)

        return lastDistance
    }


    /**
     * Return the last ultrasonic value received.
     */
    //% block="last ultrasonic distance (cm)"
    //% blockId=bytelipiLastUltrasonic
    //% weight=69
    //% group="Sensors"
    export function lastUltrasonic(): number {

        return lastDistance
    }


    // ========================================================
    // RADAR SCAN
    //
    // SERVO: P4
    // ULTRASONIC: P8 TRIG / P3 ECHO
    //
    // Controller decides:
    // 30°
    // 45°
    // 60°
    // ...
    // 150°
    //
    // Shield only executes:
    // Servo position
    // Ultrasonic measurement
    // ========================================================

    /**
     * Scan from 30 degrees to 150 degrees
     * and return the nearest detected distance.
     */
    //% block="Radar Scan → nearest distance (cm)"
    //% blockId=bytelipiRadarScan
    //% weight=65
    //% group="Radar"
    export function radarScan(): number {

        let nearest = 400

        // Controller decides every scan position.
        for (let angle = 30; angle <= 150; angle += 15) {

            // Controller tells Shield where to move servo.
            setServo(DigitalPin.P4, angle)

            // Allow servo to reach position.
            basic.pause(120)

            // Controller requests ultrasonic measurement.
            let distance = ultrasonic()

            // Controller interprets the result.
            if (distance > 0 && distance < nearest) {

                nearest = distance
            }
        }

        // Controller decides to return radar to center.
        setServo(DigitalPin.P4, 90)

        basic.pause(100)

        return nearest
    }


    // ========================================================
    // DIGITAL SENSORS
    // ========================================================

    /**
     * Read a digital sensor on P0, P1 or P2.
     */
    //% block="read digital sensor %pin"
    //% blockId=bytelipiReadDigital
    //% weight=60
    //% group="Sensors"
    export function readDigital(pin: DigitalPin): number {

        if (pin == DigitalPin.P0) {

            radio.sendString("REQ_P0_D")
            basic.pause(30)

            return lastP0Digital
        }

        if (pin == DigitalPin.P1) {

            radio.sendString("REQ_P1_D")
            basic.pause(30)

            return lastP1Digital
        }

        if (pin == DigitalPin.P2) {

            radio.sendString("REQ_P2_D")
            basic.pause(30)

            return lastP2Digital
        }

        return 0
    }


    // ========================================================
    // ANALOG SENSORS
    // ========================================================

    /**
     * Read analog sensor on P0, P1 or P2.
     */
    //% block="read analog sensor %pin"
    //% blockId=bytelipiReadAnalog
    //% weight=59
    //% group="Sensors"
    export function readAnalog(pin: AnalogPin): number {

        if (pin == AnalogPin.P0) {

            radio.sendString("REQ_P0_A")
            basic.pause(30)

            return lastP0Analog
        }

        if (pin == AnalogPin.P1) {

            radio.sendString("REQ_P1_A")
            basic.pause(30)

            return lastP1Analog
        }

        if (pin == AnalogPin.P2) {

            radio.sendString("REQ_P2_A")
            basic.pause(30)

            return lastP2Analog
        }

        return 0
    }


    // ========================================================
    // SENSOR CACHE
    // ========================================================

    /**
     * Last digital P0 value.
     */
    //% block="last P0 digital"
    //% blockId=bytelipiLastP0Digital
    //% weight=58
    //% group="Sensors"
    export function lastP0DigitalValue(): number {

        return lastP0Digital
    }


    /**
     * Last digital P1 value.
     */
    //% block="last P1 digital"
    //% blockId=bytelipiLastP1Digital
    //% weight=57
    //% group="Sensors"
    export function lastP1DigitalValue(): number {

        return lastP1Digital
    }


    /**
     * Last digital P2 value.
     */
    //% block="last P2 digital"
    //% blockId=bytelipiLastP2Digital
    //% weight=56
    //% group="Sensors"
    export function lastP2DigitalValue(): number {

        return lastP2Digital
    }


    // ========================================================
    // SERVOS
    // ========================================================

    /**
     * Set servo angle from 0 to 180 degrees.
     */
    //% block="servo %pin angle %angle"
    //% blockId=bytelipiSetServo
    //% angle.min=0 angle.max=180 angle.defl=90
    //% weight=50
    //% group="Servos"
    export function setServo(pin: DigitalPin, angle: number): void {

        angle = Math.max(0, Math.min(180, angle))

        if (pin == DigitalPin.P4) {

            radio.sendValue("S4", angle)
        }

        if (pin == DigitalPin.P6) {

            radio.sendValue("S6", angle)
        }

        if (pin == DigitalPin.P10) {

            radio.sendValue("S10", angle)
        }

        if (pin == DigitalPin.P16) {

            radio.sendValue("S16", angle)
        }
    }


    // ========================================================
    // OLED
    // ========================================================

    /**
     * Show text on Shield OLED.
     */
    //% block="OLED show text %text"
    //% blockId=bytelipiShowText
    //% weight=40
    //% group="Display"
    export function showText(text: string): void {

        radio.sendString("TXT:" + text)
    }


    /**
     * Show number on Shield OLED.
     */
    //% block="OLED show number %number"
    //% blockId=bytelipiShowNumber
    //% weight=39
    //% group="Display"
    export function showNumber(number: number): void {

        radio.sendValue("OLED_NUM", number)
    }


    /**
     * Clear Shield OLED.
     */
    //% block="OLED clear"
    //% blockId=bytelipiClearDisplay
    //% weight=38
    //% group="Display"
    export function clearDisplay(): void {

        radio.sendString("OLED_CLR")
    }


    /**
     * Show an icon on Shield OLED.
     */
    //% block="OLED show icon %icon"
    //% blockId=bytelipiShowIcon
    //% weight=37
    //% group="Display"
    export function showIcon(icon: number): void {

        radio.sendValue("ICON", icon)
    }


    // ========================================================
    // SOUND
    // ========================================================

    /**
     * Play a tone.
     */
    //% block="play tone %frequency Hz"
    //% blockId=bytelipiTone
    //% frequency.min=100 frequency.max=5000 frequency.defl=1000
    //% weight=30
    //% group="Sound"
    export function tone(frequency: number): void {

        radio.sendValue("TONE", frequency)
    }


    /**
     * Play alarm.
     */
    //% block="alarm"
    //% blockId=bytelipiAlarm
    //% weight=29
    //% group="Sound"
    export function alarm(): void {

        radio.sendString("ALARM")
    }


    /**
     * Stop sound.
     */
    //% block="stop sound"
    //% blockId=bytelipiStopSound
    //% weight=28
    //% group="Sound"
    export function stopSound(): void {

        radio.sendString("MUTE")
    }


    // ========================================================
    // CONNECTION
    // ========================================================

    /**
     * Check whether Controller is initialized.
     */
    //% block="ByteLipi connected"
    //% blockId=bytelipiConnected
    //% weight=20
    //% group="Connection"
    export function isConnected(): boolean {

        return connected
    }


    // ========================================================
    // EMERGENCY STOP
    // ========================================================

    /**
     * Immediately command Shield to stop motors.
     */
    //% block="emergency stop"
    //% blockId=bytelipiEmergencyStop
    //% weight=10
    //% group="Connection"
    export function emergencyStop(): void {

        radio.sendString("STOP")
    }


    // ========================================================
    // CUSTOM COMMAND
    // ========================================================

    /**
     * Send a custom command to the Shield.
     */
    //% block="send ByteLipi command %command"
    //% blockId=bytelipiSendCommand
    //% weight=5
    //% group="Advanced"
    export function sendCommand(command: string): void {

        radio.sendString(command)
    }


    // ========================================================
    // RADIO RECEIVE
    //
    // Shield sends raw sensor values.
    // Controller stores them.
    // Controller makes decisions.
    // ========================================================

    radio.onReceivedValue(function (name: string, value: number) {

        if (name == "SONAR") {

            lastDistance = value
        }

        if (name == "P0_D") {

            lastP0Digital = value
        }

        if (name == "P1_D") {

            lastP1Digital = value
        }

        if (name == "P2_D") {

            lastP2Digital = value
        }

        if (name == "P0_A") {

            lastP0Analog = value
        }

        if (name == "P1_A") {

            lastP1Analog = value
        }

        if (name == "P2_A") {

            lastP2Analog = value
        }
    })


    // ========================================================
    // SHIELD HEARTBEAT
    //
    // This is communication only.
    // It does NOT contain robot behavior.
    // ========================================================

    control.inBackground(function () {

        radio.setGroup(RADIO_GROUP)
        radio.setTransmitPower(7)

        while (true) {

            radio.sendString("HB")

            basic.pause(500)
        }
    })
}
