var AmpersandRouter = require('ampersand-router'),
    LandingView = require('./landing/LandingView'),
    MainView = require('./main/MainView'),
    InviteDialog = require('./main/InviteDialog')
    $ = require('jquery');


var Router = module.exports = AmpersandRouter.extend({
  routes: {
    "": "landing",
    "_/:id": "room"
  },
  setView: function(view){
    $('body').html('').append(view.render().el);
  },
  landing: function(){
    this.setView(new LandingView());
  },
  room: function(id){
    this.setView(new MainView());
    new InviteDialog({id: id}).show();
  }
});
