var mapView = (function () {
    var generateEditableMap = function (containerId) {
        var html = '';
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

        return html;
    };

    var generateControlMap = function (containerId) {
        var html = '';
        html += '<div id="map-canvas" />';

        return html;
    };

    var generateMobileMap = function (containerId) {
        var html = ''

        return html;
    };

    var generateMap = function (containerId, viewMode) {
        var html;
        switch (viewMode) {
            case 'edit':
                html = generateEditableMap(containerId);
                break;
            case 'control':
                html = generateControlMap(containerId);
            case 'mobile':
                html = generateMobileMap(containerId);
                break;
            default:
                break;
        }

        return html;
    };


    return {       
        generateMap: generateMap
    };
})();