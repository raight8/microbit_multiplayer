function send_position() {
    
    msg2 = "" + ("" + my_id) + "," + ("" + ("" + my_x)) + "," + ("" + ("" + my_y)) + "," + ("" + ("" + code))
    radio.sendString(msg2)
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    my_x = (my_x + 1) % 5
    send_position()
    draw_dots()
})
radio.onReceivedString(function on_received_string(msg: string) {
    let idx: number;
    
    let parts = _py.py_string_split(msg, ",")
    sender_id = parseInt(parts[0])
    x = parseInt(parts[1])
    y = parseInt(parts[2])
    sender_code = parseInt(parts[3])
    if (sender_id == my_id) {
        return
    }
    
    if (others_ids.indexOf(sender_id) < 0) {
        others_ids.push(sender_id)
        others_x.push(x)
        others_y.push(y)
        others_code.push(sender_code)
    } else {
        idx = _py.py_array_index(others_ids, sender_id)
        others_x[idx] = x
        others_y[idx] = y
        others_code[idx] = sender_code
    }
    
    j = others_ids.length - 1
    while (j >= 0) {
        if (others_code[j] != code) {
            _py.py_array_pop(others_ids, j)
            _py.py_array_pop(others_x, j)
            _py.py_array_pop(others_y, j)
            _py.py_array_pop(others_code, j)
        }
        
        j += 0 - 1
    }
    draw_dots()
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    code += 1
    basic.showNumber(code)
    send_position()
    draw_dots()
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    my_y = (my_y + 1) % 5
    send_position()
    draw_dots()
})
function draw_dots() {
    basic.clearScreen()
    led.plot(my_x, my_y)
    let i = 0
    while (i <= others_ids.length - 1) {
        if (others_code[i] == code) {
            led.plot(others_x[i], others_y[i])
        }
        
        i += 1
    }
}

let j = 0
let sender_code = 0
let y = 0
let x = 0
let sender_id = 0
let my_y = 0
let my_x = 0
let msg2 = ""
let others_code : number[] = []
let others_y : number[] = []
let others_x : number[] = []
let others_ids : number[] = []
let my_id = 0
let code = 0
code = 1
my_id = control.deviceSerialNumber()
others_ids = [0]
others_x = [0]
others_y = [0]
others_code = [0]
_py.py_array_pop(others_ids, 0)
_py.py_array_pop(others_x, 0)
_py.py_array_pop(others_y, 0)
_py.py_array_pop(others_code, 0)
radio.on()
radio.setGroup(code)
let ab_ = 0
basic.forever(function on_forever() {
    send_position()
    basic.pause(1000)
})
