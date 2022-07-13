let zmq = require("zeromq");
let channel = "channel name"

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3001");

const main = async () => {
  let price = 0;
  while(true){
    price += 1;
    push.send([channel, JSON.stringify({data: price}).toString('base64')])
    if (price > 200) { price = 0; }
    await new Promise((resolve) => {setTimeout(resolve, 1000)});
  }
}

main();
