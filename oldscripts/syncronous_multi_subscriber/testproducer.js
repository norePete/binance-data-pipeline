let zmq = require("zeromq");
let channel = "channel name"

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3000");

let price = 1000;
const main = async () => {
  while(true) {
    price += 1;
    push.send([channel, JSON.stringify({data: price}).toString('base64')])
    if(price > 1500) { price = 1000; }
    await new Promise((resolve) => { setTimeout(resolve, 2000)});
  }

}

main();
