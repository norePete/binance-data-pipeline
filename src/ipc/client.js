const ipc = require('node-ipc').default;
const prompt = require('prompt');

ipc.config.id   = 'hello';
ipc.config.retry= 1500;

ipc.connectTo('world',function(){

  ipc.of.world.on('connect', function(){
    ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
    ipc.of.world.emit('message', 'hello')
  });

  ipc.of.world.on('disconnect', function(){
    ipc.log('disconnected from world'.notice);
  });

  ipc.of.world.on('message', function(data){
    ipc.log('got a message from world : '.debug, data);
    prompt.start();
    prompt.get(['input'], function(err, result) {
      ipc.of.world.emit('message', result.input)
    });
  });
});
