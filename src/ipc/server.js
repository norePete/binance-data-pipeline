const ipc = require('node-ipc').default;
const prompt = require('prompt');

ipc.config.id   = 'world';
ipc.config.retry= 1500;

ipc.serve(function(){ 

  ipc.server.on('message', function(data,socket){
    ipc.log('got a message : '.debug, data);
    prompt.start();
    prompt.get(['input'], function(err, result) {
      ipc.server.emit(socket, 'message', result.input);
    });
  });

  ipc.server.on('socket.disconnected',function(socket, destroyedSocketID) {
    ipc.log('client ' + destroyedSocketID + ' has disconnected!');
  });
});

ipc.server.start();
