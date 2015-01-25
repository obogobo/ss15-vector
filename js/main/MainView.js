var AmpersandView = require('ampersand-view'),
    $ = require('jquery'),
    TextChatCard = require('../cards/text-chat/TextChatCard'),
    VideoStreamCard = require('../cards/video-stream/VideoStreamCard');

module.exports = AmpersandView.extend({
  template: require('./MainView.jade'),
  autoRender: true,
  initialize: function(opts){
      opts = opts || {};
      this.peer = opts.peer;
  },
  events: {
    'click [data-action="toggle-modules"]': 'toggleModules',
    'click [data-action="load-view"]': 'loadView'
  },
  cards: {
    textchat: TextChatCard,
    videostream: VideoStreamCard
  },
  render: function(){
    AmpersandView.prototype.render.apply(this, arguments);
    var $el = $(this.el), $column = $el.find('.grid > .column').first();
    this.card = this.card || new TextChatCard({peer: this.peer});
    $column.empty().append(this.card.render().el);
    if(this.peer) {
        $(this.queryByHook('username-display')).children('span').text(' '+this.peer.username);
    }
    $el.find('.ui.dropdown').dropdown({action:'nothing'});
    $el.find('.ui.checkbox').checkbox();
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
  },
  loadView: function(e) {
      var view = $(e.target).data('view');

      this.card = new this.cards[view]({ peer: this.peer });
      this.render();
      this.card.trigger('rendered');
  }
});
