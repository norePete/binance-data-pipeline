let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3999"); //empty port, not implemented yet

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3082");

const main = async () => {
  pull.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));

/*
 * any computation needs 
 * to take place here
 *
 */
  });
  while (true) {
    let rand = Math.floor(Math.random() * 199999);
    let calculated = {orderId: rand.toString()};
    console.log(calculated);
    push.send(
      [channel, JSON.stringify(calculated).toString('base64')])
    await new Promise((resolve) => {setTimeout(resolve, 300)});
  }
}

main();
