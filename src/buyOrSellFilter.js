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
    avg: 100,
    vol: 200,
    min: 1,
    max: 999
  }

  thresholdSocket.on("message",async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    //implement this using a dict probably
    if(received.avg) {thresholdObj.avg = received.avg}
    if(received.vol) {thresholdObj.vol = received.vol}
    if(received.min) {thresholdObj.min = received.min}
    if(received.max) {thresholdObj.max = received.max}
  });
  stateSocket.on("message",async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    await compute(received, thresholdObj);
  });
}

const compute = async (state, threshold) => {
  let profitableOrder = await findGoodOrder(state, threshold);
  console.log(profitableOrder);
  push.send(
    [channel, Buffer.from(JSON.stringify(profitableOrder).toString('base64'))]);
}


const findGoodOrder = async(state, threshold) => {
  if(state.askPrice < threshold.max) {
    return [{
      'symbol': state.symbol,
      'price': state.askPrice,
      'bidQty': 10
    }]
  } else { return []; }
}
main();
