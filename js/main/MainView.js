var AmpersandView = require('ampersand-view'),
    $ = require('jquery'),
    _ = require('lodash'),
    TextChatCard = require('../cards/text-chat/TextChatCard'),
    userListItemTpl = require('./UserListItem.jade'),
    VideoStreamCard = require('../cards/video-stream/VideoStreamCard');

module.exports = AmpersandView.extend({
  template: require('./MainView.jade'),
  autoRender: true,
  initialize: function(opts){
      opts = opts || {};
      this.peer = opts.peer;

      setInterval(this.updateUserList.bind(this), 5000);
      for(var i=100;i<5000;i*=1.5){
          setTimeout(this.updateUserList.bind(this), i);
      }
  },
  events: {
    'click [data-action="toggle-modules"]': 'toggleModules',
    'click [data-action="load-view"]': 'loadView'
  },
  cards: {
    textchat: TextChatCard,
    videostream: VideoStreamCard
  },
  updateUserList: function(){
      if(this.el){
          var peers = this.peer.getConnectedPeers(),
              n = peers.length,
              $list = $(this.el).find('[data-action="online-users"] .ui.comments');
          $(this.el).find('[data-action="online-users"] > .text').text(' '+(function(){
              if(n === 0) return 'Just you';
              return 'You + '+n;
              if(n === 1) return 'You + 1';
              return n+' people'
          })());
          $list.empty();
          $list.append(userListItemTpl({username:'You ('+this.peer.username+')'}));
          _.forEach(peers, function(peer){
              $list.append(userListItemTpl({username:peer}));
          });
      }
  },
  render: function(){
    AmpersandView.prototype.render.apply(this, arguments);
    var $el = $(this.el),
        $column = $el.find('.grid > .column').first();
    this.card = this.card || new TextChatCard({peer: this.peer});
    $column.empty().append(this.card.render().el);
    if(this.peer) {
        var inviteLink = document.location.origin + document.location.pathname + '#join/' + this.peer.username,
            emailBody = this.peer.username + " has invited you to chat.\n\nClick this link to join: "+inviteLink;
        $(this.queryByHook('username-display')).children('span').text(' '+this.peer.username);
        $(this.queryByHook('invite-link')).text(inviteLink);
        $(this.queryByHook('send-invite')).attr('href', 'mailto:?subject=Invite%20to%20chat&body='+encodeURIComponent(emailBody));
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
