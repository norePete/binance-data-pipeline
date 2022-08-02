let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3007");

const main = async () => {
  pull.subscribe(channel);

  pull.on("message", function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));

/*
 * any computation needs 
 * to take placew here
 *
 */
    if (received.length > 0) {
      console.log("send POST request to cancel", received[0])
    } else { console.log("nothing to cancel");}
  });
}

main();
