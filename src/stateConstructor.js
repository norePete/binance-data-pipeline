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
    if (queueB.length > 0 && queueC.length > 0){
      await compute();
    }
  });
  pullB.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueB.push(received);
    if (queueA.length > 0 && queueC.length > 0){
      await compute();
    }
  });
  pullC.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueC.push(received);
    await compute();
    if (queueB.length > 0 && queueA.length > 0){
      await compute();
    }
  });

}

const compute = async () => {
  let A = getA();
  let B = getB();
  let C = getC();
  if (A && B && C) {
    let newState = await constructState(A, B, C);
    console.log("newstate", newState);
    push.send(
    [channel, Buffer.from(JSON.stringify(newState).toString('base64'))]);
    resetA();
    resetB();
    resetC();
  } else {
  }
}

const constructState = async (a,b,c) => {
  let state = {
    ...a,
    ...b,
    ...c,
  }
  return state;
}
const getA = () => {
  if (!queueA || queueA.length === 0) { return {a: "failed"}; }
  return queueA[queueA.length - 1];
}
const getB = () => {
  if (!queueB || queueB.length === 0) { return {b: "failed"};}
  return queueB[queueB.length - 1];
}
const getC = () => {
  if (!queueC || queueC.length === 0) { return {c: "failed"}; }
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
