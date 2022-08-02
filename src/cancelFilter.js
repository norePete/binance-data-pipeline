let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3082");
const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3007");

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
    resetA();
    resetB();
    let cancelCommand = findBadOrder(A, B);
    console.log(cancelCommand);
    push.send(
    [channel, Buffer.from(JSON.stringify(cancelCommand).toString('base64'))]);
  } else {
  }
}

const findBadOrder = (order,state) => {
  if (state.minimumBalance > state.balance) {
    return [order];
  }
  return [];
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
