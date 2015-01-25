var Card = require('../Card'),
    _ = require('lodash');

module.exports = Card.extend({
    innerTemplate: require('./VideoStreamCard.jade'),
    header: {
        title: 'Video Stream',
        icon: 'comments'
    },
    calls: {},
    initialize: function(options) {
        var view = this;

        this.peer = options.peer;
        this.on('show', function() {
            view.startVideoStream();
        });

        this.on('hide', function() {
            // end video stream here
            view.stream && view.stream.close();
        });

        this.peer.on('call:received', function(call) {
            if ($('#my-vidya').is(':visible')) {
                view.answerCall(call);
            } else {
                // call.close(view.stream);
            }
        })
    },

    startVideoStream: function() {
        var view = this;

        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            $('#my-vidya').prop('src', URL.createObjectURL(stream)).prop('muted', true);
            view.stream = stream;
            view.makeCalls();
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    },

    bindCallEvents: function(call) {
        var $video = $('<video id="' + call.peer + '" autoplay>'),
            view = this;

        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            if (!view.calls[call.peer]) {
                view.calls[call.peer] = call;
                $video.prop('src', URL.createObjectURL(remoteStream)).insertAfter('#my-vidya');
            }
        });

    },

    makeCalls: function() {
        var receivers = this.peer.getPeers(),
            view = this;

        _.forEach(receivers, function(r) {
            if (!view.calls[r]) {
                view.bindCallEvents(view.peer.socket.call(r, view.stream));
            }
        });
    },

    answerCall: function(call) {
        var view = this;
        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            if (!view.calls[call.peer]) {
                call.answer(stream); // Answer the call with an A/V stream.
                view.bindCallEvents(call);
            }
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    }
});
