require('dotenv').config()
const os = require('os');
const Binance = require('node-binance-api');
const fs = require('fs');

const secret = process.env.SECRET;
const apikey = process.env.APIKEY;

const binance = new Binance().options({
  APIKEY: apikey,
  APISECRET: secret
});

const main = async () => {
  let pairs = [
    "BNBUSDT", 
    "ARUSDT",
    "FILUSDT",
    "ADAUSDT",
  ]

  console.log(`askQty of ${pairs[2]}: `);
  setInterval(() => {
      binance.bookTickers((error, ticker) => {
        if (!ticker) return
        let a = ticker[tickerIndex[`${pairs[2]}`]].askQty;
        binance.bookTickers((error, ticker) => {
          if (!ticker) return
          let b = ticker[tickerIndex[`${pairs[2]}`]].askQty;
          if(a > b){
          process.stdout.write(`\x1b[44m\x1b[7m\x1b[32m\r\r\r\r\r\r\r\r\r\r\r\r\r\r${a}`);
          } else {
          process.stdout.write(`\x1b[47m\x1b[7m\x1b[31m\r\r\r\r\r\r\r\r\r\r\r\r\r\r${b}`);
          }
        });
      });
  }, 1000);

}

main();
