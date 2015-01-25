var Card = require('../Card'),
    messageTemplate = require('./Message.jade'),
    fileTemplate = require('./FileLink.jade'),
    mkAvatar = require('../../util/avatar'),
    FileDialog = require('../files/FileDialog'),
    _ = require('lodash');

require('../../semantic-shim');

// 3*(2^31)/4 = 3*2^29
var MAX_FILE_SIZE = Math.pow(2,29)*3;

var SEND_CHUNK_SIZE = 2047;

module.exports = Card.extend({
    innerTemplate: require('./TextChatCard.jade'),
    header: {
        title: 'Text chat',
        icon: 'comments'
    },
    events: {
        'keyup [data-hook="entry"]': 'onKey',
        'click [data-add-file]': 'addFile'
    },
    initialize: function(opts){
        opts = opts || {};
        window.me = this.peer = opts.peer;
        if(this.peer) {
            this.peer.on('connection:data', this.onData.bind(this));
            this.peer.on('connection:open', this.enable.bind(this));
        }
        this.files = {};
        this.receivingFiles = {};
    },
    addFile: function(){
        console.log('addFile')
        var fileDialog = new FileDialog();
        fileDialog.on('file:selected', function(file){
            var metadata = {
                id: file.id,
                name: file.file.name,
                size: file.file.size,
                type: file.file.type,
                sender: this.peer.username
            };
            if(file.file.size > MAX_FILE_SIZE){
                alert('Sorry, only small files for now. Try something smaller than '+(Math.round(MAX_FILE_SIZE/1e7)/1e2)+'GB.');
                return;
            }
            this.files[file.id] = file;
            console.log(this);
            this.pushFile(metadata);
            this.peer.broadcast({
                type: 'file:available',
                data: metadata
            });
        }.bind(this));
        fileDialog.show();
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
        switch(data.type){
            case 'text-chat':
                return this.pushMessage({
                    sender: event.connection.peer,
                    image: mkAvatar(event.connection.peer),
                    contents: data.content
                });
            case 'file:available':
                return this.pushFile(data.data);
            case 'file:request':
                return this.sendFileOnConnection(event.connection, data.id);
            case 'file:chunk':
                return this.processFileChunk(data);
        }

    },
    processFileChunk: function(data){
        var localFile = this.receivingFiles[data.file],
            count,
            $progress = $(this.el).find('[data-file-progress="'+data.file+'"]');
        if(!localFile) {
            localFile = this.receivingFiles[data.file] = new Array(data.numChunks);
        }
        localFile[data.index] = data.chunk;
        count = _.filter(localFile, Boolean).length;
        // $progress.progress({percent: count*100/data.numChunks});
        // run thru, make sure there's no nullz
        if(_.every(localFile)){
            // we have the whole file
            var $a = $(this.el).find('a[data-file-id="'+data.file+'"]');
            $a.attr('href', localFile.join('')).attr('target','_blank');
            $a.removeAttr('disabled');
            $a.click();
            $progress.hide();
            // clear our memory
            this.receivingFiles[data.file] = localFile = null;
        }
    },
    loadFileAsDataURL: function(fileID, callback){
        var file = this.files[fileID],
            reader = new FileReader();

        if(!file) return callback();

        reader.onload = function(){
            callback(reader.result);
        };
        reader.readAsDataURL(file.file);
    },
    sendFileOnConnection: function(connection, fileID){
        console.log('Sending file to peer', connection.peer);
        this.loadFileAsDataURL(fileID, function(buffer){
            // TODO technically we need an error message here (no such file)
            if(!buffer) return;
            var NUMBER_OF_CHUNKS = Math.ceil(buffer.length/SEND_CHUNK_SIZE);
            _.forEach(_.range(NUMBER_OF_CHUNKS), function(n){
                var start = n*SEND_CHUNK_SIZE,
                    size = SEND_CHUNK_SIZE,
                    chunk;
                if(start+size >= buffer.length){
                    size = buffer.length - start;
                }
                chunk = buffer.slice(start,start+size);
                connection.send({
                    type: 'file:chunk',
                    file: fileID,
                    index: n,
                    numChunks: NUMBER_OF_CHUNKS,
                    chunk: chunk
                });
            });
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
    },
    pushFile: function(message){
        var $chatContent = $(this.queryByHook('chat-content')),
            $el = $(fileTemplate(message)),
            $a = $el.find('a[data-file-id]'),
            $progress = $el.find('.ui.progress');
        if(message.sender !== this.peer.username) $a.click(function(){
            $a.attr('disabled', true);
            var sender = $a.attr('data-file-sender'),
                fileID = $a.attr('data-file-id'),
                conn = this.peer.getOrCreateConnectionTo(sender);
            conn.send({
                type: 'file:request',
                id: fileID
            });
        }.bind(this));
        $chatContent.append($el);
    }

});
