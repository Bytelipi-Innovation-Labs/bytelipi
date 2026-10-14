/**
 * ByteLipi Controller Extension for micro:bit
 */
//% weight=100 color=#1E3A8A icon="\uf1b9" block="ByteLipi"
namespace bytelipi {
    let motor_polarity = -1 
    let msPerStep = 500
    let moveSpeed = 80
    let turnSpeed = 65

    // --- SETUP & CONFIGURATION ---
    //% group="Setup"
    //% block="initialize ByteLipi controller on channel $groupId"
    //% groupId.min=1 groupId.max=255
    export function Init_Controller(groupId: number) {
        radio.setGroup(groupId)
        radio.setTransmitPower(7)
        basic.showIcon(IconNames.Happy)
    }

    //% group="Configuration"
    //% block="set move speed to $speed"
    //% speed.min=0 speed.max=100
    export function Set_Move_Speed(speed: number) {
        moveSpeed = speed
    }

    //% group="Configuration"
    //% block="set turn speed to $speed"
    //% speed.min=0 speed.max=100
    export function Set_Turn_Speed(speed: number) {
        turnSpeed = speed
    }

    //% group="Configuration"
    //% block="set step duration to $ms ms per step"
    export function Set_Step_Duration(ms: number) {
        msPerStep = ms
    }

    // --- MOTORS ---
    //% group="Motors"
    //% block="move motor 1 at speed $speed"
    //% speed.min=-100 speed.max=100
    export function Move_Motor_1(speed: number) { radio.sendValue("M1", speed * motor_polarity) }

    //% group="Motors"
    //% block="move motor 2 at speed $speed"
    //% speed.min=-100 speed.max=100
    export function Move_Motor_2(speed: number) { radio.sendValue("M2", speed * motor_polarity) }

    //% group="Motors"
    //% block="stop all motors"
    export function Stop_All() {
        radio.sendValue("M1", 0)
        radio.sendValue("M2", 0)
        radio.sendString("STOP")
    }

    // --- SEQUENTIAL MOVEMENT ---
    //% group="Movement Sequences"
    //% block="move forward $steps steps"
    export function moveUp(steps: number) {
        Move_Motor_1(moveSpeed); Move_Motor_2(moveSpeed)
        basic.pause(steps * msPerStep); Stop_All()
    }

    //% group="Movement Sequences"
    //% block="move backward $steps steps"
    export function moveDown(steps: number) {
        Move_Motor_1(0 - moveSpeed); Move_Motor_2(0 - moveSpeed)
        basic.pause(steps * msPerStep); Stop_All()
    }

    //% group="Movement Sequences"
    //% block="turn left $steps steps"
    export function turnLeft(steps: number) {
        Move_Motor_1(turnSpeed); Move_Motor_2(0 - turnSpeed)
        basic.pause(steps * msPerStep); Stop_All()
    }

    //% group="Movement Sequences"
    //% block="turn right $steps steps"
    export function turnRight(steps: number) {
        Move_Motor_1(0 - turnSpeed); Move_Motor_2(turnSpeed)
        basic.pause(steps * msPerStep); Stop_All()
    }

    // --- SERVOS ---
    //% group="Servos"
    //% block="set servo P4 to $angle degrees"
    //% angle.min=0 angle.max=180
    export function Set_Servo_P4(angle: number) { radio.sendValue("S4", angle) }

    //% group="Servos"
    //% block="set servo P10 to $angle degrees"
    //% angle.min=0 angle.max=180
    export function Set_Servo_P10(angle: number) { radio.sendValue("S10", angle) }

    //% group="Servos"
    //% block="set servo P6 to $angle degrees"
    //% angle.min=0 angle.max=180
    export function Set_Servo_P6(angle: number) { radio.sendValue("S6", angle) }

    //% group="Servos"
    //% block="set servo P16 to $angle degrees"
    //% angle.min=0 angle.max=180
    export function Set_Servo_P16(angle: number) { radio.sendValue("S16", angle) }

    // --- SENSORS (TELEMETRY REQUESTS) ---
    //% group="Sensor Data Requests"
    //% block="request ultrasonic distance"
    export function Read_Ultrasonic_Distance() { radio.sendString("REQ_SONAR") }

    //% group="Sensor Data Requests"
    //% block="request analog sensor (P0 Potentiometer/Soil)"
    export function Read_Potentiometer_Dial() { radio.sendString("REQ_P0_A") }

    //% group="Sensor Data Requests"
    //% block="request digital sensor (P1 Crash Switch)"
    export function Read_Crash_Switch() { radio.sendString("REQ_P1_D") }

    //% group="Sensor Data Requests"
    //% block="request sensor P2 data"
    export function Read_Sensor_P2() { radio.sendString("REQ_P2") }

    // --- AUDIO & DISPLAY ---
    //% group="Audio & Display"
    //% block="play buzzer tone $freq Hz"
    export function Play_Buzzer_Tone(freq: number) { radio.sendValue("TONE", freq) }

    //% group="Audio & Display"
    //% block="show shield icon $iconId"
    //% iconId.min=1 iconId.max=4
    export function Show_Shield_Icon(iconId: number) { radio.sendValue("ICON", iconId) }

    //% group="Audio & Display"
    //% block="show text on OLED $text"
    export function Show_OLED_Text(text: string) { radio.sendString("TXT:" + text) }

    //% group="Audio & Display"
    //% block="set shield LED color red $r green $g blue$b"
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255
    export function Set_Shield_RGB(r: number, g: number, b: number) {
        radio.sendString(`RGB:${r},${g},${b}`)
    }
}
