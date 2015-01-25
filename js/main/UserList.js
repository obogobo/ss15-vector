var AmpersandView = require('ampersand-view'),
    $ = require('jquery');

module.exports = AmpersandView.extend({
    initialize: function(opts){
        // if you forget to pass in `opts`, that's your fault
        // and your program deserves to crash here
        this.peer = opts.peer;
    },
    render: function(){

        return this;
    }
});
