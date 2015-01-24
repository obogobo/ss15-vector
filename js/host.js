var connections = [];

$.getScript('http://cdn.peerjs.com/0.3.9/peer.js')
    .success(function () {
        var peer = new Peer('host', { key: 'lwjd5qra8257b9' });

        peer.on('connection', function (conn) {
            conn.on('open', function () {
                console.log('Incoming connection:', conn.peer);
                / debugger;

                // onData handler
                conn.on('data', function (data) {
                    console.log('Received:', data);
                });

                // Send announce
                conn.send('Welcome ' + conn.peer);
            });
        });

        connections.push(peer);
    });