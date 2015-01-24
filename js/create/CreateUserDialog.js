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
        'click .actions .positive.button': 'onSubmit'
    },
    onSubmit: function(){
        debugger;
        var username = $(this.queryByHook('username')).val(),
            peer = new Peer({username: username});

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
