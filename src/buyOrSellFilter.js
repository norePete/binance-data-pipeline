let zmq = require("zeromq");
let channel = "channel name"

const thresholdSocket = zmq.socket("sub");
thresholdSocket.connect("tcp://127.0.0.1:3005");

const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3006");


const main = async () => {
  thresholdSocket.subscribe(channel);
  stateSocket.subscribe(channel);

  let thresholdObj = {
    maxSomething : 100,
    minSomething : 4
  }

  thresholdSocket.on("message",async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    //implement this using a dict probably
    if(received.maxSomething) {thresholdObj.maxSomething = received.maxSomething}
    if(received.minSomething) {thresholdObj.minSomething = received.minSomething}
    console.log(thresholdObj);
  });

  stateSocket.on("message",async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    await compute(received);
  });
}

const compute = async (state) => {
  let profitableOrder = await findGoodOrder(state);
  console.log(profitableOrder);
  push.send(
    [channel, Buffer.from(JSON.stringify(profitableOrder).toString('base64'))]);
}


const findGoodOrder = async(state) => {
  console.log(state)
  if(state.minimumBalance < state.balance) {
    return [{
      'symbol': state.symbol,
      'price': state.askPrice,
      'bidQty': 10
    }]
  } else { return []; }
}
main();
