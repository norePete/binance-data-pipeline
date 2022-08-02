let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3004");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3001");

const main = async () => {
  let calculated = {
    symbol: "DEFAULT",
    askPrice: 0,
    lowestAskPrice: 999999,
    highestAskPrice: 0,
    spread: 0,
    volume: 0,
    avgVolume: 0,
    previousHeat: 0,
    heatChange: 0,
    heat: 0,
    balance: 0,
    minimumBalance: 10
  } 
  pull.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    //implement this better, using a dict or something
    if (received.symbol) {calculated.symbol = received.symbol}
    if (received.lowestAskPrice) {calculated.lowestAskPrice = received.lowestAskPrice}
    if (received.highestAskPrice) {calculated.highestAskPrice = received.highestAskPrice}
    if (received.spread) {calculated.spread = received.spread}
    if (received.volume) {calculated.volume = received.volume}
    if (received.askPrice) {calculated.askPrice = received.askPrice}
    if (received.avgVolume ) {calculated.avgVolume = received.avgVolume}
    if (received.previousHeat ) {calculated.previousHeat = received.previousHeat}
    if (received.heatChange) {calculated.heatChange = received.heatChange}
    if (received.heat ) {calculated.heat = received.heat}
    if (received.balance ) {calculated.balance = received.balance}
    if (received.minimumBalance ) {calculated.minimumBalance = received.minimumBalance}

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
