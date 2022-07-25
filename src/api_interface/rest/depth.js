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
    "ETHUSDT",
    "ETHBTC",
    "BNBUSDT", 
    "ARUSDT",
    "FILUSDT",
    "ADAUSDT",
  ]

  setInterval(() => {
      binance.depth(`${pairs[0]}`, (error, depth, symbol) => {
        if (!depth || !symbol) return
        let arr = Object.entries(depth.bids);
        let top20 = arr.slice(0,30);
        let min = arr[arr.length-1][0];
        let max = arr[0][0];
        let spread = max - min;
        let average = arr.map(x => x[0]).reduce((prev, curr) => +(prev) + +(curr), 0) / arr.length;
        let liquidity = arr.map(x => x[1]).reduce((prev, curr) => prev + curr, 0);
        let demand = liquidity / spread;
        /*
          .reduce((previous, current) => {
          previous + current;
        }, 0);
        */
        console.clear();
        console.log(`depth of ${pairs[0]}: `);
        console.log(`
          min: ${min} 
          max: ${max} 
          liquidity: ${liquidity} 
          average: ${average}
          spread: ${spread}
          demand (liquidity / spread): ${demand}`)
        //process.stdout.write(`\x1b[44m\x1b[7m\x1b[32m\r\r\r\r\r\r\r\r${depth.bids}`);
      });
  }, 2000);

}

main();
