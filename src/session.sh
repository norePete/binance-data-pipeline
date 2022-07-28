# the name of your primary tmux session
PWD=$1
SESSION=$USER

# if the session is already running, just attach to it.
tmux has-session -t $SESSION
if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "Session $SESSION already exists. Attaching..."
    sleep 1
    tmux -2 attach -t $SESSION
    exit 0;
fi

# create a new session, named $SESSION, and detach from it
set -- $(stty size) # $1 = rows $2 = columns
tmux -2 new-session -d -s $SESSION -x "$2" -y "$(($1 -1))"

# Now populate the session with the windows you use every day

# 0 - VIM
tmux new-window  -t $SESSION:0 -k -n Api
tmux send-keys   -t $SESSION:0 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:0 "node  ahandleAPI.js" C-m 


tmux split-window -v -l 5 -t 0 

tmux new-window -t $SESSION:1 -k -n parameterA
tmux send-keys   -t $SESSION:1 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:1 "node parameterA.js" C-m 

tmux new-window -t $SESSION:2 -k -n parameterB
tmux send-keys   -t $SESSION:2 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:2 "node parameterB.js" C-m 

tmux new-window -t $SESSION:3 -k -n parameterC
tmux send-keys   -t $SESSION:3 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:3 "node parameterC.js" C-m 

tmux new-window -t $SESSION:4 -k -n stateConstructor
tmux send-keys   -t $SESSION:4 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:4 "node stateConstructor.js" C-m 

tmux new-window -t $SESSION:5 -k -n dynamicState
tmux send-keys   -t $SESSION:5 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:5 "node dynamicState.js" C-m 

tmux new-window -t $SESSION:6 -k -n openOrderQueue
tmux send-keys   -t $SESSION:6 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:6 "node openOrderQueue.js" C-m 

tmux new-window -t $SESSION:7 -k -n staticState
tmux send-keys   -t $SESSION:7 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:7 "node staticState.js" C-m 

tmux new-window -t $SESSION:8 -k -n buyOrSellFilter
tmux send-keys   -t $SESSION:8 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:8 "node buyOrSellFilter.js" C-m 

tmux new-window -t $SESSION:9 -k -n cancelFilter
tmux send-keys   -t $SESSION:9 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:9 "node cancelFilter.js" C-m 

tmux new-window -t $SESSION:10 -k -n cancelQueue
tmux send-keys   -t $SESSION:10 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:10 "node cancelQueue.js" C-m 

tmux new-window -t $SESSION:11 -k -n executeOrder
tmux send-keys   -t $SESSION:11 "cd $PWD" C-m 
tmux send-keys   -t $SESSION:11 "node executeOrder.js" C-m 

tmux select-window -t $SESSION:0
tmux -2 attach -t $SESSION

