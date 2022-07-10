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

module.exports = { conditions }
