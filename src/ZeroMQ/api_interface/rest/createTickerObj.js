require('dotenv').config()
const os = require('os');
const Binance = require('node-binance-api');
const fs = require('fs');
const tickerIndex = require('./tickerIndex');

const secret = process.env.SECRET;
const apikey = process.env.APIKEY;

const binance = new Binance().options({
  APIKEY: apikey,
  APISECRET: secret
});

const main = async () => {
  console.log("api key: ", apikey);
  console.log("secret: ", secret);


  binance.bookTickers(async(error, ticker) => {
    let ar = await ticker.reduce((arr, cur, i) => {
        arr.push([cur.symbol, i]);
        return arr;
      },[]);
    //console.log(JSON.stringify(ar))
    fs.writeFile('./array', JSON.stringify(ar), err => { if (err) {console.log(err)}});
    });

  binance.bookTickers(async(error, ticker) => {
    let map = new Map();
    for(let i = 0; i < ticker.length; i++){
      map.set(ticker[i].symbol, i);
    }
    let obj = Array.from(map).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
    console.log(obj)
    fs.writeFile('./tickerIndex.js', JSON.stringify(obj), err => { if (err) {console.log(err)}});
  });
}

main();
