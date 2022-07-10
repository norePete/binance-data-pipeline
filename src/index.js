const { conditions } = require('./conditions');
const { init_data_model, atomic} = require('./dataModel');
const { 
  eventEmitter, 
  pullFromSend,
  pullFromCancel,
  pullFromOpen,
  pullFromFilled
} = require('./orderQueues');


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
