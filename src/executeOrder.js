let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3006");

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
      console.log("send POST request to buy/sell", received[0])
    } else {
      console.log("no waiting orders")
    }
  });
}

main();
