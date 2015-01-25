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
        'click .actions .positive.button': 'onSubmit',
        'keyup [data-submittable]': 'onKeyup'
    },
    initialize: function(opts){
        opts = opts || {};
        this.id = opts.id;
    },
    onSubmit: function(){
        var $username = $(this.queryByHook('username')),
            username = $username.val(),
            $targetPeer = $(this.queryByHook('connect-to')),
            targetPeer = $targetPeer.val(),
            peer = new Peer({username: username}),
            error = false;

        if(!username){
            error = true;
            $username.parent().addClass('error');
        }

        if(!targetPeer){
            error = true;
            $targetPeer.parent().addClass('error');
        }

        if(error) return;

        peer.connectToPeer(targetPeer);
        console.log(targetPeer);

        this.trigger('peer:new', peer);
    },
    onKeyup: function(e){
        if(e.which === 13) this.onSubmit();
    },
    show: function(){
        var $modal = $(this.render().el);
        $('#modal-region').html('').append($modal);
        $modal.modal('show');

        if(this.id) {
            $(this.queryByHook('connect-to')).val(this.id);
        }
        if(this.onShow) this.onShow();
    },
    hide: function(){
        this.$modal.modal('hide');
    }
});
