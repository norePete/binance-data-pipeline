//should digest http requests from front end
//
const express = require('express');
const cors = require('cors');
let zmq = require("zeromq");
let channel = "channel name";

//express setup
const app = express();
app.use(cors());
app.use(express.json());

//zeroMQ setup
const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3005");

//static state object
let state = {
  avg: 1,
  vol: 2,
  min: 3, 
  max: 4
}

/* only for testing */
app.get('/setpoint/:num', (req, res) => {
  console.log(state.test);
  state.test = req.params.num;
  console.log(state.test);
  res.sendStatus(200);
});

/* for use in production */
app.post('/update', (req, res) => {
  state.avg = req.body.avg;
  state.vol = req.body.vol;
  state.min = req.body.min;
  state.max = req.body.max;
  res.sendStatus(200);
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});

//hardcoded output for testing purposes
const main = async() => {
  while(true) {
    let calculated = state;
    console.log(state);
    push.send(
      [channel, Buffer.from(JSON.stringify(calculated).toString('base64'))])
    await new Promise((resolve) => {setTimeout(resolve, 2000)});
  }
}
main();
