var socket;

$.getScript('http://cdn.peerjs.com/0.3.9/peer.js')
    .success(function () {
        socket = new Peer('jcw', { key: 'lwjd5qra8257b9' });

        socket.on('connection', function(conn) {
            conn.on('open', function() {
                console.log('Incoming connection:', conn.peer);

                // incoming data events
                conn.on('data', function(data) {
                    console.log('[' + conn.peer + ']', data);
                });

                // send an ack
                conn.send('Hey, ' + conn.peer);
            })
        });

        debugger;

        // TODO: connect to everyone else in Firebase!
        var connection = socket.connect('mcbex');
        connection.on('open', function () {
            console.log('Opened connection:', connection.peer);

            connection.on('data', function (data) {
                console.log('[' + connection.peer + ']', data);
            });

            connection.on('close', function () {
                console.log('Connection closed:', connection.peer);
            });

            // Send messages
            connection.send('Whattup!!');
        });
    });
