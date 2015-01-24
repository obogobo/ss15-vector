var Card = require('../Card');

module.exports = Card.extend({
  innerTemplate: require('./TextChatCard.jade'),
  header: {
      title: 'Text chat',
      icon: 'comments'
  }
});
