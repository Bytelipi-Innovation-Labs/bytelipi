/**
 * ByteLipi Controller Extension
 *
 * ARCHITECTURE
 * ------------------------------------------------
 * CONTROLLER = MASTER / BRAIN
 * SHIELD     = SLAVE / HARDWARE
 *
 * The Controller makes ALL decisions.
 *
 * The Shield only:
 *   - receives commands
 *   - controls motors
 *   - controls servos
 *   - reads sensors
 *   - sends sensor values back
 *
 * Radio Group: 1
 */

//% color="#2563EB" icon="\uf135" block="ByteLipi"
//% groups='["Motion", "Sensors", "Servo", "Display", "Sound", "Advanced"]'
namespace ByteLipi {

    // ============================================================
    // SETTINGS
    // ============================================================

    const RADIO_GROUP = 1

    let robotSpeed = 70

    // Cached sensor values
    let sonarDistance = 0

    let digitalP0 = 0
    let digitalP1 = 0
    let digitalP2 = 0

    let analogP0 = 0
    let analogP1 = 0
    let analogP2 = 0

    // Last received status
    let shieldConnected = false

    // ============================================================
    // INITIALIZATION
    // ============================================================

    //% block="ByteLipi initialize"
    //% weight=100
    //% group="Advanced"
    export function initialize(): void {
        radio.setGroup(RADIO_GROUP)
        radio.setTransmitPower(7)

        robotSpeed = 70

        sonarDistance = 0

        digitalP0 = 0
        digitalP1 = 0
        digitalP2 = 0

        analogP0 = 0
        analogP1 = 0
        analogP2 = 0

        shieldConnected = false

        basic.showString("BL")
    }

    // ============================================================
    // RADIO RECEIVE
    // ============================================================

    radio.onReceivedValue(function (name: string, value: number) {

        // --------------------------------------------------------
        // Ultrasonic
        // --------------------------------------------------------

        if (name == "SONAR") {
            sonarDistance = value
            shieldConnected = true
        }

        // --------------------------------------------------------
        // Digital sensors
        // --------------------------------------------------------

        if (name == "P0_D") {
            digitalP0 = value
            shieldConnected = true
        }

        if (name == "P1_D") {
            digitalP1 = value
            shieldConnected = true
        }

        if (name == "P2_D") {
            digitalP2 = value
            shieldConnected = true
        }

        // --------------------------------------------------------
        // Analog sensors
        // --------------------------------------------------------

        if (name == "P0_A") {
            analogP0 = value
            shieldConnected = true
        }

        if (name == "P1_A") {
            analogP1 = value
            shieldConnected = true
        }

        if (name == "P2_A") {
            analogP2 = value
            shieldConnected = true
        }
    })

    // ============================================================
    // HEARTBEAT
    // ============================================================

    // Controller sends heartbeat.
    //
    // IMPORTANT:
    // This does NOT make decisions.
    // It only tells the Shield that the Controller is alive.

    control.inBackground(function () {
        while (true) {
            radio.sendString("HB")
            basic.pause(500)
        }
    })

    // ============================================================
    // MOTION
    // ============================================================

    /**
     * Move both motors forward.
     */

    //% block="move forward"
    //% weight=100
    //% group="Motion"
    export function forward(): void {
        radio.sendValue("M1", robotSpeed)
        radio.sendValue("M2", robotSpeed)
    }

    /**
     * Move both motors backward.
     */

    //% block="move backward"
    //% weight=95
    //% group="Motion"
    export function backward(): void {
        radio.sendValue("M1", -robotSpeed)
        radio.sendValue("M2", -robotSpeed)
    }

    /**
     * Turn robot left.
     */

    //% block="turn left"
    //% weight=90
    //% group="Motion"
    export function turnLeft(): void {
        radio.sendValue("M1", -robotSpeed)
        radio.sendValue("M2", robotSpeed)
    }

    /**
     * Turn robot right.
     */

    //% block="turn right"
    //% weight=85
    //% group="Motion"
    export function turnRight(): void {
        radio.sendValue("M1", robotSpeed)
        radio.sendValue("M2", -robotSpeed)
    }

    /**
     * Stop both motors.
     */

    //% block="stop robot"
    //% weight=100
    //% group="Motion"
    export function stop(): void {
        radio.sendValue("M1", 0)
        radio.sendValue("M2", 0)
        radio.sendString("STOP")
    }

    /**
     * Set robot speed.
     * Range 0-100.
     */

    //% block="set robot speed %speed"
    //% speed.min=0 speed.max=100 speed.defl=70
    //% weight=80
    //% group="Motion"
    export function setSpeed(speed: number): void {

        if (speed < 0) {
            speed = 0
        }

        if (speed > 100) {
            speed = 100
        }

        robotSpeed = speed
    }

    /**
     * Get current speed.
     */

    //% block="robot speed"
    //% weight=75
    //% group="Motion"
    export function getSpeed(): number {
        return robotSpeed
    }

    /**
     * Control Motor 1 directly.
     */

    //% block="motor 1 speed %speed"
    //% speed.min=-100 speed.max=100 speed.defl=70
    //% weight=50
    //% group="Advanced"
    export function motor1(speed: number): void {
        if (speed < -100) {
            speed = -100
        }

        if (speed > 100) {
            speed = 100
        }

        radio.sendValue("M1", speed)
    }

    /**
     * Control Motor 2 directly.
     */

    //% block="motor 2 speed %speed"
    //% speed.min=-100 speed.max=100 speed.defl=70
    //% weight=45
    //% group="Advanced"
    export function motor2(speed: number): void {
        if (speed < -100) {
            speed = -100
        }

        if (speed > 100) {
            speed = 100
        }

        radio.sendValue("M2", speed)
    }

    // ============================================================
    // ULTRASONIC
    // ============================================================

    /**
     * Ask the Shield for ultrasonic distance.
     *
     * The Shield reads the sensor.
     * The Controller receives the result.
     *
     * The Controller makes the decision.
     */

    //% block="read ultrasonic distance"
    //% weight=100
    //% group="Sensors"
    export function ultrasonic(): number {

        radio.sendString("REQ_SONAR")

        // Give the Shield time to reply.
        basic.pause(40)

        return sonarDistance
    }

    /**
     * Get the most recently received ultrasonic value.
     */

    //% block="last ultrasonic distance"
    //% weight=95
    //% group="Sensors"
    export function lastUltrasonic(): number {
        return sonarDistance
    }

    // ============================================================
    // DIGITAL SENSOR
    // ============================================================

    /**
     * Read digital sensor connected to P0, P1 or P2.
     *
     * IMPORTANT:
     * P0/P1/P2 are physically connected to the Shield.
     */

    //% block="digital sensor %pin"
    //% weight=90
    //% group="Sensors"
    export function readDigital(pin: DigitalPin): number {

        if (pin == DigitalPin.P0) {

            radio.sendString("REQ_P0_D")
            basic.pause(30)

            return digitalP0
        }

        if (pin == DigitalPin.P1) {

            radio.sendString("REQ_P1_D")
            basic.pause(30)

            return digitalP1
        }

        if (pin == DigitalPin.P2) {

            radio.sendString("REQ_P2_D")
            basic.pause(30)

            return digitalP2
        }

        return 0
    }

    // ============================================================
    // ANALOG SENSOR
    // ============================================================

    /**
     * Read analog sensor connected to P0, P1 or P2.
     */

    //% block="analog sensor %pin"
    //% weight=85
    //% group="Sensors"
    export function readAnalog(pin: AnalogPin): number {

        if (pin == AnalogPin.P0) {

            radio.sendString("REQ_P0_A")
            basic.pause(30)

            return analogP0
        }

        if (pin == AnalogPin.P1) {

            radio.sendString("REQ_P1_A")
            basic.pause(30)

            return analogP1
        }

        if (pin == AnalogPin.P2) {

            radio.sendString("REQ_P2_A")
            basic.pause(30)

            return analogP2
        }

        return 0
    }

    // ============================================================
    // SENSOR CACHE
    // ============================================================

    //% block="last digital P0"
    //% weight=60
    //% group="Sensors"
    export function lastDigitalP0(): number {
        return digitalP0
    }

    //% block="last digital P1"
    //% weight=59
    //% group="Sensors"
    export function lastDigitalP1(): number {
        return digitalP1
    }

    //% block="last digital P2"
    //% weight=58
    //% group="Sensors"
    export function lastDigitalP2(): number {
        return digitalP2
    }

    //% block="last analog P0"
    //% weight=57
    //% group="Sensors"
    export function lastAnalogP0(): number {
        return analogP0
    }

    //% block="last analog P1"
    //% weight=56
    //% group="Sensors"
    export function lastAnalogP1(): number {
        return analogP1
    }

    //% block="last analog P2"
    //% weight=55
    //% group="Sensors"
    export function lastAnalogP2(): number {
        return analogP2
    }

    // ============================================================
    // SERVO
    // ============================================================

    /**
     * Set servo angle.
     *
     * Servo pins:
     * P4
     * P6
     * P10
     * P16
     */

    //% block="set servo %pin angle %angle"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% weight=100
    //% group="Servo"
    export function setServo(
        pin: DigitalPin,
        angle: number
    ): void {

        if (angle < 0) {
            angle = 0
        }

        if (angle > 180) {
            angle = 180
        }

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

    // ============================================================
    // DISPLAY
    // ============================================================

    /**
     * Send text to the Shield display.
     *
     * This keeps the display controlled through the Controller.
     */

    //% block="show text on Shield %text"
    //% weight=100
    //% group="Display"
    export function showText(text: string): void {
        radio.sendString("TXT:" + text)
    }

    /**
     * Show a number on the Shield.
     */

    //% block="show number on Shield %value"
    //% weight=95
    //% group="Display"
    export function showNumber(value: number): void {
        radio.sendValue("OLED_NUM", value)
    }

    /**
     * Clear Shield display.
     */

    //% block="clear Shield display"
    //% weight=90
    //% group="Display"
    export function clearDisplay(): void {
        radio.sendString("OLED_CLR")
    }

    /**
     * Show an icon on Shield.
     */

    //% block="show Shield icon %icon"
    //% weight=80
    //% group="Display"
    export function showIcon(icon: number): void {
        radio.sendValue("ICON", icon)
    }

    // ============================================================
    // SOUND
    // ============================================================

    /**
     * Play a tone on the Shield.
     */

    //% block="play tone frequency %frequency duration %duration"
    //% frequency.min=100 frequency.max=2000 frequency.defl=500
    //% duration.min=20 duration.max=2000 duration.defl=200
    //% weight=100
    //% group="Sound"
    export function tone(
        frequency: number,
        duration: number
    ): void {

        radio.sendValue("TONE", frequency)
        basic.pause(duration)
        radio.sendString("MUTE")
    }

    /**
     * Play an alarm.
     */

    //% block="alarm"
    //% weight=90
    //% group="Sound"
    export function alarm(): void {
        radio.sendString("ALARM")
    }

    /**
     * Stop sound.
     */

    //% block="stop sound"
    //% weight=80
    //% group="Sound"
    export function stopSound(): void {
        radio.sendString("MUTE")
    }

    // ============================================================
    // CONNECTION
    // ============================================================

    /**
     * Returns true if a sensor response has been received.
     */

    //% block="Shield connected"
    //% weight=70
    //% group="Advanced"
    export function isConnected(): boolean {
        return shieldConnected
    }

    /**
     * Send an emergency STOP directly.
     */

    //% block="emergency stop"
    //% weight=100
    //% group="Advanced"
    export function emergencyStop(): void {
        radio.sendString("STOP")

        radio.sendValue("M1", 0)
        radio.sendValue("M2", 0)
    }

    // ============================================================
    // RAW RADIO COMMAND
    // ============================================================

    /**
     * Send a custom string command.
     * Advanced users only.
     */

    //% block="send command %command"
    //% weight=30
    //% group="Advanced"
    export function sendCommand(command: string): void {
        radio.sendString(command)
    }
}