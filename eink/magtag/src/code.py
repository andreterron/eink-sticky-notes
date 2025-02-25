# SPDX-FileCopyrightText: 2020 Brent Rubell for Adafruit Industries
#
# SPDX-License-Identifier: MIT
import time
import ssl
import io
import os
import wifi
import socketpool
import adafruit_requests
import displayio
from adafruit_magtag.magtag import MagTag
import adafruit_imageload.png as png_load

HOSTNAME = os.getenv("SERVER_HOSTNAME")

# REST endpoints
CHECK_JSON_URL = HOSTNAME + "/data"
IMAGE_URL      = HOSTNAME + "/image.png"


# Track the last update we saw
previous_update = None

wifi.radio.connect(os.getenv("CIRCUITPY_WIFI_SSID"), os.getenv("CIRCUITPY_WIFI_PASSWORD"))

print("Connected to wifi!")

pool = socketpool.SocketPool(wifi.radio)
requests = adafruit_requests.Session(pool, ssl.create_default_context())

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


def display_image_png_from_memory(image_bytes):
    """Display a PNG from memory on the eInk display."""
    # Release any previous display context
    # displayio.release_displays()

    # The built-in display (eInk on the MagTag)
    # display = board.DISPLAY
    display = magtag.graphics.display

    # Create a main Group
    group = displayio.Group()

    # Wrap the image bytes in a BytesIO, then load
    with io.BytesIO(image_bytes) as f:
        bitmap, palette = png_load.load(
            f,
            bitmap=displayio.Bitmap,       # Required
            palette=displayio.Palette      # Optional if you want a palette
        )

    # Create a TileGrid to hold the bitmap
    tile_grid = displayio.TileGrid(bitmap, pixel_shader=palette)
    group.append(tile_grid)

    # Show the group on the display
    display.root_group = group
    display.refresh()
    print("PNG displayed from memory!")

while True:
    
    try:
      print("Checking for updates....")
      # 1) Fetch the JSON
      resp = requests.get(CHECK_JSON_URL)
      data = resp.json()
      # print(data["last_update"])
      new_update = data["last_update"]
      resp.close()
    
      # 2) Compare to stored value
      if new_update != previous_update:
          print("Update found! Downloading PNG to memory...")

          # 3) Download the PNG file into memory
          img_resp = requests.get(IMAGE_URL)
          image_data = img_resp.content  # Raw bytes of the PNG
          img_resp.close()

          # 4) Display the newly downloaded PNG
          display_image_png_from_memory(image_data)

          # 5) Save new timestamp
          previous_update = new_update
      else:
          print("No change in 'last_update'")
    
    except Exception as e:
        print("Error:", e)
    magtag.peripherals.neopixel_disable = True
    time.sleep(60)
