var Router = require('./Router');

var router = new Router();
router.history.start();

/*

var Model = window.Model = require('ampersand-model');

var peer = new Peer('mullery1', { key: 'lwjd5qra8257b9' });

peer.on('connection', function(conn) {
  console.log(arguments);

  conn.on('open', function(id) {
    console.log('Opened, now id: ', id);
    // Receive messages
    conn.on('data', function(data) {
      console.log('Received', data);
      debugger;
    });
  });

  conn.send('Sup motherfuckers!');

});*/
