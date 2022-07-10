const ipc = require('node-ipc').default;
const { Lock } = require('./lock');

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

const changeSetPoint = async (key, val) => {
  console.log("change set point ", key, " ", val);
  atomic(() => {
    setPoints[key] = val;
  });
}

const init_data_model = () => {
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
}

module.exports = { 
  init_data_model,
  atomic
}
