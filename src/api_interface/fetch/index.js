require('dotenv').config();
const fetch = require('node-fetch');
const crypto = require('crypto');
const apiSecret = process.env.SECRET;
const apiKey = process.env.APIKEY;

function signature(query_string) {
    return crypto
        .createHmac('sha256', apiSecret)
        .update(query_string)
        .digest('hex');
}

async function buy(_symbol='BTCSOL', _quantity='0.01', _price='0.0001') {
	const _timestamp = '1499';
	const params = new URLSearchParams();
	params.append('symbol', _symbol);
	params.append('side', 'BUY');
	params.append('type', 'LIMIT');
	params.append('quantity', _quantity);
	params.append('price', _price);
	params.append('timeInForce', 'FOK');
	params.append('newOrderRespType', 'FULL');
	params.append('recvWindow', '5000');
	params.append('timestamp', _timestamp);

	//provide signature
	const sig = signature(params.toString());
	params.append('signature', sig);

	console.log(params.toString());

	const response = await fetch('https://api1.binance.com/api/v3/order', {
		method: 'post',
		body: params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-MBX-APIKEY': apiKey
		}
	});
	const data = await response.json();
	console.log(data);
}

console.log(apiKey);
console.log(apiSecret);
buy('BTCSOL', '0.01', '0.0001');
