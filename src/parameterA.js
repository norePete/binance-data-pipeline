let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3000");

const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3003");

let queueA = []
let queueB = []

const main = async () => {
  pull.subscribe(channel);
  stateSocket.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueA.push(received);
    await compute();
  });
  stateSocket.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueB.push(received);
    await compute();
  });
}

const compute = async () => {
  let A = getA();
  let B = getB();
  if (A && B){
    let indicator = await calculateNewValue(A.askPrice, B);
    console.log(indicator);
    push.send(
      [channel, Buffer.from(JSON.stringify(indicator).toString('base64'))])
    resetA();
    resetB();
  } else if (queueA.length > 10){
    resetA();
  } else if (queueB.length > 10){
    resetB();
  } else {}
}

const calculateNewValue = async (askPrice, state) => {
  let lowestAskPrice = (askPrice < state.lowestAskPrice) ? askPrice : state.lowestAskPrice;
  let highestAskPrice = (askPrice > state.highestAskPrice) ? askPrice : state.highestAskPrice;
  return {
    askPrice,
    lowestAskPrice,
    highestAskPrice
  };
}

const getA = () => {
  if (!queueA || queueA.length === 0) { return; }
  return queueA[queueA.length - 1];
}
const getB = () => {
  if (!queueB || queueB.length === 0) { return; }
  return queueB[queueB.length - 1];
}
const resetA = () => {
  queueA = []
}
const resetB = () => {
  queueB = []
}

main();
