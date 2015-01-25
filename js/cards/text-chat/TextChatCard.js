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
        window.me = this.peer = opts.peer;
        if(this.peer){
            this.peer.on('connection:data', this.onData.bind(this));
        }
    },
    onData: function(event){
        var data = event.data;
        console.log('got data for our chat!', data);
        if(data.type !== 'text-chat') return;
        $(this.queryByHook('chat-content')).append('<p><tt>['+(event.connection && event.connection.peer)+']</tt>'+data.content+'</p>');
    },
    onKey: function(e){
        var $field = $(e.target), entry = $field.val();
        if(e.which !== 13) return;
        $field.val('');
        if(this.peer){
            console.log('broadcasting', entry)
            this.peer.broadcast({
                type: 'text-chat',
                content: entry
            });
        }
    }

});
