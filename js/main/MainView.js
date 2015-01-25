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
    'click [data-action="toggle-view"]': 'toggleView'
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
