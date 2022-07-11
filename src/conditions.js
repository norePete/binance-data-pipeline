
/*
 * The data analysis is divided into functions that
 * each independently check a condition. If the condition
 * is met, then a buy or sell order is pushed onto the 
 * 'globalSendOrders' queue.
 */

// DATA ANALYSIS
const priceCondition = (model, setpoints, eventEmitter) => {
  let n1 = 0, n2 = 1, nextTerm;
  for (let i = 1; i <= 1000; i++) {
    nextTerm = n1 + n2;
    n1 = n2;
    n2 = nextTerm;
  }
  console.log(n1);
  if (true) { 
   eventEmitter.emit('send', 
     { id: '23',
       sell: "btc", 
       buy: "eth",
       amount: 3, 
       price: 26,
       side: "bid"});
  }
}
const volumeCondition = (model, setpoints, eventEmitter) => {
  if (model['vol'] > setpoints['vol']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
const minCondition = (model, setpoints, eventEmitter) => {
  if (model['avg'] < setpoints['min']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
const maxCondition = (model, setpoints, eventEmitter) => {
  if (model['avg'] > setpoints['max']) {
    eventEmitter.emit('send', 
      {symbol: "btc", 
        type: 'limit', 
        price: "240.5"});
  }
}
// ENABLED/DISABLED FUNCTIONS
let conditions = [ 
  { 
    "active" : true, 
     "function": priceCondition
  }, 
  { 
    "active" : false,
     "function": volumeCondition
  }, 
  { 
    "active" : false,
     "function": minCondition
  }, 
  { 
    "active" : false,
     "function": maxCondition
  }, 
]

module.exports = { conditions }
