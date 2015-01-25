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

        // x-browser
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
                    self.onData(data, conn);
                });

            });
        });

        socket.on('call', function(call) {
            self.trigger('call:received', call);
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

    onData: function(data, connection) {
        var self = this;

        // f-yeah switch
        switch(data.type){
            case 'peer-list':
                return self.connectToPeers(_.filter(data.peers, function(peer){
                    return peer !== self.username;
                }));
            case 'request-peers':
                // send a list of connected peers
                return connection.send({
                    type: 'peer-list',
                    peers: self.getPeers()
                });
        }

        self.trigger("connection:data", {
            data: data,
            connection: connection
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

            if(self.getPeers().length === 1){
                connection.send({type:'request-peers'});
            }

            connection.on('data', function (data) {
                console.log('connectToPeer > on open > on data', data);
                self.onData(data, connection);
            });

            connection.on('close', function () {
                self.trigger('connection:close');
            });
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

    getConnectedPeers: function(){
        var self = this;

        return _.pairs(self.socket.connections).map(function(pair){
            var peerName = pair[0],
                connections = pair[1];

            return (connections.filter(function(conn){
                return conn.open;
            }).length) && peerName;
        }).filter(_.identity);
    },

    receiveCall: function() {
        self.on('call', function(call) {
            self.trigger('call:received', call);
        });
    },

    removePeer:  $.noop,

    extraProperties: 'allow'
});
