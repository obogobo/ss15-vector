var ampersandModel = require('ampersand-model'),
    uuid = require('node-uuid'),
    _ = require('lodash');

module.exports = ampersandModel.extend({

    initialize: function(opts) {
        var self = this;

        self.username = opts.username || uuid.v4();
        self.createSocket();
        function log(x){
            return console.log.bind(console, x);
        }
        self.on('connection:open', log('cx:open'));
        self.on('connection:data', log('cx:data'));
        self.on('socket:open', log('sock:open'));
    },

    createSocket: function() {
        var self = this,
            socket = self.socket = new Peer(self.username, {  // register w/ peer.js
                key: 'lwjd5qra8257b9'
            });

        // send available to connectTo
        socket.on('open', function() {
            self.trigger('socket:open');
        });

        // setup handlers (when someone connects to you)
        socket.on('connection', function(conn) {
            conn.on('open', function() {
                self.trigger('connection:open', conn);

                // incoming data events
                conn.on('data', function(data) {
                    console.log('[' + conn.peer + ']', data);
                    self.onData(data);
                });

                // send an ack
                conn.send('Hey, ' + conn.peer);
            });
        });
    },

    broadcast: function(event){
        var self = this;

        _.forEach(self.getPeers(), function(peerID){
            _.forEach(self.socket.connections[peerID], function(conn){
                conn.send(event);
                console.log('>>>>>',event);
            });
        });
    },

    onData: function(data) {
        var self = this;

        self.trigger("connection:data", {
            data: data
        });
    },

    connectToPeers: function(peers) {
        var self = this;

        return _.map(peers, function(peer) {
            self.connectToPeer(peer);
        });
    },

    connectToPeer: function(peer) {
        var self = this,
            connection = self.socket.connect(peer);

        connection.on('open', function () {
            console.log('connectToPeer > on open');
            self.trigger('connection:open', connection);

            connection.on('data', function (data) {
                console.log('connectToPeer > on open > on data', data);
                self.trigger("connection:data", {
                    connection: connection,
                    data: data
                });
            });

            connection.on('close', function () {
                self.trigger('connection:close');
            });

            // announce
            connection.send('Whattup!!');
        });

        return connection;
    },

    leaveRoom: function() {
        var self = this;

        // goodbye world
        self.trigger('socket:closed', self.socket.peer);
        self.socket.destroy();
    },

    getPeers: function() {
        var self = this;

        return _.keys(self.socket.connections);
    },

    removePeer:  $.noop,

    extraProperties: 'allow'
});
