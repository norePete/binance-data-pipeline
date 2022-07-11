const { conditions } = require('./conditions');
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
  await readData();

  await updateValueAtRisk();

  //orders that were filled should be 
  //removed from open-order queue,
  //also update position / risk measures
  await updateFilledOrders(); // --- this updates the data-model

  //push positive value orders onto queue,
  //push open orders onto cancel queue if needed
  await findBuyConditions(); // -- this is effected by front end
  
  //check open orders and cancel old or mispriced
  await findCancelConditions();

  //iterate over send queue, construct
  //and send all of them, a handle to 
  //each order should be pushed onto
  //an open order queue
  await sendOrders();

  //iterate over cancel queue, construct
  //and send cancels
  await cancelOrders();
}

// FUNCTION DEFINITIONS 
const readData = async () => {
  // API read

 // if( data["avg"] > 9999 ) { data["avg"] = 10 }
 // if( data["avg1"] > 9999 ) { data["avg1"] = 10 }
 // if( data["avg5"] > 9999 ) { data["avg5"] = 10 }
 // if( data["avg10"] > 9999 ) { data["avg10"] = 10 }
 // if( data["avg20"] > 9999 ) { data["avg20"] = 10 }
 // if( data["vol"] > 9999 ) { data["vol"] = 10 }
 // if( data["delta"] > 9999 ) { data["delta"] = 10 }
 // if( data["theta"] > 9999 ) { data["theta"] = 10 }

 // let updates = []
 // updates.push(["avg",     data["avg"]    + 1 ]);
 // updates.push(["avg1",    data["avg1"]  + 1 ]);
 // updates.push(["avg5",    data["avg5"]       + 1 ]);
 // updates.push(["avg10",   data["avg10"]      + 1 ]);
 // updates.push(["avg20",   data["avg20"]      + 1 ]);
 // updates.push(["vol",     data["vol"]        + 1 ]);
 // updates.push(["delta",   data["delta"]      + 1 ]);
 // updates.push(["theta",   data["theta"]      + 1 ]);

  /*
   * call into the proc-data-model process to get current prices 
   *
   */

// -- +1 to values

  /*
   *
   * call into the proc-data-model process to update the
   * current price values
   *
   */


}

const updateValueAtRisk = async () => {
  //each order filled represents an increase in
  //one asset and a decrease in another asset
  let positionChange1 = {symbol: "", amount: 0}
  let positionChange2 = {symbol: "", amount: 0}
  let temp;

  for (const n of pullFromFilled()){
    //calculate new value at risk from filled orders 
    //console.log("pulled from filled", n);

    temp = n.amount * n.price
    positionChange1.amount = (n.side === "offer") ? temp : (temp * -1)
    positionChange1.symbol = n.buy

    positionChange2.amount = 
      (n.side === "offer") ? (n.amount * -1) : n.amount
    positionChange2.symbol = n.sell


    eventEmitter.emit('value-at-risk', positionChange1);
    eventEmitter.emit('value-at-risk', positionChange2);
  }
}


const updateFilledOrders = async () => {
  /* 
   * data for testing, real array should be filled 
   * via API call
   */
  let latestFilledOrders = [
    {id: '23',
           sell: "btc", 
           buy: "eth",
           amount: 3, 
           price: 26,
           side: "bid"}
  ] // pull from API
  for (const n of pullFromOpen()){
    /*
     * read latest fill notifications from API
     * if an order is filled: emit filled 
     * if an order is not filled re-emit open with same order
     *
     */
      if (latestFilledOrders.filter(x => {return x.id === n.id})) {
         let rand = Math.floor(Math.random() * 100);
         let eventType = (rand > 50) ? 'filled' : 'cancel'
         eventEmitter.emit(eventType, {//TODO should be 'filled' 
           id: '23',
           sell: "btc", 
           buy: "eth",
           amount: 3, 
           price: 26,
           side: "bid"
         });
      } else {
         eventEmitter.emit('open', {
           id: '23',
           sell: "btc", 
           buy: "eth",
           amount: 3, 
           price: 26,
           side: "bid"
         });
      }
  }
  // orders, update global value-at-risk measures
  return;
}
const findBuyConditions = async () => {
  /*
   * globalModel and setPoints
   * should be dynamically generated from 
   * the single source of truth
   *
   * these static copies are for testing purposes
   */
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
  /*
    * iterate over individual ticker symbol data objects
    * and check each one against thresholds and 
    * conditions, pushing buy / sell / cancel orders as 
    * needed onto their respective queues
    */
  conditions.map(
    (x) => {
      if (x['active']) {
        x['function'](globalModel, setPoints, eventEmitter);
      }
    }
  );
}
const findCancelConditions = async () => {
  for (const n of pullFromOpen()){
    // either push back to open or push to cancel
    if (true) {
      eventEmitter.emit('open', { 
        id: '23',
        sell: "btc", 
        buy: "eth",
        amount: 3, 
        price: 26,
        side: "bid"});
    } else {
      eventEmitter.emit('cancel', 
        {symbol: "btc", type: 'limit', price: "240.5"});
    }
  }
}
const cancelOrders = async () => {
  //construct and execute cancels
  for (const n of pullFromCancel()){
    // hit API to cancel
    //console.log("order cancelled : ", n)
  }
}
const sendOrders = async () => {
  try {
    for (const n of pullFromSend()){
      /*
       * API call goes here
       */
      eventEmitter.emit('open', {
        id: '23',
        sell: "btc", 
        buy: "eth",
        amount: 3, 
        price: 26,
        side: "bid"});
    }
  } catch {
    console.log("error reading from send queue")
  }
}
  //
  // record open orders 
const sleep = (ms) => {
  return new Promise(r => setTimeout(r, ms));
}

// START PROGRAM
main();
