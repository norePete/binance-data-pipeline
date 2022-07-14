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
    let received = Buffer.from(message, 'base64').toString('ascii');
    queueA.push(received);
    await compute();
  });
  pullB.on("message", async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    queueB.push(received);
    await compute();
  });
  pullC.on("message", async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    queueC.push(received);
    await compute();
  });

}

const compute = async () => {
  let A = getA();
  let B = getB();
  let C = getC();
  if (A && B && C && A.length > 0 && B.length > 0 && C.length > 0) {
    resetA();
    resetB();
    resetC();
    let newState = constructState(A, B, C);
    push.send(
    [channel, JSON.stringify({data: newState}).toString('base64')]);
  } else {
  }
}

const constructState = (a,b,c) => {
  return [a, b, c];
}
const getA = () => {
  if (!queueA || queueA.length === 0) { return; }
  return queueA[queueA.length - 1];
}
const getB = () => {
  if (!queueB || queueB.length === 0) { return; }
  return queueB[queueB.length - 1];
}
const getC = () => {
  if (!queueC || queueC.length === 0) { return; }
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
