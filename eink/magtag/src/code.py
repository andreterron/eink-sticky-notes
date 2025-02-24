# SPDX-FileCopyrightText: 2020 Brent Rubell for Adafruit Industries
#
# SPDX-License-Identifier: MIT
import time
from adafruit_magtag.magtag import MagTag

magtag = MagTag()

magtag.add_text(
    text_position=(
        50,
        (magtag.graphics.display.height // 2) - 1,
    ),
    text_scale=3,
)
magtag.set_text("Hello World")

print("Go!")
timestamp = time.monotonic()

while True:
    magtag.peripherals.neopixel_disable = True
    time.sleep(0.01)
