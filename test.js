function* pull() {
  yield* Myqueue;
}

while (true) {
  for (const n of pull()){
    console.log("n = ", n)
  }
  Myqueue.push(['elephant', 33]);
  Myqueue.push(['elephant', 10]);
  Myqueue.push(['elephant', 45]);
  Myqueue.push(['elephant', 20]);
}

//function* listener() {
//  console.log("listening..");
//  while(true) {
//    let msg = yield;
//    //
//    console.log('heard', msg)
//  }
//}
//
//let l = listener();
//l.next({price: "354", symbol: "btc"})
//l.next({price: "4", symbol: "eth"})
//l.next({price: "3", symbol: "b"})
//l.next({price: "34", symbol: "sol"})
//l.next({price: "53", symbol: "qq"})

