/**
 * ByteLipi Controller Extension v1.0
 *
 * CONTROLLER = BRAIN
 * SHIELD     = HARDWARE SLAVE
 *
 * Controller decides:
 * - movement
 * - speed
 * - timing
 * - sensor decisions
 * - servo positions
 * - radar scanning
 * - OLED commands
 * - sounds
 * - sequences
 *
 * Shield only executes commands and returns sensor data.
 */

// ============================================================
// RADIO
// ============================================================

namespace ByteLipi {

    const RADIO_GROUP = 1

    let robotSpeed = 70
    let connected = false

    // Sensor cache
    let distanceCM = 0
    let digitalP0 = 0
    let digitalP1 = 0
    let digitalP2 = 0

    let analogP0 = 0
    let analogP1 = 0
    let analogP2 = 0

    // ========================================================
    // INITIALIZE
    // ========================================================

    //% block="ByteLipi initialize"
    //% blockId=bytelipi_initialize
    //% weight=100
    //% group="Setup"
    export function initialize(): void {
        radio.setGroup(RADIO_GROUP)
        radio.setTransmitPower(7)

        connected = false

        basic.pause(100)

        radio.sendString("HELLO")
    }

    // ========================================================
    // SPEED
    // ========================================================

    //% block="set robot speed %speed"
    //% blockId=bytelipi_set_speed
    //% speed.min=0 speed.max=100
    //% weight=95
    //% group="Motors"
    export function setSpeed(speed: number): void {
        robotSpeed = Math.constrain(0, 100, speed)
    }

    //% block="robot speed"
    //% blockId=bytelipi_get_speed
    //% weight=94
    //% group="Motors"
    export function getSpeed(): number {
        return robotSpeed
    }

    // ========================================================
    // LOW LEVEL MOTOR COMMANDS
    // ========================================================

    function sendMotor1(speed: number): void {
        speed = Math.constrain(-100, 100, speed)
        radio.sendValue("M1", speed)
    }

    function sendMotor2(speed: number): void {
        speed = Math.constrain(-100, 100, speed)
        radio.sendValue("M2", speed)
    }

    // ========================================================
    // FORWARD
    // ========================================================

    //% block="move forward"
    //% blockId=bytelipi_forward
    //% weight=90
    //% group="Motors"
    export function forward(): void {
        sendMotor1(robotSpeed)
        basic.pause(20)
        sendMotor2(robotSpeed)
    }

    // ========================================================
    // BACKWARD
    // ========================================================

    //% block="move backward"
    //% blockId=bytelipi_backward
    //% weight=89
    //% group="Motors"
    export function backward(): void {
        sendMotor1(-robotSpeed)
        basic.pause(20)
        sendMotor2(-robotSpeed)
    }

    // ========================================================
    // LEFT
    // ========================================================

    //% block="turn left"
    //% blockId=bytelipi_left
    //% weight=88
    //% group="Motors"
    export function turnLeft(): void {
        sendMotor1(-robotSpeed)
        basic.pause(20)
        sendMotor2(robotSpeed)
    }

    // ========================================================
    // RIGHT
    // ========================================================

    //% block="turn right"
    //% blockId=bytelipi_right
    //% weight=87
    //% group="Motors"
    export function turnRight(): void {
        sendMotor1(robotSpeed)
        basic.pause(20)
        sendMotor2(-robotSpeed)
    }

    // ========================================================
    // RELIABLE STOP
    // ========================================================

    function reliableStop(): void {

        radio.sendString("STOP")
        basic.pause(25)

        radio.sendString("STOP")
        basic.pause(25)

        radio.sendString("STOP")
    }

    //% block="stop robot"
    //% blockId=bytelipi_stop
    //% weight=86
    //% group="Motors"
    export function stop(): void {
        reliableStop()
    }

    // ========================================================
    // TIMED FORWARD
    // ========================================================

    //% block="move forward for %milliseconds ms"
    //% blockId=bytelipi_forward_for
    //% milliseconds.min=1 milliseconds.max=60000
    //% weight=85
    //% group="Timed Movement"
    export function forwardFor(milliseconds: number): void {

        milliseconds = Math.max(1, milliseconds)

        forward()

        // Allow radio packets to reach Shield
        basic.pause(50)

        if (milliseconds > 50) {
            basic.pause(milliseconds - 50)
        }

        reliableStop()

        basic.pause(50)
    }

    // ========================================================
    // TIMED BACKWARD
    // ========================================================

    //% block="move backward for %milliseconds ms"
    //% blockId=bytelipi_backward_for
    //% milliseconds.min=1 milliseconds.max=60000
    //% weight=84
    //% group="Timed Movement"
    export function backwardFor(milliseconds: number): void {

        milliseconds = Math.max(1, milliseconds)

        backward()

        basic.pause(50)

        if (milliseconds > 50) {
            basic.pause(milliseconds - 50)
        }

        reliableStop()

        basic.pause(50)
    }

    // ========================================================
    // TIMED LEFT
    // ========================================================

    //% block="turn left for %milliseconds ms"
    //% blockId=bytelipi_left_for
    //% milliseconds.min=1 milliseconds.max=60000
    //% weight=83
    //% group="Timed Movement"
    export function turnLeftFor(milliseconds: number): void {

        milliseconds = Math.max(1, milliseconds)

        turnLeft()

        basic.pause(50)

        if (milliseconds > 50) {
            basic.pause(milliseconds - 50)
        }

        reliableStop()

        basic.pause(50)
    }

    // ========================================================
    // TIMED RIGHT
    // ========================================================

    //% block="turn right for %milliseconds ms"
    //% blockId=bytelipi_right_for
    //% milliseconds.min=1 milliseconds.max=60000
    //% weight=82
    //% group="Timed Movement"
    export function turnRightFor(milliseconds: number): void {

        milliseconds = Math.max(1, milliseconds)

        turnRight()

        basic.pause(50)

        if (milliseconds > 50) {
            basic.pause(milliseconds - 50)
        }

        reliableStop()

        basic.pause(50)
    }

    // ========================================================
    // INDIVIDUAL MOTOR
    // ========================================================

    //% block="motor 1 speed %speed"
    //% blockId=bytelipi_motor1
    //% speed.min=-100 speed.max=100
    //% weight=81
    //% group="Motors"
    export function motor1(speed: number): void {
        sendMotor1(speed)
    }

    //% block="motor 2 speed %speed"
    //% blockId=bytelipi_motor2
    //% speed.min=-100 speed.max=100
    //% weight=80
    //% group="Motors"
    export function motor2(speed: number): void {
        sendMotor2(speed)
    }

    // ========================================================
    // ULTRASONIC
    // ========================================================

    //% block="ultrasonic distance (cm)"
    //% blockId=bytelipi_ultrasonic
    //% weight=70
    //% group="Sensors"
    export function ultrasonic(): number {

        radio.sendString("REQ_SONAR")

        basic.pause(40)

        return distanceCM
    }

    //% block="last ultrasonic distance (cm)"
    //% blockId=bytelipi_last_ultrasonic
    //% weight=69
    //% group="Sensors"
    export function lastUltrasonic(): number {
        return distanceCM
    }

    // ========================================================
    // DIGITAL SENSOR
    // ========================================================

    //% block="read digital sensor %pin"
    //% blockId=bytelipi_read_digital
    //% weight=68
    //% group="Sensors"
    export function readDigital(pin: DigitalPin): number {

        if (pin == DigitalPin.P0) {
            radio.sendString("REQ_P0_D")
            basic.pause(40)
            return digitalP0
        }

        if (pin == DigitalPin.P1) {
            radio.sendString("REQ_P1_D")
            basic.pause(40)
            return digitalP1
        }

        if (pin == DigitalPin.P2) {
            radio.sendString("REQ_P2_D")
            basic.pause(40)
            return digitalP2
        }

        return 0
    }

    // ========================================================
    // ANALOG SENSOR
    // ========================================================

    //% block="read analog sensor %pin"
    //% blockId=bytelipi_read_analog
    //% weight=67
    //% group="Sensors"
    export function readAnalog(pin: AnalogPin): number {

        if (pin == AnalogPin.P0) {
            radio.sendString("REQ_P0_A")
            basic.pause(40)
            return analogP0
        }

        if (pin == AnalogPin.P1) {
            radio.sendString("REQ_P1_A")
            basic.pause(40)
            return analogP1
        }

        if (pin == AnalogPin.P2) {
            radio.sendString("REQ_P2_A")
            basic.pause(40)
            return analogP2
        }

        return 0
    }

    // ========================================================
    // SENSOR CACHE
    // ========================================================

    //% block="last digital P0"
    //% blockId=bytelipi_last_p0
    //% weight=66
    //% group="Sensors"
    export function lastDigitalP0(): number {
        return digitalP0
    }

    //% block="last digital P1"
    //% blockId=bytelipi_last_p1
    //% weight=65
    //% group="Sensors"
    export function lastDigitalP1(): number {
        return digitalP1
    }

    //% block="last digital P2"
    //% blockId=bytelipi_last_p2
    //% weight=64
    //% group="Sensors"
    export function lastDigitalP2(): number {
        return digitalP2
    }

    //% block="last analog P0"
    //% blockId=bytelipi_last_a0
    //% weight=63
    //% group="Sensors"
    export function lastAnalogP0(): number {
        return analogP0
    }

    //% block="last analog P1"
    //% blockId=bytelipi_last_a1
    //% weight=62
    //% group="Sensors"
    export function lastAnalogP1(): number {
        return analogP1
    }

    //% block="last analog P2"
    //% blockId=bytelipi_last_a2
    //% weight=61
    //% group="Sensors"
    export function lastAnalogP2(): number {
        return analogP2
    }

    // ========================================================
    // SERVO
    // ========================================================

    //% block="servo %pin angle %angle"
    //% blockId=bytelipi_servo
    //% angle.min=0 angle.max=180
    //% weight=55
    //% group="Servos"
    export function setServo(pin: DigitalPin, angle: number): void {

        angle = Math.constrain(0, 180, angle)

        if (pin == DigitalPin.P4) {
            radio.sendValue("S4", angle)
        }
        else if (pin == DigitalPin.P6) {
            radio.sendValue("S6", angle)
        }
        else if (pin == DigitalPin.P10) {
            radio.sendValue("S10", angle)
        }
        else if (pin == DigitalPin.P16) {
            radio.sendValue("S16", angle)
        }

        basic.pause(30)
    }

    // ========================================================
    // RADAR SCAN
    // ========================================================

    //% block="Radar Scan → nearest distance (cm)"
    //% blockId=bytelipi_radar_scan
    //% weight=50
    //% group="Radar"
    export function radarScan(): number {

        let nearest = 400

        // Controller decides the complete scan
        // 30° → 45° → ... → 150°

        for (let angle = 30; angle <= 150; angle += 15) {

            // Controller tells Shield where to point
            setServo(DigitalPin.P4, angle)

            // Give servo time to move
            basic.pause(120)

            // Controller requests sensor data
            let d = ultrasonic()

            if (d > 0 && d < nearest) {
                nearest = d
            }
        }

        // Return radar to center
        setServo(DigitalPin.P4, 90)

        basic.pause(100)

        return nearest
    }

    // ========================================================
    // OLED
    // ========================================================

    //% block="OLED show text %text"
    //% blockId=bytelipi_oled_text
    //% weight=45
    //% group="OLED"
    export function showText(text: string): void {
        radio.sendString("TXT:" + text)
    }

    //% block="OLED show number %value"
    //% blockId=bytelipi_oled_number
    //% weight=44
    //% group="OLED"
    export function showNumber(value: number): void {
        radio.sendValue("OLED_NUM", value)
    }

    //% block="OLED clear"
    //% blockId=bytelipi_oled_clear
    //% weight=43
    //% group="OLED"
    export function clearDisplay(): void {
        radio.sendString("OLED_CLR")
    }

    //% block="OLED show icon %icon"
    //% blockId=bytelipi_oled_icon
    //% weight=42
    //% group="OLED"
    export function showIcon(icon: number): void {
        radio.sendValue("ICON", icon)
    }

    // ========================================================
    // SOUND
    // ========================================================

    //% block="play tone %frequency Hz for %duration ms"
    //% blockId=bytelipi_tone
    //% frequency.min=50 frequency.max=5000
    //% duration.min=1 duration.max=5000
    //% weight=40
    //% group="Sound"
    export function tone(frequency: number, duration: number): void {

        radio.sendValue("TONE", frequency)

        basic.pause(duration)

        radio.sendString("MUTE")
    }

    //% block="alarm"
    //% blockId=bytelipi_alarm
    //% weight=39
    //% group="Sound"
    export function alarm(): void {
        radio.sendString("ALARM")
    }

    //% block="stop sound"
    //% blockId=bytelipi_stop_sound
    //% weight=38
    //% group="Sound"
    export function stopSound(): void {
        radio.sendString("MUTE")
    }

    // ========================================================
    // CONNECTION
    // ========================================================

    //% block="Shield connected"
    //% blockId=bytelipi_connected
    //% weight=30
    //% group="System"
    export function isConnected(): boolean {
        return connected
    }

    // ========================================================
    // EMERGENCY STOP
    // ========================================================

    //% block="Emergency Stop"
    //% blockId=bytelipi_emergency_stop
    //% weight=29
    //% group="System"
    export function emergencyStop(): void {

        reliableStop()

        radio.sendString("MUTE")
    }

    // ========================================================
    // CUSTOM COMMAND
    // ========================================================

    //% block="send ByteLipi command %command"
    //% blockId=bytelipi_command
    //% weight=20
    //% group="Advanced"
    export function sendCommand(command: string): void {
        radio.sendString(command)
    }

    // ========================================================
    // RADIO RECEIVE
    // ========================================================

    radio.onReceivedString(function (received: string) {

        if (received == "CONNECTED") {
            connected = true
        }

        if (received == "SHIELD_READY") {
            connected = true
        }

        // Ultrasonic response
        if (received.indexOf("SONAR:") == 0) {

            let value = parseInt(
                received.substr(6)
            )

            if (!isNaN(value)) {
                distanceCM = value
            }
        }

        // Digital sensor responses
        if (received.indexOf("P0_D:") == 0) {

            digitalP0 = parseInt(
                received.substr(5)
            )
        }

        if (received.indexOf("P1_D:") == 0) {

            digitalP1 = parseInt(
                received.substr(5)
            )
        }

        if (received.indexOf("P2_D:") == 0) {

            digitalP2 = parseInt(
                received.substr(5)
            )
        }

        // Analog sensor responses
        if (received.indexOf("P0_A:") == 0) {

            analogP0 = parseInt(
                received.substr(5)
            )
        }

        if (received.indexOf("P1_A:") == 0) {

            analogP1 = parseInt(
                received.substr(5)
            )
        }

        if (received.indexOf("P2_A:") == 0) {

            analogP2 = parseInt(
                received.substr(5)
            )
        }
    })

    // ========================================================
    // RADIO VALUE RECEIVE
    // ========================================================

    radio.onReceivedValue(function (name: string, value: number) {

        if (name == "SONAR") {
            distanceCM = value
        }

        if (name == "P0_D") {
            digitalP0 = value
        }

        if (name == "P1_D") {
            digitalP1 = value
        }

        if (name == "P2_D") {
            digitalP2 = value
        }

        if (name == "P0_A") {
            analogP0 = value
        }

        if (name == "P1_A") {
            analogP1 = value
        }

        if (name == "P2_A") {
            analogP2 = value
        }
    })

    // ========================================================
    // HEARTBEAT
    // ========================================================

    control.inBackground(function () {

        while (true) {

            radio.sendString("HB")

            basic.pause(500)
        }
    })
}
