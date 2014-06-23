/// <reference path="../_references.js" />
var MenuController = function () { };

MenuController.prototype = {
    containerId: null,
    username: null,

    init: function (containerId, username) {
        this.containerId = containerId;
        this.username = username;
        
    },

    generateLayout: function () {
        var menuHtml = menuView.getMenu(this.username);
        $('#' + this.containerId).html(menuHtml);
        this.attachHandlers();
    },

    attachHandlers: function () {
        var self = this;        
    }
};