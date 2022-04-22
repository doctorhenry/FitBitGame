import { HeartRateSensor } from "heart-rate";
import document from "document";
import display from "display";
const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const sensors = [];
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