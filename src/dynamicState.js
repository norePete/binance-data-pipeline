let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3004");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3001");

const main = async () => {
  let calculated = {
    rollingAvg: 0,
    spread: 0,
    volume: 0,
    heat: 0,
    data: 0,
    balance: 0,
    minimumBalance: 0
  } 
  pull.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    if (received.rollingAvg ) {calculated.rollingAvg = received.rollingAvg}
    if (received.spread ) {calculated.spread = received.spread}
    if (received.volume ) {calculated.volume = received.volume}
    if (received.heat ) {calculated.heat = received.heat}
    if (received.data ) {calculated.data = received.data}
    if (received.balance ) {calculated.balance = received.balance}
    if (received.minimumBalance ) {calculated.minimumBalance = received.minimumBalance}


/*
 * any computation needs 
 * to take placew here
 *
 */
    push.send(
      [channel, Buffer.from(JSON.stringify(calculated).toString('base64'))])
    console.log("send", calculated);
  });

  //keep emitting the current state until a new state is received
  while (true) {
    push.send(
      [channel, Buffer.from(JSON.stringify(calculated).toString('base64'))])
    console.log("resend", calculated);
    await new Promise((resolve) => {setTimeout(resolve, 2000)});
  }
}

main();
