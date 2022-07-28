let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3003");

const main = async () => {
  pull.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log(received);
  });
}


main();
