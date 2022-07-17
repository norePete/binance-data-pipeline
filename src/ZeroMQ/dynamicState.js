let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3004");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3001");

const main = async () => {
  pull.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log("received a message related to:", channel, " & msg = ", message, "or : ",received);

/*
 * any computation needs 
 * to take placew here
 *
 */
    let calculated = received ;


    //keep emitting the current state until a new state is received
    while (true) {
      push.send(
        [channel, JSON.stringify(calculated).toString('base64')])
      await new Promise((resolve) => {setTimeout(resolve, 2000)});
    }
  });
}

main();
