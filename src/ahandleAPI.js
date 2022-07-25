const zmq = require("zeromq");
require('dotenv').config()
const channel = "channel name";
const { WebsocketClient } = require('binance');
const { DefaultLogger } = require('binance');
const secret = process.env.SECRET;
const apikey = process.env.APIKEY;
const market = 'SOLUSDT';
const interval = 5;
const outbound = zmq.socket("pub");

outbound.bindSync("tcp://127.0.0.1:3000");

const wsClient = new WebsocketClient({
  api_key: apikey,
  api_secret: secret, 
  beautify: true,
}, DefaultLogger);

const main = (apikey, secret) => {
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
    console.log(data);
    outbound.send(
      [channel, JSON.stringify(data).toString('base64')])
  });
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
   wsClient.subscribeSpotSymbolBookTicker(market);
  // wsClient.subscribeSpotAllBookTickers();
  // wsClient.subscribeSpotPartialBookDepth(market, 5);
  // wsClient.subscribeSpotDiffBookDepth(market);
  //wsClient.subscribeSpotUserDataStream();
  //wsClient.subscribeUsdFuturesUserDataStream();
}

main(
process.env.SECRET,
process.env.APIKEY)
