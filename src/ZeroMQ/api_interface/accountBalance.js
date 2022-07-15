require('dotenv').config()
const os = require('os');
const Binance = require('node-binance-api');
const fs = require('fs');
const tickerIndex = require('./tickerIndex');

const secret = process.env.SECRET;
const apikey = process.env.APIKEY;

const binance = new Binance().options({
  APIKEY: apikey,
  APISECRET: secret,
  useServerTime: true,
  recvWindow: 60000,
  log: log => {
    console.log(log);
  }
});

const main = async () => {
  let pairs = [
    "BNBUSDT", 
    "ARUSDT",
    "FILUSDT",
    "ADAUSDT",
  ]

  setInterval(() => {
      binance.balance((error, balance) => {
        if (!balance) return
        console.clear();
        let arr = Object.entries(balance);
        let filter = arr.map(x => x[1]);
        let available = filter.filter(x => {
          if(x.available != '0.00000000'){return x}
        });
        let combined = filter.map((x, i) => {
          return [x, available[i]];
        });
        console.info(combined);
      });
  }, 1000);

}

main();
