var Card = require('../Card');

module.exports = Card.extend({
    innerTemplate: require('./VideoStreamCard.jade'),
    header: {
        title: 'Video Stream',
        icon: 'comments'
    },
    events: {
        'click div[data-action="make-call"]': 'makeCall',
        'click div[data-action="answer-call"]': 'answerCall',
        'change #file': 'startAudioStream'
    },

    initialize: function(options) {
        var view = this;

        this.peer = options.peer;
        this.on('show', function() {
            view.startVideoStream();
        });

        this.on('hide', function() {
            // end video stream here
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
            // view.stream = stream;
            $('#my-vidya').prop('src', URL.createObjectURL(stream));
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    },

    makeCall: function(e) {
        var receiver = 'jcw',
            call = this.peer.socket.call(receiver, this.stream);

        $(e.target).text('Calling ' + receiver + '...');
        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            $('#ur-vidya').prop('src', URL.createObjectURL(remoteStream));
        });
    },

    answerCall: function(call) {
        $('div.pink').hide();
        $('div.teal').show();
        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                $('#ur-vidya').prop('src', URL.createObjectURL(remoteStream));
            });
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    }
});