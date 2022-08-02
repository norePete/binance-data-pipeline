//should digest http requests from front end
//
let zmq = require("zeromq");
let channel = "channel name";

const push = zmq.socket("pub");
push.bindSync("tcp://127.0.0.1:3005");

//hardcoded output for testing purposes
const main = async() => {
  while(true) {
    let rand = Math.floor((Math.random() * 999) + 1000).toString()
    let calculated = {
      maxSomething: rand
    }
    push.send(
      [channel, Buffer.from(JSON.stringify(calculated).toString('base64'))])
    await new Promise((resolve) => {setTimeout(resolve, 2000)});
  }
}
main();
