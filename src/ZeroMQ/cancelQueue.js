let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3007");

const main = async () => {
  pull.subscribe(channel);

  pull.on("message", function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log("received a message related to:", channel, " & msg = ", message, "or : ",received);

/*
 * any computation needs 
 * to take placew here
 *
 */
    console.log(`send POST request to cancel ${received}`)
  });
}

main();
