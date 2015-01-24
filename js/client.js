var conn;

$.getScript('http://cdn.peerjs.com/0.3.9/peer.js')
.success(function () {
    var peer = new Peer('client', { key: 'lwjd5qra8257b9' });

    peer.on('disconnected', function () {
        console.log('Connection lost, reconnecting...');
        peer.reconnect();
    });

    conn = peer.connect('host');

    conn.on('open', function () {
        // debugger

        // Receive messages
        conn.on('data', function (data) {
            console.log('Received: ', data);
        });

        // Send messages
        conn.send('Whattup!!');
    });

    conn.on('close', function () {
        console.log('Connection closed');
    });
});