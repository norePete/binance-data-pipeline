const { Lock } = require('./lock');
const ipc = require('node-ipc').default;
const EventEmitter = require('events');

// GLOBAL QUEUES
let globalSendOrders = []
let globalCancelOrders = []
let globalOpenOrders = []
let globalFilledOrders = []

// QUEUE CONTROLLERS (PUSH)
const eventEmitter = new EventEmitter();
eventEmitter.on('send', (obj) => {
  globalSendOrders.push(obj)
  console.log('push order onto send queue', obj);
});
eventEmitter.on('cancel', (obj) => {
  globalCancelOrders.push(obj)
  console.log('push order onto cancel queue', obj);
});
eventEmitter.on('open', (obj) => {
  globalOpenOrders.push(obj)
  console.log('push order onto open queue', obj);
});
eventEmitter.on('filled', (obj) => {
  globalFilledOrders.push(obj) 
  console.log('push order onto filled queue', obj);
});

// QUEUE CONTROLLERS (POP)
function* pullFromSend() {
  yield* globalSendOrders;
}
function* pullFromCancel() {
  yield* globalCancelOrders;
}
function* pullFromOpen() {
  yield* globalOpenOrders;
}
function* pullFromFilled() {
  yield* globalFilledOrders;
}


// GLOBAL DATA
let testdata = [1,2,3]


let setPoints = { //thresholds
  "avg": 245.6,
  "avg1": 233,
  "avg5": 180,
  "avg10": 190,
  "avg20": 250,
  "vol": 102400,
  "delta": -5,
  "theta": 0.6,
  "min" : 200,
  "max" : 300
}

let globalModel = { //real time data
  "avg": 245.6,
  "avg1": 233,
  "avg5": 180,
  "avg10": 190,
  "avg20": 250,
  "vol": 102400,
  "delta": -5,
  "theta": 0.6,
}

/*
 * The data analysis is divided into functions that
 * each independently check a condition. If the condition
 * is met, then a buy or sell order is pushed onto the 
 * 'globalSendOrders' queue.
 */

// DATA ANALYSIS
const priceCondition = (model, setpoints) => {
  if (model['avg'] > setpoints['avg']) { 
   eventEmitter.emit('send', 
     {symbol: "btc", 
       type: 'limit', 
       price: "240.5"});
  }
}
const volumeCondition = (model, setpoints) => {
  if (model['vol'] > setpoints['vol']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
const minCondition = (model, setpoints) => {
  if (model['avg'] < setpoints['min']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
const maxCondition = (model, setpoints) => {
  if (model['avg'] > setpoints['max']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
const changeSetPoint = async (key, val) =>{
  console.log("change set point ", key, " ", val);
  atomic(() => {
    setPoints[key] = val;
  });
}
// ENABLED/DISABLED FUNCTIONS
let conditions = [ 
  { 
    "active" : true,
     "function": priceCondition
  }, 
  { 
    "active" : true,
     "function": volumeCondition
  }, 
  { 
    "active" : true,
     "function": minCondition
  }, 
  { 
    "active" : true,
     "function": maxCondition
  }, 
]

// ATOMIC MUTATION
let mutex = new Lock();
//any function that modifies the globalModel 
//should be called by passing it into atomic()
const atomic = async (func) => {
  //acquire lock
  const release = await mutex.acquire();
  // returns an array [true, <anonymous function>]
  // only the second element is required
  try {
    //first element should always be true, false = race condition
    if (release[0]) { 
      await func();
      //release lock
      release[1]();
    }
  } catch (e) {
    release[1]();
    throw e;
  }
}

// INTER PROCESS FUNCTION CALLS
ipc.config.id = 'process-1234';
ipc.config.retry = 1500;
ipc.config.silent = true;
//define message types that trigger 
//function calls in this process
ipc.serve(() => {
  ipc.server.on("msg", message => {
    console.log(message);
  })
  ipc.server.on("view", message => {

    console.log(setPoints);
  })
  ipc.server.on("setpoint", message => {
    let arr = message.split('-')
    changeSetPoint(arr[0], parseInt(arr[1]));
  })
});
ipc.server.start();

// ENTRY POINT 
const main = async () => {
  while (true) {
    await runloop();
  }
}

// GAME LOOP
const runloop = async () => {
  //pull from websockets: 
  //technical signals, filled orders, successful cancels
  readData();

  //orders that were filled should be 
  //removed from open-order queue,
  //also update position / risk measures
  await updateFilledOrders(); // --- this updates the data-model

  //calculate averages etc. 
  //update flags and values in the central
  //source of truth
  await analyseSignals(); //  ---  this updates the data-model


  //push positive value orders onto queue,
  //push open orders onto cancel queue if needed
  findBuyConditions(); // -- this is effected by front end
  
  //check open orders and cancel old or mispriced
  findCancelConditions();

  //iterate over send queue, construct
  //and send all of them, a handle to 
  //each order should be pushed onto
  //an open order queue
  sendOrders();


  //iterate over cancel queue, construct
  //and send cancels
  cancelOrders();
}

// FUNCTION DEFINITIONS 
const readData = () => {
  process.stdout.write("read data . . .");
  // unsure of best way to iterate over open sockets
}
const updateFilledOrders = async () => {
  //await sleep(2000);
  for (const n of pullFromFilled()){
    // iterate over filled orders returned from 
  }
  for (const n of pullFromOpen()){
    // binance api, filter open orders arry to remove these filled 
  }
  // orders, update global value-at-risk measures
  eventEmitter.emit('filled', {symbol: "btc", type: 'limit', price: "240.5"});
}
const analyseSignals = async () => {
  //await sleep(2000);
  //all the interesting stuff
  // updates main data-model
}
const findBuyConditions = () => {
  //iterate over individual ticker symbol data objects
  //and check each one against thresholds and 
  //conditions, pushing buy / sell / cancel orders as 
  //needed onto their respective queues
  conditions.map((x) => 
    {if (x['active']) {
      atomic(() => { x['function'](globalModel, setPoints);});
    }});
}
const findCancelConditions = () => {
  for (const n of pullFromOpen()){
    // either push back to open or push to cancel
    if (false) {
      eventEmitter.emit('open', 
        {symbol: "btc", type: 'limit', price: "240.5"});
    } else {
      eventEmitter.emit('cancel', 
        {symbol: "btc", type: 'limit', price: "240.5"});
    }
  }
}
const cancelOrders = () => {
  //construct and execute cancels
  for (const n of pullFromCancel()){
    // hit API to cancel
  }
}
const sendOrders = () => {
  //construct and execute buys/sells
  // hit API to send
  //
  // record open orders 
  eventEmitter.emit('open', {symbol: "btc", type: 'limit', price: "240.5"});
}
const sleep = (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

// START PROGRAM
main();
