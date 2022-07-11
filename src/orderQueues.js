const EventEmitter = require('events');

// GLOBAL QUEUES
let globalSendOrders = []
let globalCancelOrders = []
let globalOpenOrders = []
let globalFilledOrders = []

// QUEUE CONTROLLERS (PUSH)
const eventEmitter = new EventEmitter();
eventEmitter.on('send', (obj) => {
  //TODO remove size limit
  if (globalSendOrders.length > 10) { globalSendOrders = [] }
  globalSendOrders.push(obj)

  /*
   * simple visualisation
   */
  let array = Array.apply(null, Array(globalSendOrders.length))
    .map(String.prototype.valueOf,"s")
  console.log('\x1b[33m%s\x1b[7m', array);
});
eventEmitter.on('cancel', (obj) => {
  //TODO remove size limit
  if (globalCancelOrders.length > 10) { globalCancelOrders = [] }
  globalCancelOrders.push(obj)

  /*
   * simple visualisation
   */
  let array = Array.apply(null, Array(globalCancelOrders.length))
    .map(String.prototype.valueOf,"c")
  console.log('\x1b[32m%s\x1b[7m', array);
});
eventEmitter.on('open', (obj) => {
  //TODO remove size limit
  if (globalOpenOrders.length > 10) { globalOpenOrders = [] }
  globalOpenOrders.push(obj)

  /*
   * simple visualisation
   */
  let array = Array.apply(null, Array(globalOpenOrders.length))
    .map(String.prototype.valueOf,"O")
  console.log('\x1b[35m%s\x1b[7m', array);
});
eventEmitter.on('filled', (obj) => {
  //TODO remove size limit
  if (globalFilledOrders.length > 10) { globalFilledOrders = [] }
  globalFilledOrders.push(obj) 

  /*
   * simple visualisation
   */
  let array = Array.apply(null, Array(globalFilledOrders.length))
    .map(String.prototype.valueOf,"F")
  console.log('\x1b[31m%s\x1b[7m', array);
});
eventEmitter.on('value-at-risk', (obj) => {
//  console.log('position change ', obj.symbol, obj.amount)
  //console.log('push order onto filled queue', obj);
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
function* refreshSnapshot() {
//eventEmitter.on('open', (obj) => {
//  globalOpenOrders.push(obj)
//  //console.log('push order onto open queue', obj);
//});
//  yield* 
}

module.exports = { 
  eventEmitter, 
  pullFromSend, 
  pullFromCancel, 
  pullFromOpen,
  pullFromFilled
}
