var Modal = require('../base/Modal'),
    $ = require('jquery'),
    Peer = require('../entity/Peer'),
    uuid = require('node-uuid');

var AmpersandView = require('ampersand-view');

require('../semantic-shim');


// JoinDialog

module.exports = AmpersandView.extend({
    template: require('./JoinDialog.jade'),
    autoRender: true,
    events: {
        'click .actions .positive.button': 'onSubmit'
    },
    onSubmit: function(){
        var username = $(this.queryByHook('username')).val(),
            targetPeer = $(this.queryByHook('connect-to')).val(),
            peer = new Peer({username: username});

        // peer.connectToPeer(targetPeer);
        console.log(targetPeer);

        this.trigger('peer:new', peer);
    },
    show: function(){
        var $modal = $(this.render().el);
        $('#modal-region').html('').append($modal);
        $modal.modal('show');
        if(this.onShow) this.onShow();
    },
    hide: function(){
        this.$modal.modal('hide');
    }
});
