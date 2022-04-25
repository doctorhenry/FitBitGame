import { HeartRateSensor } from "heart-rate";
import document from "document";
import display from "display";
import * as mqtt from "mqtt";

// FitBit variables
const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const sensors = [];

// MQTT variables
var mqtt_url = 'm21.cloudmqtt.com';
let topic = 'biosignal';
const client = mqtt.connect(mqtt_url);
const consoleData = document.getElementById("console-data");

// Connect to cloud MQTT instance
client.on('connect', function () {
    client.subscribe(topic, function (err) {
     if (!err) {
       client.publish(topic, 'Hello mqtt')
       hrmData.text= "Connected to cloud MQTT";
     }
     else
     {
        hrmData.text= "Failed to connect to cloud MQTT with error: ". err;
     }
  })
})

client.on('message', function (topic, message) {
   // message is Buffer
   console.log(message.toString())
   client.end()
})

// Test message
console.log('Hello world!');

if (HeartRateSensor) {
    const hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
        hrmData.text = JSON.stringify({
        heartRate: hrm.heartRate ? hrm.heartRate : 0
        });
    });
    sensors.push(hrm);
    hrm.start();
} 
else 
{
    hrmLabel.style.display = "none";
    hrmData.style.display = "none";
}
  
display.addEventListener("change", () => {
// Automatically stop all sensors when the screen is off to conserve battery
display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});