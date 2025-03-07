/**
 * Eink Sticky Notes
 */

// TODO: MQTT to receive signal when an update is available
// TODO: MQTT to send battery data

#include "HT_DEPG0290BxS800FxX_BW.h"
#include "images.h"
#include "secrets.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include "time.h" //Handle time
#include <HTTPClient.h>
DEPG0290BxS800FxX_BW display(5, 4, 3, 6, 2, 1, -1, 6000000); // rst,dc,cs,busy,sck,mosi,miso,frequency
typedef void (*Demo)(void);

/* screen rotation
 * ANGLE_0_DEGREE
 * ANGLE_90_DEGREE
 * ANGLE_180_DEGREE
 * ANGLE_270_DEGREE
 */
#define DIRECTION ANGLE_0_DEGREE
#define Resolution 0.000244140625
#define battary_in 3.3
#define coefficient 1.03
int width, height;

uint64_t last_update = 0;

const long gmtOffset_sec = -28800; // Time offset

const int daylightOffset_sec = 0;

WiFiClient client;
void setup()
{
  Serial.begin(115200);
  if (DIRECTION == ANGLE_0_DEGREE || DIRECTION == ANGLE_180_DEGREE)
  {
  }
  VextON();
  delay(100);
  display.init();
  display.screenRotate(DIRECTION);
  display.clear();
  display.drawString(0, 0, "init >>> ");
  width = display.width();
  height = display.height();
  Serial.print("Width: ");
  Serial.println(width);
  Serial.print("Height: ");
  Serial.println(height);
  Serial.print("Connecting to ");
  display.drawString(0, 20, "Connecting to ... ");
  Serial.println(ssid);
  display.drawString(100, 20, ssid);
  WiFi.begin(ssid, password);
  uint8_t i = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
    display.drawString(i, 40, ".");
    i = i + 10;
  }
  Serial.println("");
  Serial.println("WiFi connected");
  display.drawString(0, 60, "WiFi connected");
  Serial.println("IP address: ");
  display.drawString(0, 90, "IP address: ");
  display.drawString(60, 90, WiFi.localIP().toString().c_str());

  Serial.println(WiFi.localIP());
  Serial.println("");
  Serial.println("WiFi Conected!");
  display.display();
  delay(1000);
}
bool checkForChanges()
{
  if (!client.connect(host, port))
  {
    Serial.println("Connect host failed!");
    return false;
  }
  Serial.println("host Conected!");
  String getUrl = "/data";
  client.print(String("GET ") + getUrl + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
  Serial.println("Get send");
  char endOfHeaders[] = "\r\n\r\n";
  bool ok = client.find(endOfHeaders);
  if (!ok)
  {
    Serial.println("No response or invalid response!");
  }
  Serial.println("Skip headers");
  String line = "";
  line += client.readStringUntil('\n');
  Serial.println(line);
  DynamicJsonDocument doc(1400);
  DeserializationError error = deserializeJson(doc, line);
  if (error)
  {
    Serial.println("deserialize json failed");
    return false;
  }
  Serial.println("deserialize json success");

  uint64_t current_last_update = doc["last_update"];

  Serial.println("Last update - Server");
  Serial.println(current_last_update);
  Serial.println("Last update - Local");
  Serial.println(last_update);

  bool changed = current_last_update > last_update;

  if (changed)
  {
    last_update = current_last_update;
    Serial.println("Time updated!");
  }

  client.stop();
  Serial.println("Stopped");

  return changed;
}

void showImageFromServer()
{
  if (!client.connect(host, port))
  {
    Serial.println("Connect host failed!");
    return;
  }

  // TODO: Send width and height to request

  Serial.println("Downloading XBM image...");
  String getUrl = "/image.xbm";
  client.print(String("GET ") + getUrl + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");

  // Skip HTTP headers
  char endOfHeaders[] = "\r\n\r\n";
  if (!client.find(endOfHeaders))
  {
    Serial.println("Invalid response!");
    return;
  }

  display.clear();

  // Calculate buffer size with padding
  // Each row needs to be a multiple of 8 bits
  int rowBytes = (width + 7) / 8; // Rounds up to nearest byte
  uint8_t buffer[rowBytes * height];

  int bytesRead = client.readBytes(buffer, sizeof(buffer));

  if (bytesRead > 0)
  {
    display.drawXbm(0, 0, width, height, buffer);
    display.display();
  }

  client.stop();
  Serial.println("Image displayed");
}

// TODO: Review what's "Vext"
void VextON(void)
{
  pinMode(18, OUTPUT);
  digitalWrite(18, HIGH);
}

void VextOFF(void) // Vext default OFF
{
  pinMode(18, OUTPUT);
  digitalWrite(18, LOW);
}

void loop()
{
  bool changed = checkForChanges();

  if (changed)
  {
    showImageFromServer();
  }

  // TODO: Review update time
  delay(1000 * 60);
}
