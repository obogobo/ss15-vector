var AmpersandView = require('ampersand-view'),
    $ = require('jquery');

module.exports = AmpersandView.extend({
    template: require('./Card.jade'),
    render: function(){
        var $cardContents, $header;
        this.renderWithTemplate();
        $cardContents = $(this.queryByHook('card-contents'));
        $header = $(this.el).find('.top.attached.header');
        if(this.constructor.prototype.header){
            $(this.queryByHook('card-icon')).addClass(this.constructor.prototype.header.icon || '');
            $(this.queryByHook('card-title')).text(this.title || this.constructor.prototype.header.title || '');
        } else {
            $header.hide();
            $cardContents.removeClass('bottom attached');
        }
        $cardContents.html(this.renderContents());
        return this;
    },
    renderContents: function(){
        return this.innerTemplate(this);
    }
});
