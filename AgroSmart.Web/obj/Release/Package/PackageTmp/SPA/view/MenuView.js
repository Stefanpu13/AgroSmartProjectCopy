var menuView = (function () {

    var generateMenu = function (username) {
        var html = '';

        var items = ['Maps', 'Machines', 'Tasks', 'Mobile', 'Control'];

        html += '<ul class="nav navbar-nav">';

        var i = IS_ADMIN ? 0 : 1;

        for (; i < items.length; i++) {
            html += '<li>' +
                        '<a href="#' + items[i] + '">' +
                            items[i] +
                        '</a>' +
                    '</li>'
        };

        html += '</ul>';

        html += '<form class="navbar-form navbar-right">'+
                    '<div class="form-group">' +
                        '<span class="col-md-2 control-label">Потребител</span>' +
                    '</div>' +
                    '<div class="form-group">'+
                        '<span class="col-md-2 control-label">' + username + '</span>' +
                    '</div>' +
                    '<button type="submit" class="btn btn-success" id="btn-logout">Изход</button>' +
                '</form>'

        return html;
    }

    return {
        getMenu: generateMenu
    }
})();