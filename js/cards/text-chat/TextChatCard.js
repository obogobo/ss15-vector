var Card = require('../Card'),
    messageTemplate = require('./Message.jade'),
    mkAvatar = require('../../util/avatar');

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
        if(this.peer) {
            this.peer.on('connection:data', this.onData.bind(this));
            this.peer.on('connection:open', this.enable.bind(this));
        }
    },
    enable: function(){
        var $field = $(this.queryByHook('chat-content')),
            n = this.peer.getPeers().length,
            text = (function(){
                if(n===0) return 'No users online';
                if(n===1) return '1 connected user';
                return n+' connected users';
            });
        $field.removeAttr('disabled');

        $(this.el).find('.ribbon').text(text);
    },
    onData: function(event){
        var data = event.data;
        console.log('got data for our chat!', data);
        if(data.type !== 'text-chat') return;
        this.pushMessage({
            sender: event.connection.peer,
            image: mkAvatar(event.connection.peer),
            contents: data.content
        });
    },
    onKey: function(e){
        var $field = $(e.target),
            entry = $field.val();
        if(e.which !== 13 || !entry.trim()) return;
        $field.val('');
        this.pushMessage({
            sender: this.peer.username,
            image: mkAvatar(this.peer.username),
            contents: entry
        });
        if(this.peer){
            console.log('broadcasting', entry)
            this.peer.broadcast({
                type: 'text-chat',
                content: entry
            });
        }
    },
    pushMessage: function(message){
        var $chatContent = $(this.queryByHook('chat-content'));
        $chatContent.append(messageTemplate(message));
    }

});
