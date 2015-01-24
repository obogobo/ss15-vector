// # Require.JS configuration
requirejs.config({
  paths: {
    'ampersand-model': '/bower_components/ampersand-model/ampersand-model',
    'ampersand-router': '/bower_components/ampersand-model/ampersand-router',
    'ampersand-view': '/bower_components/ampersand-model/ampersand-view',
    'ampersand-state': '/bower_components/ampersand-model/ampersand-state',
    'ampersand-sync': '/bower_components/ampersand-model/ampersand-sync'
  },

  shim: {
    'ampersand-model':
  }
});

require(['./Router'], function(Router){

});
