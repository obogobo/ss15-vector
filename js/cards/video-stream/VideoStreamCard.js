var Card = require('../Card'),
    _ = require('lodash');

module.exports = Card.extend({
    innerTemplate: require('./VideoStreamCard.jade'),
    header: {
        title: 'Video Stream',
        icon: 'comments'
    },
    events: {
        'change #file': 'startAudioStream'
    },
    initialize: function(options) {
        var view = this;

        this.peer = options.peer;
        this.startVideoStream();
        this.on('show', function() {
            $('#my-vidya').prop('src', URL.createObjectURL(view.stream)).prop('muted', true);
            view.makeCalls();
        });

        this.on('hide', function() {
            // end video stream here
            view.stream && view.stream.close();
        });

        this.peer.on('call:received', function(call) {
              view.answerCall(call);
        })
    },

    startAudioStream: function(e) {
        var self = this,
            reader = new FileReader(),
            context = new AudioContext(),
            gainNode = context.createGain();

        gainNode.connect(context.destination);

        reader.onload = function(e) {
            context.decodeAudioData(e.target.result, function(buffer) {
                var soundSource = context.createBufferSource(),
                    destination;

                soundSource.buffer = buffer;
                soundSource.start(0, 0 / 1000);
                soundSource.connect(gainNode);

                destination = context.createMediaStreamDestination();
                soundSource.connect(destination);

                self.stream = destination.stream;
            });
        };

        reader.readAsArrayBuffer(e.target.files[0]);
    },

    startVideoStream: function() {
        var view = this;

        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            view.stream = stream;
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    },

    bindCallEvents: function(call) {
        var $video = $('<video id="' + call.peer + '" autoplay="autoplay" style="width:250px">');

        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            $video.prop('src', URL.createObjectURL(remoteStream)).insertAfter('#my-vidya');
        });

        call.on('close', function() {
            //debugger;
        });
    },

    makeCalls: function() {
        var receivers = this.peer.getPeers(),
            view = this;

        _.forEach(receivers, function(r) {
            view.bindCallEvents(view.peer.socket.call(r, view.stream));
        });
    },

    answerCall: function(call) {
        var view = this;
        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            call.answer(stream); // Answer the call with an A/V stream.
            view.bindCallEvents(call);
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    }
});