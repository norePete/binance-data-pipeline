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

module.exports = { 
  eventEmitter, 
  pullFromSend, 
  pullFromCancel, 
  pullFromOpen,
  pullFromFilled
}
