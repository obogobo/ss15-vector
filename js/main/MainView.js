var AmpersandView = require('ampersand-view'),
    $ = require('jquery'),
    TextChatCard = require('../cards/text-chat/TextChatCard');

module.exports = AmpersandView.extend({
  template: require('./MainView.jade'),
  autoRender: true,
  initialize: function(opts){
      opts = opts || {};
      this.peer = opts.peer;
  },
  events: {
    'click [data-action="toggle-modules"]': 'toggleModules'
  },
  render: function(){
    AmpersandView.prototype.render.apply(this, arguments);
    var $column = $(this.el).find('.grid > .column').first();
    var card = new TextChatCard({peer: this.peer});
    $column.append(card.render().el);
    if(this.peer) {
        $(this.queryByHook('username-display')).append(' '+this.peer.username);
    }
    return this;
  },
  toggleModules: function(){
    var $submenu = $(this.queryByHook('modules-submenu')),
        visible = $submenu.is(':visible');
    if(visible){
      $submenu.slideUp();
    } else {
      $submenu.slideDown();
    }
  }
});
