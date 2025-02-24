import os
import time
import terminalio
from adafruit_magtag.magtag import MagTag
import json
import board
import displayio
import wifi
import socketpool
import ssl
import adafruit_requests
import io
# from adafruit_bitmap_reader import bitmap_reader  # or use OnDiskBitmap below
import adafruit_imageload.png as png_load

magtag = MagTag()

# Wi-Fi credentials
WIFI_SSID = os.getenv("CIRCUITPY_WIFI_SSID")
WIFI_PASS = os.getenv("CIRCUITPY_WIFI_PASSWORD")
HOSTNAME = os.getenv("SERVER_HOSTNAME")

# REST endpoints
CHECK_JSON_URL = HOSTNAME + "/data"
IMAGE_URL      = HOSTNAME + "/image.png"

# Track the last update we saw
previous_update = None

# Connect to Wi-Fi
print("Connecting to Wi-Fi...")
wifi.radio.connect(WIFI_SSID, WIFI_PASS)
pool = socketpool.SocketPool(wifi.radio)
requests = adafruit_requests.Session(pool, ssl.create_default_context())
print("Connected!")

def display_image_png_from_memory(image_bytes):
    """Display a PNG from memory on the eInk display."""
    # Release any previous display context
    # displayio.release_displays()

    # The built-in display (eInk on the MagTag)
    # display = board.DISPLAY
    display = magtag.graphics.display

    # Create a main Group
    group = displayio.Group()

    print("1")

    # Wrap the image bytes in a BytesIO, then load
    with io.BytesIO(image_bytes) as f:
        bitmap, palette = png_load.load(
            f,
            bitmap=displayio.Bitmap,       # Required
            palette=displayio.Palette      # Optional if you want a palette
        )
        # bitmap, palette = png_load.load(f)

    print("2")

    # Create a TileGrid to hold the bitmap
    tile_grid = displayio.TileGrid(bitmap, pixel_shader=palette)
    group.append(tile_grid)

    print("3")

    # Show the group on the display
    display.show(group)
    display.refresh()
    print("PNG displayed from memory!")

while True:
    try:
        print("Checking for updates...")
        # 1) Fetch the JSON
        resp = requests.get(CHECK_JSON_URL)
        data = resp.json()
        resp.close()
        new_update = data["last_update"]
        
        # # 2) Compare to stored value
        # if new_update != previous_update:
        #     print("Update found! Downloading PNG...")

        #     # 3) Download the PNG file
        #     img_resp = requests.get(IMAGE_URL)
        #     with open("/image.png", "wb") as f:
        #         f.write(img_resp.content)
        #     img_resp.close()

        #     # 4) Display the newly downloaded PNG
        #     display_image_png("/image.png")

        #     # 5) Save new timestamp
        #     previous_update = new_update
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

    # Wait a bit before checking again
    time.sleep(60)


# def display_image(file_path):
#     """Display a BMP image on the MagTag."""
#     # Clean up any previous display context
#     # displayio.release_displays()

#     # If you're using displayio directly
#     display = board.DISPLAY  # On MagTag, board.DISPLAY is the eInk
#     group = displayio.Group()

#     # Method 1: Using adafruit_bitmap_reader
#     bmp, palette = bitmap_reader.load(file_path)
#     tile_grid = displayio.TileGrid(bmp, pixel_shader=palette)
#     group.append(tile_grid)

#     display.show(group)
#     display.refresh()  # eInk refresh

# def display_image_png(file_path):
#     """Display a PNG on the eInk display."""
#     # Release any previous display context
#     # displayio.release_displays()

#     # The built-in display (eInk on the MagTag)
#     display = board.DISPLAY

#     # Create a main Group to hold image TileGrid
#     group = displayio.Group()

#     # Load the PNG file
#     with open(file_path, "rb") as f:
#         bitmap, palette = png_load.load(f)  # Load indexed PNG

#     # Create a TileGrid to hold the bitmap
#     tile_grid = displayio.TileGrid(bitmap, pixel_shader=palette)
#     group.append(tile_grid)

#     # Show the group on the display
    
#     # display.show(group)
#     # display.refresh()  # eInk refresh
#     print("PNG displayed!")