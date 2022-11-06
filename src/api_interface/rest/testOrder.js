require('dotenv').config()
const crypto = require('crypto');
const os = require('os');
const Binance = require('node-binance-api');
const fs = require('fs');

const secret = process.env.SECRET;
const apikey = process.env.APIKEY;

const client = new Binance({
  APIKEY: apikey,
  APISECRET: secret,
  getTime: true,
  family: 0,
//  useServerTime: true,
//  recvWindow: 60000,
//  log: log => {
//    console.log(log);
//  }
});

function signature(query_string) {
    return crypto
        .createHmac('sha256', secret)
        .update(query_string)
        .digest('hex');
}

const main = async () => {

  const another_query = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
  console.log("hashing the string: ");
  console.log(another_query);
  console.log("and return:");
  console.log(signature(another_query));
  
  const time = await client.time();
  console.log(Object.entries(time));
  console.log(time.serverTime);
  
  const test = await client.withdrawHistory({
  });
  console.log(Object.entries(test));

//  console.log(
//    await client.order({
//	    symbol: 'SOL',
//	    side: 'SELL',
//	    quantity: '0.001',
//	    price: '199',
//    }),
//  )

}

main();
