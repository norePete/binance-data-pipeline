let zmq = require("zeromq");
let channel = "channel name"

const pullA = zmq.socket("sub");
pullA.connect("tcp://127.0.0.1:3003");
const pullB = zmq.socket("sub");
pullB.connect("tcp://127.0.0.1:3023");
const pullC = zmq.socket("sub");
pullC.connect("tcp://127.0.0.1:3033");

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3004");

const main = async () => {
  pullA.subscribe(channel);
  pullB.subscribe(channel);
  pullC.subscribe(channel);

  handler(pullA, push)
  handler(pullB, push)
  handler(pullC, push)
}
/*
 *
 *TODO
 *
 * make the handlers sync with eachother before pushing
 *
 */
 

const handler = (pull, push) => {
  pull.on("message", async function(topic, message) {
    let received = Buffer.from(message, 'base64').toString('ascii');
    console.log("received a message related to:", channel, " & msg = ", message, "or : ",received);

/*
 * any computation needs 
 * to take place here
 *
 */
    let calculated = received;
/*
 *
 */
    while (true) {
      push.send(
        [channel, JSON.stringify({data: calculated}).toString('base64')])
      await new Promise((resolve) => {setTimeout(resolve, 300)});
    }
  });
}

main();
