/// <reference path="APIScripts/MapBuilder.js" />
/// <reference path="APIScripts/MapManager.js" />
/// <reference path="Scripts/jquery-2.1.1.js" />

$(function () {
    var isEditMode = true,
        blocks = JSON.parse(localStorage.getItem('blocks'));

    mapManager.createMap('map-canvas', isEditMode, blocks);  
});