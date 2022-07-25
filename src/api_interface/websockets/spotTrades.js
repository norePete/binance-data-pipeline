require('dotenv').config()
const { WebsocketClient } = require('binance');
const { DefaultLogger } = require('binance');

const secret = process.env.SECRET;
const apikey = process.env.APIKEY;
const market = 'ETHUSDT';
const interval = 5;

const wsClient = new WebsocketClient({
  api_key: apikey,
  api_secret: secret, 
  beautify: true,
}, DefaultLogger);

const main = () => {
  console.log(apikey);
  console.log(secret);

  wsClient.on('message', (data) => {
  });

  wsClient.on('open', (data) => {
  });

  wsClient.on('formattedMessage', (data) => {
    process.stdout.write('\033[s');
    console.log('formattedMessage: ', data);
    process.stdout.write('\033[u');
  });

  wsClient.on('reply', (data) => {
  });

  wsClient.on('reconnecting', (data) => {
  });

  wsClient.on('reconnected', (data) => {
  });

  // Call methods to subcribe to as many websockets as you want.
  // Each method spawns a new connection, unless a websocket already exists for that particular request topic.

  // wsClient.subscribeSpotAggregateTrades(market);
   wsClient.subscribeSpotTrades(market);
  // wsClient.subscribeSpotKline(market, interval);
  // wsClient.subscribeSpotSymbolMini24hrTicker(market);
  // wsClient.subscribeSpotAllMini24hrTickers();
  // wsClient.subscribeSpotSymbol24hrTicker(market);
  // wsClient.subscribeSpotAll24hrTickers();

  // wsClient.subscribeSpotSymbolBookTicker(market);

  // wsClient.subscribeSpotAllBookTickers();
  // wsClient.subscribeSpotPartialBookDepth(market, 5);
  // wsClient.subscribeSpotDiffBookDepth(market);
  //wsClient.subscribeSpotUserDataStream();
  //wsClient.subscribeUsdFuturesUserDataStream();
}

main();
