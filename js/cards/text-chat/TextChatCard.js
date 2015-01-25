var Card = require('../Card');

module.exports = Card.extend({
    innerTemplate: require('./TextChatCard.jade'),
    header: {
        title: 'Text chat',
        icon: 'comments'
    },
    events: {
        'keyup [data-hook="entry"]': 'onKey'
    },
    initialize: function(opts){
        opts = opts || {};
        this.peer = opts.peer;
        if(this.peer){
            this.peer.on('connection:data', this.onData.bind(this));
        }
    },
    onData: function(data){
        if(data.type !== 'text-chat') return;
        $(this.queryByHook('chat-content')).append('<p>'+data.content+'</p>');
    },
    onKey: function(e){
        var $field = $(e.target), entry = $field.val();
        if(e.which !== 13) return;
        $field.val('');
        if(this.peer){
            this.peer.broadcast({
                type: 'text-chat',
                content: entry
            });
        }
    }

});
