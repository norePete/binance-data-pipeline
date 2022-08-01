let zmq = require("zeromq");
let channel = "channel name"

const pullA = zmq.socket("sub");
pullA.connect("tcp://127.0.0.1:3003");
const pullB = zmq.socket("sub");
pullB.connect("tcp://127.0.0.1:3023");
const pullC = zmq.socket("sub");
pullC.connect("tcp://127.0.0.1:3033");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3004");

let queueA = []
let queueB = []
let queueC = []

const main = async () => {
  pullA.subscribe(channel);
  pullB.subscribe(channel);
  pullC.subscribe(channel);

  pullA.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueA.push(received);
    await compute();
  });
  pullB.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    console.log("received", received);
    queueB.push(received);
    await compute();
  });
  pullC.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueC.push(received);
    await compute();
  });

}

const compute = async () => {
  let A = getA();
  let B = getB();
  let C = getC();
  console.log('B', B);
  if (A && B && C) {
    let newState = constructState(A, B, C);
    push.send(
    [channel, Buffer.from(JSON.stringify(newState).toString('base64'))]);
    resetA();
    resetB();
    resetC();
  } else {
  }
}

const constructState = (a,b,c) => {
  let state = {
    ...a,
    ...b,
    ...c,
  }
  return state;
}
const getA = () => {
  if (!queueA || queueA.length === 0) { return "failed"; }
  return queueA[queueA.length - 1];
}
const getB = () => {
  console.log("queueB? ",!!queueB)
  if (!queueB || queueB.length === 0) { return; }
  return queueB[queueB.length - 1];
}
const getC = () => {
  if (!queueC || queueC.length === 0) { return "failed"; }
  return queueC[queueC.length - 1];
}
const resetA = () => {
  queueA = []
}
const resetB = () => {
  queueB = []
}
const resetC = () => {
  queueC = []
}


main();
