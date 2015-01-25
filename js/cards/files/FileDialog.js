var $,
    _ = require('lodash'),
    uuid = require('node-uuid');

var AmpersandView = require('ampersand-view');

require('../../semantic-shim');

$ = window.jQuery;


// CreateUserDialog

module.exports = AmpersandView.extend({
    template: require('./FileDialog.jade'),
    autoRender: true,
    initialize: function(opts){
        opts = opts || {};
        this.id = opts.id;
    },
    show: function(){
        var $modalRegion = $('#modal-region'),
            $modal = this.$modal = $(this.render().el),
            $fileSelect = $(this.queryByHook('real-file-input'));
        if(!$modalRegion.length){
            $('body').append($('<div>', {id:'modal-region'}));
            $modalRegion = $('#modal-region');
        }
        $('body').append($modal);
        $fileSelect.change(this.onFilesSelected.bind(this));
        $(this.queryByHook('select-file')).click(function(){
            $fileSelect.click();
        });
        $modal.modal('show');
        this.visible = true;
    },
    onFilesSelected: function(){
        var fileList = this.queryByHook('real-file-input').files;
        _.forEach(fileList, this.onFileSelected.bind(this));
    },
    onFileSelected: function(file){
        this.trigger('file:selected', {id: uuid.v4(), file: file});
        this.hide();
    },
    handleBuffer: function(file, buffer){

    },
    hide: function(){
        this.$modal.modal('hide');
        this.visible = false;
    }
});
