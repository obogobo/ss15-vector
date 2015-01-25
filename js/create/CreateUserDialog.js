var Modal = require('../base/Modal'),
    $ = require('jquery'),
    Peer = require('../entity/Peer');

var AmpersandView = require('ampersand-view');

require('../semantic-shim');


// CreateUserDialog

module.exports = AmpersandView.extend({
    template: require('./CreateUserDialog.jade'),
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
            peer = new Peer({username: username});

        error = false;

        if(!username){
            error = true;
            $username.parent().addClass('error');
            return;
        }

        window.me = peer;
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
            $(this.queryByHook('username')).val(this.id);
        }
        if(this.onShow) this.onShow();
    },
    hide: function(){
        this.$modal.modal('hide');
    }
});
