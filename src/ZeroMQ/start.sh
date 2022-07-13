#!/bin/bash

node api.js  > error_logs/api.logs 2>&1 &
node openOrderQueue.js > error_logs/openOrderQueue.logs 2>&1 &
node parameterA.js > error_logs/A.logs 2>&1 &
node parameterB.js > error_logs/B.logs 2>&1  &
node parameterC.js > error_logs/C.logs 2>&1 &
node stateConstructor.js > error_logs/stateConstructor.logs 2>&1 &
node dynamicState.js > error_logs/dynamicState.logs 2>&1 &
node cancelFilter.js > error_logs/cancelFilter.logs 2>&1 &
node buyOrSellFilter.js > error_logs/buyOrSellFilter.logs 2>&1 &
node cancelQueue.js > error_logs/cancelQueue.logs 2>&1 &
node executeOrder.js > error_logs/executeOrder.logs 2>&1 &
