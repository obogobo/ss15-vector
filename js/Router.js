var AmpersandRouter = require('ampersand-router'),
    LandingView = require('./landing/LandingView'),
    MainView = require('./main/MainView'),
    InviteDialog = require('./main/InviteDialog'),
    CreateUserDialog = require('./create/CreateUserDialog'),
    JoinDialog = require('./join/JoinDialog'),
    $ = require('jquery');


var Router = module.exports = AmpersandRouter.extend({

    routes: {
        // Landing page
        "": "landing",

        // Create a new room
        "new": "newRoom",
        "new/:id": "newRoom",
        "chat": "newRoom",

        // Join an existing room
        'join': 'joinRoom',
        "join/:id": "joinRoom"
    },

    setView: function(view){
        $('body').html('').append(view.render().el);
    },

    landing: function(){
        this.setView(new LandingView());
    },

    newRoom: function(id){
        var opts;
        if(id){
            opts = {id:id};
        }
        var dialog = new CreateUserDialog(opts);
        dialog.show();
        dialog.on('peer:new', this.createRoomWithPeer.bind(this));
    },

    joinRoom: function(id){
        var opts;
        if(id){
            opts = {id: id};
        }
        var dialog = new JoinDialog(opts);
        dialog.show();
        dialog.on('peer:new', this.createRoomWithPeer.bind(this));
    },

    createRoomWithPeer: function(peer){
        var view = new MainView({peer: peer});
        this.setView(view);

        // The #chat hash is just for looks. If we come in on this hash, then
        // we need to prompt the user for a screen name.
        if(history.pushState) {
            history.pushState(null, null, '#chat');
        }
        else {
            location.hash = '#chat';
        }
    }
});
