const zmq = require("zeromq");
const channel = "channel name";
require('dotenv').config()
const outbound = zmq.socket("pub");
outbound.bindSync("tcp://127.0.0.1:3000");

const main = async () => {

  let price = 200;
  while (true) {
    outbound.send(
      [channel, JSON.stringify({data: price}).toString('base64')])
    await new Promise((resolve) => {setTimeout(resolve, 300)});
    price += 1;
    if (price > 220) { price = 200; }
  }
}

main();


