var app, browserify, express, path;

express = require('express');

path = require('path');

browserify = require('browserify-middleware');

browserify.settings('transform', ['coffeeify', 'jadeify']);

browserify.settings('extensions', ['.coffee']);

app = express();

app.set('views', __dirname);

app.set('view engine', 'jade');

app.use('/js/app.js', browserify('./js/app.js'));

app.use(require('less-middleware')(__dirname));

app.use(express["static"](__dirname));

app.get('/', function(req, res) {
  return res.render('index');
});

app.use(function(req, res) {
  return res.status(404).send('Not found');
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000);
} else {
  module.exports = app;
}
