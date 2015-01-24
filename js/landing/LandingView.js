var AmpersandView = require('ampersand-view'),
    uuid = require('node-uuid');

module.exports = AmpersandView.extend({
  template: require('./LandingView.jade'),
  autoRender: true,
  events: {
    'click [data-action="create-room"]': "createRoom"
  },
  createRoom: function(){
    var id = uuid.v4();
    document.location.hash = '_/'+id;
  }
});
