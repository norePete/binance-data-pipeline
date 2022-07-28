#!/bin/bash

tmux new-session -d -s one 'node cancelQueue.js';
tmux split-window -h;
tmux send 'node executeOrder.js' ENTER;
tmux a -t one;

tmux new-session -d -s two 'node cancelFilter.js';
tmux split-window -h;
tmux send 'node buyOrSellFilter.js' ENTER;
tmux a -t two;

tmux new-session -d -s three 'node openOrderQueue.js';
tmux split-window;
tmux send 'node dynamicState.js' ENTER;
tmux a -t three;

tmux new-session -d -s four 'node staticState.js';
tmux split-window;
tmux send 'node stateConstructor.js' ENTER;
tmux a -t four;

tmux new-session -d -s five 'node ParameterA.js';
tmux split-window;
tmux send 'node parameterB.js' ENTER;
tmux split-window;
tmux send 'node parameterC.js' ENTER;
tmux a -t five;

tmux new-session -d -s six 'node ParameterA.js';
tmux a -t six;
