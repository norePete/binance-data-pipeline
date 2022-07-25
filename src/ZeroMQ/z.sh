#!/bin/bash

node ahandleAPI.js  > error_logs/api.logs 2>&1 &
node openOrderQueue.js > error_logs/openOrderQueue.logs 2>&1 &
node parameterA.js > error_logs/A.logs 2>&1 &
node parameterB.js > error_logs/B.logs 2>&1  &
node parameterC.js > error_logs/C.logs 2>&1 &
node dynamicState.js > error_logs/dynamicState.logs 2>&1 &
