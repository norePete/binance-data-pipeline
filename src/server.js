const express = require('express');
const ipc = require('node-ipc').default;
const cors = require('cors');

//express setup
const app = express();
app.use(cors());
app.use(express.json());
//inter-process call setup
const processId = 'proc-1500'
ipc.config.id = `${processId}`;
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.connectTo('process-1234', () => {
  ipc.of['process-1234'].on('connect', () => {
    ipc.of['process-1234'].emit('msg', `Connected to ${processId}`);
  });
});


/*
 * endpoints used for testing 
 */
app.get('/msg/:text', (req, res) => {
  ipc.of['process-1234'].emit('msg', `${req.params.text}`);
  res.sendStatus(200);
});
app.get('/view', (req, res) => {
  ipc.of['process-1234'].emit('view', "");
  res.sendStatus(200);
});
      // /set-point/avg-233
app.get('/setpoint/:num', (req, res) => {
  ipc.of['process-1234'].emit('setpoint', `${req.params.num}`);
  res.sendStatus(200);
});
/*
 * 
 */

app.post('/update', (req, res) => {
  ipc.of['process-1234'].emit('setpoint', `avg-${req.body.avg}`);
  ipc.of['process-1234'].emit('setpoint', `vol-${req.body.vol}`);
  ipc.of['process-1234'].emit('setpoint', `min-${req.body.min}`);
  ipc.of['process-1234'].emit('setpoint', `max-${req.body.max}`);
  res.sendStatus(200);
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});


//ipc.config.id = 'process-1233';
//ipc.config.retry = 1500;
//ipc.config.silent = true;

