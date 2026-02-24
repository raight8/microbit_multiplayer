def send_position():
    global msg2
    msg2 = "" + str(my_id) + "," + ("" + str(my_x)) + "," + ("" + str(my_y)) + "," + ("" + str(code))
    radio.send_string(msg2)

def on_button_pressed_a():
    global my_x
    my_x = (my_x + 1) % 5
    send_position()
    draw_dots()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_received_string(msg):
    global sender_id, x, y, sender_code, j
    parts = msg.split(",")
    sender_id = int(parts[0])
    x = int(parts[1])
    y = int(parts[2])
    sender_code = int(parts[3])
    if sender_id == my_id:
        return
    if others_ids.index_of(sender_id) < 0:
        others_ids.append(sender_id)
        others_x.append(x)
        others_y.append(y)
        others_code.append(sender_code)
    else:
        idx = others_ids.index(sender_id)
        others_x[idx] = x
        others_y[idx] = y
        others_code[idx] = sender_code
    j = len(others_ids) - 1
    while j >= 0:
        if others_code[j] != code:
            others_ids.pop(j)
            others_x.pop(j)
            others_y.pop(j)
            others_code.pop(j)
        j += 0 - 1
    draw_dots()
radio.on_received_string(on_received_string)

def on_button_pressed_ab():
    global code, ab_
    code += 1
    basic.show_number(code)
    send_position()
    draw_dots()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global my_y
    my_y = (my_y + 1) % 5
    send_position()
    draw_dots()
input.on_button_pressed(Button.B, on_button_pressed_b)

def draw_dots():
    basic.clear_screen()
    led.plot(my_x, my_y)
    i = 0
    while i <= len(others_ids) - 1:
        if others_code[i] == code:
            led.plot(others_x[i], others_y[i])
        i += 1
j = 0
sender_code = 0
y = 0
x = 0
sender_id = 0
my_y = 0
my_x = 0
msg2 = ""
others_code: List[number] = []
others_y: List[number] = []
others_x: List[number] = []
others_ids: List[number] = []
my_id = 0
code = 0
code = 1
my_id = control.device_serial_number()
others_ids = [0]
others_x = [0]
others_y = [0]
others_code = [0]
others_ids.pop(0)
others_x.pop(0)
others_y.pop(0)
others_code.pop(0)
radio.on()
radio.set_group(code)
ab_ = 0

def on_forever():
    send_position()
    basic.pause(1000)
basic.forever(on_forever)
