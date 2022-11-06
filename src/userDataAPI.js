const zmq = require("zeromq");
const path = require('path');
//require('dotenv').config({path: path.relative(path.join(__dirname, '.env'))});
require('dotenv').config({path: path.join(__dirname, '.env')});
const channel = "channel name";
const { WebsocketClient } = require('binance');
const { DefaultLogger } = require('binance');
const Secret = process.env.SECRET;
const ApiKey = process.env.APIKEY;
const market = 'SOLUSDT';
const interval = 5;
const outbound = zmq.socket("pub");

outbound.bindSync("tcp://127.0.0.1:3040");

const wsClient = new WebsocketClient({
  api_key: ApiKey,
  api_secret: Secret, 
  beautify: true,
}, DefaultLogger);

const main = async (apikey, secret) => {
  console.log("apikey", apikey);
  console.log("secret", secret);

  wsClient.on('message', (data) => {
  });

  wsClient.on('open', (data) => {
    console.log('connection opened:', data.wsKey, data.ws.target.url);
  });

  /*
   * the rest is boiler plate to set up a websocket,
   * this is where the websocket events are emitted to 
   * the next step in the pipeline
   */
  wsClient.on('formattedMessage', (data) => {
    outbound.send(
      [channel, Buffer.from(JSON.stringify([]).toString('base64'))])
  });
  // simulating web socket events which will happen in the ^above 'formattedMessage' processor
    while (true) {
      let output = Buffer.from(JSON.stringify({balance: {usdt: 1, usdc: 3}}).toString('base64'));
      console.log("output ", output);
      outbound.send(
        [channel, output])
      await new Promise((resolve) => {setTimeout(resolve, 200)});
    }
  /*
   */

  wsClient.on('reply', (data) => {
    console.log('log reply: ', JSON.stringify(data, null, 2));
  });

  wsClient.on('reconnecting', (data) => {
    console.log('ws automatically reconnecting...', data?.wsKey);
  });

  wsClient.on('reconnected', (data) => {
    console.log('ws has reconnected ', data?.wsKey);
  });

  // Call methods to subcribe to as many websockets as you want.
  // Each method spawns a new connection, unless a websocket already exists for that particular request topic.

  // wsClient.subscribeSpotAggregateTrades(market);
  // wsClient.subscribeSpotTrades(market);
  // wsClient.subscribeSpotKline(market, interval);
  // wsClient.subscribeSpotSymbolMini24hrTicker(market);
  // wsClient.subscribeSpotAllMini24hrTickers();
  // wsClient.subscribeSpotSymbol24hrTicker(market);
  // wsClient.subscribeSpotAll24hrTickers();
  // wsClient.subscribeSpotSymbolBookTicker(market);
  // wsClient.subscribeSpotAllBookTickers();
  // wsClient.subscribeSpotPartialBookDepth(market, 5);
  // wsClient.subscribeSpotDiffBookDepth(market);
  wsClient.subscribeSpotUserDataStream();
  //wsClient.subscribeUsdFuturesUserDataStream();
}

main(
process.env.SECRET,
process.env.APIKEY)
