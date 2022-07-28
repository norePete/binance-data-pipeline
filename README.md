# binance-data-pipeline

to start all independent processes we are using tmux windows.
the bash script 'session.sh' takes one argument, which should be
the absolute path to the src/ directory, this can be achieved by
executing session.sh as ". session.sh $(pwd)"

after this is executed the terminal should be horizontally split and
displaying the process 'ahandleAPI.js' above a pane with only the normal 
bash prompt

to toggle through the other windows (other processes) type 'PREFIX s'
where PREFIX is ctrl+b by default, unless your tmux has been configured.

this should display the current session, press 'l' (lowercase L)
to drop down the current windows inside this process, and use 'j' & 'k'
to move up and down this list of windows. 

to select a window hit the enter key

to kill the session from the selection panel type ': kill-session' 
to kill the session from inside a window type PREFIX ': kill-session'

There are more heaps of tmux commands, add any you find useful to this README



