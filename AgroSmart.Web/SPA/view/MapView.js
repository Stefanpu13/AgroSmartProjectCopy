var mapView = (function () {
    var generateMap = function (containerId) {
        var menuContainerHTML = '',
            html = '',
            container = $('#' + containerId);

        menuContainerHTML +=
            '<div id="menu-container">' +
                '<div class="btn btn-primary map-btn" id="toggle-edit-btn">Enable Editing</div>' +
                '<div id="region-menu-container">'+
                    '<div class="btn btn-primary btn-block map-btn region-btn">Build region</div>' +
                    '<div class="btn btn-primary btn-block map-btn region-btn">Edit region info</div>' +
                    '<div class="btn btn-primary btn-block map-btn region-btn">Delete region</div>' +
                '</div>' +
                '<div id="region-point-menu-container">' +
                    '<div class="btn btn-primary btn-block map-btn region-btn">Build region</div>' +
                    '<div class="btn btn-primary btn-block map-btn region-btn">Edit region info</div>' +
                   
                '</div>' +
                '<div class="btn btn-primary map-btn" id="save-all-btn"> Save all regions </div>' +
            '</div>'

        container.html(menuContainerHTML);
        
        html +=
            '<div id="dialog-form">' +
                '<p id="error-content">Fill in region name and description</p>' +
                '<form>' +
                    '<fieldset>' +
                        '<label for="name">Region Name</label>' +
                        '<input type="text" name="name" id="name" class="regionInfo ui-widget-content ui-corner-all">' +
                        '<label for="descritpion">Region Description</label>' +
                        '<textarea name="descritpion" id="descritpion" class="regionInfo ui-widget-content ui-corner-all"></textarea>' +
                    '</fieldset>' +
                '</form>' +
            '</div>';

        html += '<div id="map-canvas" />';

        container.append(html);

        return html;
    };


    return {       
        generateMap: generateMap
    };
})();