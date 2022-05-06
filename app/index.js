import { HeartRateSensor } from "heart-rate";
import document from "document";
import display from "display";
import * as messaging from "messaging";


// FitBit variables
const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const consoleLabel = document.getElementById("console-label");
const consoleData = document.getElementById("console-data");
const sensors = [];

// Test message
console.log('Hello world!');

//Messaging API - Get the heart rate data from the device to the companion app.
function returnHRData(data)
{
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        consoleData.text = data;
        messaging.peerSocket.send(data);
    } 
    else{
        console.error("Error: Connection is not open");
        consoleData.text = "Error: Connection is not open";
    }
}

// Error handling
messaging.peerSocket.addEventListener("error", (err) => {
    console.error("Connection error: ${err.code} - ${err.message}");
});

//Use the HeartRate API to get the data from the sensors
if (HeartRateSensor) {
    const hrm = new HeartRateSensor({ frequency: 1});    
    hrm.addEventListener("reading", () => {
        let hrRate = JSON.stringify({
        heartRate: hrm.heartRate ? hrm.heartRate : 0        
        });
        hrmData.text = hrRate;
        // Send the heart rate sensor data to the companion app using the Messaging API
        returnHRData(hrRate);
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
//display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});