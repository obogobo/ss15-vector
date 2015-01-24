var Modal = require('../base/Modal'),
    $ = require('jquery');

module.exports = Modal.extend({
    template: require('./InviteDialog.jade'),
    autoRender: true,
    title: "Invite someone to your room",
    buttons: [
        {
            "class": "positive",
            "text": "Okay"
        }
    ]
});
