var AmpersandView = require('ampersand-view'),
    $ = require('jquery'),
    _ = require('lodash'),
    TextChatCard = require('../cards/text-chat/TextChatCard'),
    userListItemTpl = require('./UserListItem.jade'),
    VideoStreamCard = require('../cards/video-stream/VideoStreamCard'),
    mkAvatar = require('../util/avatar');

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

      this.peer.on('call:received', this.onCallReceived.bind(this));
  },
  events: {
    'click [data-action="toggle-modules"]': 'toggleModules',
    'click [data-action="toggle-view"]': 'toggleView',
    'click [data-action="now-playing"]': 'selectMusic',
    'change #music-picker': 'onMusicPickerSelection',
    'click [data-action="toggle-invite"]': 'toggleInvite'
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
          $list.append(userListItemTpl({
              username:'You ('+this.peer.username+')',
              image: mkAvatar(this.peer.username)
          }));
          _.forEach(peers, function(peer){
              $list.append(userListItemTpl({username:peer,image: mkAvatar(peer)}));
          });
      }
  },
  selectMusic: function(){
      $('#music-picker').click();
  },
  onCallReceived: function(call){
        var self = this,
            meta = call.metadata;

        $('[data-action="now-playing"] > span').text(meta.filename);

        call.on('error', console.log.bind(console,' CALL ERROR!!'));
        call.on('close', console.log.bind(console,' CALL CLOSED!!'));

        call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            $('#current-music').prop('src', URL.createObjectURL(remoteStream));
        });
        call.answer(); // Answer the call with an A/V stream.

  },
  onMusicPickerSelection: function(e) {
      var self = this,
          reader = new FileReader(),
          context = new AudioContext(),
          gainNode = context.createGain(),
          musicFile;

      gainNode.connect(context.destination);
      gainNode.gain.value = 0;

      reader.onload = function(e) {
          context.decodeAudioData(e.target.result, function(buffer) {
              var soundSource = context.createBufferSource(),
                  destination,
                  stream;

              soundSource.buffer = buffer;
              soundSource.start(0, 0 / 1000);
              soundSource.connect(gainNode);

              destination = context.createMediaStreamDestination();
              soundSource.connect(destination);

              stream = destination.stream;

              self.peer.broadcastStream(stream, {
                  type: 'music',
                  filename: musicFile.name
              });

              $('#current-music').prop('src', URL.createObjectURL(stream));

              $('[data-action="now-playing"] > span').text(musicFile.name);
          });
      };

      reader.readAsArrayBuffer(musicFile = e.target.files[0]);
  },
  render: function(){
    AmpersandView.prototype.render.apply(this, arguments);
    var $el = $(this.el), $textColumn = $el.find('#textchat'),
        $videoColumn = $el.find('#videostream');

    this.textchat = new TextChatCard({ peer: this.peer });
    this.videostream = new VideoStreamCard({ peer: this.peer });
    $textColumn.append(this.textchat.render().el);
    $videoColumn.append(this.videostream.render().el);

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

  toggleInvite: function(){
      var $submenu = $(this.queryByHook('invite-submenu')),
      visible = $submenu.is(':visible');
      if(visible){
          $submenu.slideUp();
      } else {
          $submenu.slideDown();
      }
  },
  getNumVisibleViews: function() {
    return $(this.el).find('.card-container:visible').length;
  },
  renderFullScreen: function() {
    $(this.el).find('.card-container:visible').removeClass('six ten wide').addClass('sixteen wide');
  },
  toggleView: function(e) {
      var $menuItem = $(e.target),
          viewId = $menuItem.data('view'),
          $view = $(this.el).find('#' + viewId);
      if ($view.is(':visible')) {
          if (this.getNumVisibleViews() == 1) {
              return;
          }
          $view.removeClass('six ten sixteen wide').hide();
          this.renderFullScreen();
          this[viewId].trigger('hide');
      } else {
          $(this.el).find('#videostream').removeClass('sixteen wide').addClass('ten wide').show();
          $(this.el).find('#textchat').removeClass('sixteen wide').addClass('six wide').show();
          this[viewId].trigger('show');
      }
  }
});
