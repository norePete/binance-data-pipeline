let zmq = require("zeromq");
let channel = "channel name"

const pull = zmq.socket("sub");
pull.connect("tcp://127.0.0.1:3040");

const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3033");

let queueA = []
let queueB = []

const main = async () => {
  //pull current balance
  pull.subscribe(channel);
  stateSocket.subscribe(channel);

  pull.on("message", async function(topic, message) {
    let received = JSON.parse(Buffer.from(message, 'base64'));
    queueA.push(received);
    await compute();
  });
  
  //pull minimum balance from state, even though it'll never change
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
    let indicator = await calculateNewValue(A, B);
    console.log(indicator);
    push.send(
      [channel, Buffer.from(JSON.stringify(indicator).toString('base64'))])
    resetA();
    resetB();
  } else {
  }
}

const calculateNewValue = async(apiData, state) => {
  let minimumBal = state.minimumBalance;
  let currentBal = apiData.balance.usdt + apiData.balance.usdc;
  console.log(currentBal)
  return { 
    minimumBalance: minimumBal,
    balance: currentBal
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
