let zmq = require("zeromq");

let channel = "channel name";

const main = async () => {
  const sock = zmq.socket("pub");
  sock.bindSync("tcp://127.0.0.1:3000");
  console.log("Publisher bound to port 3000");

  let price = 200;
  while (true) {
    sock.send([channel, JSON.stringify({data: price}).toString('base64')])
    await new Promise((resolve) => {setTimeout(resolve, 300)});
    price += 1;
    if (price > 220) { price = 200; }
  }
}

main();
