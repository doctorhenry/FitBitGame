import * as messaging from "messaging";
import { me as companion } from "companion";

//Localhost server.
//const wsUri = "ws://localhost:8080";
//PieSocket Test only!!
//const wsUri = "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";
const wsUri = "production_url;";
const websocket = new WebSocket(wsUri);
var counter = 0;

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
        console.log("fitibt-data: "+ evt.data);
        counter = counter + 1;
        console.log("counter: "+ counter);
        //WS from here to the localhost server.
        // The localhost server uses npm ws and is not part of this repo.
        //See: https://github.com/websockets/ws
        //websocket.send(evt.data);
        if(counter >= 5)
        {
            SendSocketMessage(evt.data);
            counter = 0;
        }        
    }
});

messaging.peerSocket.addEventListener("error", (err) => {
    console.error(`Connection error: ${err.code} - ${err.message}`);
});
const delay = ms => new Promise(res => setTimeout(res, ms));
async function SendSocketMessage(message)
{
    await delay(5000);
    console.log("sending socket msg: " + message);
    websocket.send(message);
}

//Fetch the hear rate every two minutes
//setInterval(fetchHR,  3000);

