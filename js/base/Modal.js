var AmpersandView = require('ampersand-view'),
    $ = require('jquery'),
    tpl = require('./Modal.jade');

require('../semantic-shim');

module.exports = AmpersandView.extend({
    show: function(){
        var $modal = this.$modal = $(tpl());
        this.render();
        $modal.find('[data-hook="content"]').append(this.el);
        $modal.find('[data-hook="title"]').text(this.title || this.constructor.prototype.title || '');
        var $actions = $modal.find('[data-hook="actions"]');
        var buttons = this.buttons || this.constructor.prototype.buttons;
        if(buttons) buttons.forEach(function(btn){
            var $btn = $('<a>', {'class':'ui button'});
            if(btn['class']) $btn.addClass(btn['class']);
            if(btn.icon){
                $btn.append('<i class="icon '+btn.icon+'"></i> ');
            }
            $btn.append(btn.text);
            $actions.append($btn);
        });
        $('#modal-region').html('').append($modal);
        $modal.modal('show');
    },
    hide: function(){
        this.$modal.modal('hide');
    }
});
