/* Heltec Automation weather_station example
 *
 * Function:
 * 1. This example demonstrates how to obtain weather, time, etc. and display on the E-ink display.
 * 2. Time updates use part refresh, while others information update use global refresh
 * 3. Using the weather API provided by senderse.com.
 *
 * Description:
 * 1. This example needs to work with `ArduinoJson` library.
 * 2. Get weather information via http.
 *
 * Library url: https://github.com/HelTecAutomation/Heltec_ESP32
 * Support: support@heltec.cn
 *
 * HelTec AutoMation, Chengdu, China
 * 成都惠利特自动化科技有限公司
 * https://www.heltec.org
 *
 * */
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
int demoMode = 0;

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
void Navigation_bar()
{
  display.setFont(ArialMT_Plain_10);
  display.drawLine(0, 15, 296, 15);
  display.drawXbm(5, -3, 20, 20, wifix_bitfis);
  display.drawString(25, 0, ssid);
  battery();
}
void battery()
{
  analogReadResolution(12);
  int battery_levl = analogRead(7) * Resolution * battary_in * coefficient; // battary/4096*3.3* coefficient
  float battery_one = 0.4125;
  Serial.printf("ADC analog value = %.2f\n", battery_levl);
  if (battery_levl < battery_one)
  {
    display.drawString(230, 0, "N/A");
    display.drawXbm(255, 0, battery_w, battery_h, battery0);
  }
  else if (battery_levl < 2 * battery_one && battery_levl > battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery1);
  }
  else if (battery_levl < 3 * battery_one && battery_levl > 2 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery2);
  }
  else if (battery_levl < 4 * battery_one && battery_levl > 3 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery3);
  }
  else if (battery_levl < 5 * battery_one && battery_levl > 4 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery4);
  }
  else if (battery_levl < 6 * battery_one && battery_levl > 5 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery5);
  }
  else if (battery_levl < 7 * battery_one && battery_levl > 6 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, battery6);
  }
  else if (battery_levl < 7 * battery_one && battery_levl > 6 * battery_one)
  {
    display.drawXbm(270, 0, battery_w, battery_h, batteryfull);
  }
}
void drawImageDemo()
{
  display.setFont(ArialMT_Plain_16);
  MakeRequest();
  display.drawLine(165, 15, 165, 80);
  display.drawLine(0, 80, 296, 80);
  display.drawLine(0, 94, 296, 94);
  Serial.println("Done drawing image");
}
void MakeRequest()
{
  if (!client.connect(host, port))
  {
    Serial.println("Connect host failed!");
    return;
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
    return;
  }
  Serial.println("deserialize json success");

  // TODO: as number
  // strcpy(target, doc["last_update"].as<const char *>())
  // strtol - String to long integer
  // uint8_t code_day = strtol(doc["results"][0]["daily"][1]["code_day"].as<const char *>(), NULL, 10)
  // TODO: Parse last_update
  uint64_t current_last_update = doc["last_update"];

  Serial.println("Last update - Server");
  Serial.println(current_last_update);
  Serial.println("Last update - Local");
  Serial.println(last_update);

  if (current_last_update > last_update)
  {
    // TODO: do something
    last_update = current_last_update;
    Serial.println("Time updated!");
  }
  Serial.println("Going to stop");

  client.stop();
  Serial.println("Stopped");
}

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
  display.clear();
  display.clear();
  Navigation_bar();
  drawImageDemo();
  display.display();
  delay(1000 * 60);
}
