import * as messaging from "messaging";
import { me as companion } from "companion";

//Localhost server.
//const wsUri = "ws://localhost:8080";
//PieSocket Test only!!
//const wsUri = "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";
const wsUri = "YOUR_OWN_URL";
const websocket = new WebSocket(wsUri);
// const MILLISECONDS_PER_MINUTE = 1000 * 60;

// // Tell the Companion to wake after 5 minutes
// companion.wakeInterval = 5 * MILLISECONDS_PER_MINUTE;

// // Listen for the event
// companion.addEventListener("wakeinterval", doThis);

// // Event happens if the companion is launched and has been asleep
// if (companion.launchReasons.wokenUp) {
//    doThis();
// }

// function doThis() {
//    console.log("Wake interval happened!");
// }

// // Listen for the event
// companion.addEventListener("readystatechange", doThis);

// // The Device application caused the Companion to start
// if (companion.launchReasons.peerAppLaunched) {
//   doThis();
// }

// function doThis() {
//   console.log("Device application was launched!");


// }

websocket.addEventListener("open", onOpen);
websocket.addEventListener("close", onClose);
websocket.addEventListener("message", onMessage);
websocket.addEventListener("error", onError);

function onOpen(evt) {
   console.log("CONNECTED");   
}

function onClose(evt) {
   console.log("DISCONNECTED");
}

function onMessage(evt) {
   console.log(`MESSAGE: ${evt.data}`);
}

function onError(evt) {
   console.error(`ERROR: ${evt.data}`);
}

function fetchHR()
{
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
    {
        //Tell the companion app to you are sending data from the watch.
        messaging.peerSocket.send({
            command:"heart-rate"
        });
    }
}

messaging.peerSocket.addEventListener("message", (evt) => {
    if (evt.data && evt.data.command === "heart-rate") {
        console.log('Awaiting HR data');
        fetchHR();
    }
});

messaging.peerSocket.addEventListener("message", (evt) => {
    if (evt.data) {
        console.log(evt.data);
        //WS from here to the localhost server.
        // The localhost server uses npm ws and is not part of this repo.
        //See: https://github.com/websockets/ws
        websocket.send(evt.data);
    }
});

messaging.peerSocket.addEventListener("error", (err) => {
    console.error(`Connection error: ${err.code} - ${err.message}`);
});

//Fetch the hear rate every two minutes
setInterval(fetchHR, 2 * 1000 * 60);


