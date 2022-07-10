const { factory } = require('./client');
const { Lock } = require('./lock');
const ipc = require('node-ipc').default;


// GLOBAL DATA
let testdata = [1,2,3]

let globalSendOrders = []
let globalCancelOrders = []
let globalOpenOrders = []
let globalFilledOrders = []

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
    console.log("the current price triggered a buy order")
  }
}
const volumeCondition = (model, setpoints) => {
  if (model['vol'] > setpoints['vol']) {
    console.log("the current volume triggered a buy order")
  }
}
const minCondition = (model, setpoints) => {
  if (model['avg'] < setpoints['min']) {
    console.log("min price reached, sell")
  }
}
const maxCondition = (model, setpoints) => {
  if (model['avg'] > setpoints['max']) {
    console.log("max price reached, sell")
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
  await sleep(2000);
  // iterate over filled orders returned from 
  // binance api, filter open orders arry to remove these filled 
  // orders, update global value-at-risk measures
}
const analyseSignals = async () => {
  await sleep(2000);
  //all the interesting stuff
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
const cancelOrders = () => {
  //construct and execute cancels
}
const sendOrders = () => {
  //construct and execute buys/sells
  process.stdout.write("send Orders");
  console.log();
}
const sleep = (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

// START PROGRAM
main();
