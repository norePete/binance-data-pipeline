#!/bin/bash

node testreceiver.js &
node testproducer2.js &
node testproducer.js &
node test.js &
