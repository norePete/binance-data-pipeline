#!/bin/bash

tmux new-session -d -s one 'node ahandleAPI.js';
tmux split-window -h;
tmux send 'node parameterA.js' ENTER;
tmux split-window -h;
tmux send 'node parameterB.js' ENTER;
tmux split-window -h;
tmux send 'node parameterC.js' ENTER;
tmux split-window -h;
tmux send 'node dynamicState.js' ENTER;
tmux split-window -h;
tmux send 'node stateConstructor.js' ENTER;
tmux split-window -h;
tmux send 'node openOrderQueue.js' ENTER;
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
tmux a -t one;
