var Card = require('../Card');

module.exports = Card.extend({
    innerTemplate: require('./VideoStreamCard.jade'),
    header: {
        title: 'Video Stream',
        icon: 'comments'
    },
    events: {
        'click div[data-action="make-call"]': 'makeCall',
        'click div[data-action="answer-call"]': 'answerCall'
    },
    initialize: function(options) {
        var view = this;

        this.peer = options.peer;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
    startVideoStream: function() {
        var view = this;
        navigator.getUserMedia({ video: true, audio: true }, function(stream) {
            view.stream = stream;
            $('#my-vidya').prop('src', URL.createObjectURL(stream));
        }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    },
    makeCall: function(e) {
        var receiver = 'mcbex1',
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