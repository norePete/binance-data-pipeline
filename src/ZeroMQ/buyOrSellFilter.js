let zmq = require("zeromq");
let channel = "channel name"

const thresholdSocket = zmq.socket("sub");
thresholdSocket.connect("tcp://127.0.0.1:3005");
const stateSocket = zmq.socket("sub");
stateSocket.connect("tcp://127.0.0.1:3001");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3006");

const main = async () => {
  thresholdSocket.subscribe(channel);
  stateSocket.subscribe(channel);

  /*
   *
   *TODO
   *
   * syncronized "pull" and "stateSocket" so that they can share data 
   * and hand off to one push.send function
   *
   *
   */
  thresholdSocket.on("message",async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log("on", channel, " & msg = ", message, "or : ",received);
    let calculated = received ;
    while (true) {
      push.send(
        [channel, JSON.stringify({data: calculated}).toString('base64')])
      await new Promise((resolve) => {setTimeout(resolve, 300)});
    }
  });
  stateSocket.on("message",async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log("on", channel, " & msg = ", message, "or : ",received);
    let calculated = received ;
    while (true) {
      push.send(
        [channel, JSON.stringify({data: calculated}).toString('base64')])
      await new Promise((resolve) => {setTimeout(resolve, 300)});
    }
  });
}

main();
