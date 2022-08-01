let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3000");

const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3023");

let queueA = []
let queueB = []

const main = async () => {
  pull.subscribe(channel);
  stateSocket.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    let spread = received.askPrice - received.bidPrice;
    let volume = received.bidQty;
    let heat = volume / spread;
    queueB.push({
        "spread":spread, 
        "volume" : volume,
        "heat" : heat});
    await compute();
  });

  stateSocket.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueA.push(received);
  });
}

const compute = () => {
  let A = getA();
  let B = getB();

  if (A && B){
    let indicator = calculateNewValue(A, B);
    push.send(
      //send calculated indicator and most recent parsed data, in 
      //this case: spread, volume, heat
      [channel, Buffer.from(JSON.stringify([indicator, B])
        .toString('base64'))])
    resetA();
    resetB();
  } else {
    push.send(
      //if no previous state was received, simply 
      //send it in an array so the receiving process can check
      //for length as a method of detecting the type of message
      [channel, Buffer.from(JSON.stringify([B])
        .toString('base64'))])
  }

}

const calculateNewValue = () => {
  return { rollingAvg: 34.5 };
  let avgSpread = A.spread + B.spread / 2;
  let avgVolume = A.volume + B.volume / 2;
  let previousHeat = A.heat;
  let direction = ((A.heat - B.heat) > 0) ? -1 : +1; //
  let heatChange = A.heat - B.heat;
  let heat = B.heat;
  return {
    "avgSpread": avgSpread,
    "avgVolume": avgVolume,
    "previousHeat": previousHeat,
    "direction": direction,
    "heatChange": heatChange,
    "heat": heat 
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
