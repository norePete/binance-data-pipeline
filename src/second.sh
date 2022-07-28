#!/bin/bash

tmux new-session -d -s two 'node openOrderQueue.js';
tmux split-window -h;
tmux send 'node staticState.js' ENTER;
tmux split-window -h;
tmux send 'node buyOrSellFilter.js' ENTER;
tmux split-window -h;
tmux send 'node cancelFilter.js' ENTER;
tmux split-window -h;
tmux send 'node cancelQueue.js' ENTER;
tmux split-window -h;
tmux send 'node executeOrder.js' ENTER;
tmux a -t two;
