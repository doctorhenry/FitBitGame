import * as messaging from "messaging";

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

// function processHRData(data)
// {
//     console.log("The rate is: ${data}")
//     //From here, send the data on with either MQTT, WS or an API.
// }

messaging.peerSocket.addEventListener("message", (evt) => {
    if (evt.data && evt.data.command === "heart-rate") {
        console.log('Awaiting HR data');
        fetchHR();
    }
  });

messaging.peerSocket.addEventListener("message", (evt) => {
    if (evt.data) {
        console.log(evt.data);
        //WS from here...
    }
});

messaging.peerSocket.addEventListener("error", (err) => {
    console.error(`Connection error: ${err.code} - ${err.message}`);
});

//Fetch the hear rate every two minutes
setInterval(fetchHR, 2 * 1000 * 60);