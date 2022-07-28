#!/bin/bash

tmux new-session -d -s mywindow 'node ahandleAPI.js';
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
tmux a -t mywindow;
