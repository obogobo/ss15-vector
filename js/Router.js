var AmpersandRouter = require('ampersand-router'),
    LandingView = require('./landing/LandingView'),
    MainView = require('./main/MainView'),
    InviteDialog = require('./main/InviteDialog'),
    CreateUserDialog = require('./create/CreateUserDialog'),
    JoinDialog = require('./join/JoinDialog'),
    $ = require('jquery');


var Router = module.exports = AmpersandRouter.extend({
    routes: {
        "": "landing",
        "_/:id": "joinRoom",
        "new": "newRoom",
        'join': 'joinRoom'
    },
    setView: function(view){
        $('body').html('').append(view.render().el);
    },
    landing: function(){
        this.setView(new LandingView());
    },
    joinRoom: function(id){
        this.setView(new MainView());
        new InviteDialog({id: id}).show();
    },
    newRoom: function(){
        var dialog = new CreateUserDialog();
        dialog.show();
        dialog.on('peer:new', this.createRoomWithPeer.bind(this));
    },
    joinRoom: function(){
        var dialog = new JoinDialog();
        dialog.show();
        dialog.on('peer:new', this.createRoomWithPeer.bind(this));
    },
    createRoomWithPeer: function(peer){
        var view = new MainView({peer: peer});
        this.setView(view);
    }
});
