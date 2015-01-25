var AmpersandView = require('ampersand-view'),
    uuid = require('node-uuid');

module.exports = AmpersandView.extend({
  template: require('./LandingView.jade'),
  autoRender: true
});
