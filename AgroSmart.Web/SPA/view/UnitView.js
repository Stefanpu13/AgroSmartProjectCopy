var unitView = (function () {

    var generateUnitList = function (containerId, units) {
        var html ='';

        html +=
            '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                    '<h3 class="panel-title">Машини</h3>' +
                '</div>' +
                '<div class="panel-body" id="panel-units">';
        if (IS_ADMIN) {
            html += '<button class="btn btn-success btn-lg pull-right" type="button" id="add-unit-form">' +
                        '<span class="glyphicon glyphicon-plus"></span>' +
                    '</button>';
        };
                    
               html+= '</div>' +
                '<table class="table table-striped" id="' + containerId + '">' +
                    '<thead>' +                    
                        '<tr>' +
                            '<th class="col-xs-1 col-md-2">#</th>' +
                            '<th class="col-xs-5 col-md-4">Име</th>' +
                            '<th class="col-xs-5 col-md-4">Потребител</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';
        var index = 1;
        for (var i = 0; i < units.length; i++) {
            html += '<tr>' +
                        '<td>' + index + '</td>' +
                        '<td class="editable" id="' + units[i].id + '">' + units[i].name + '</td>';
                            if (units[i].user!==null) {
                                html += '<td id="' + units[i].user.id + '">' + units[i].user.username;
                                if (IS_ADMIN) {
                                    html += '<buton class="btn btn-default btn-sm" id="btn-remove-user"><span class="glyphicon glyphicon-remove"></span></button>';
                                };
                                html += '</td>';
                            } else {
                                if (IS_ADMIN) {
                                    html += '<td><buton class="btn btn-default btn-sm" id="btn-select-user"><span class="glyphicon glyphicon-plus"></span></button></td>';
                                } else {
                                    html += '<td></td>';
                                }
                            }                        
            html += '</tr>';
            index++;
            };                    

        html +='</tbody></table></div>';
        return html;
        
    };

    var generateOnlyListOfUnits = function (units) {
        var html = '';

        var index = 1;
        for (var i = 0; i < units.length; i++) {
            html += '<tr>' +
                         '<td>' + index + '</td>' +
                         '<td class="editable" id="' + units[i].id + '">' + units[i].name + '</td>';
                            if (units[i].user !== null) {
                                html += '<td id="' + units[i].user.id + '">' + units[i].user.username;
                                if (IS_ADMIN) {
                                    html += '<buton class="btn btn-default btn-sm" id="btn-remove-user"><span class="glyphicon glyphicon-remove"></span></button>';
                                };
                                html += '</td>';
                            } else {
                                if (IS_ADMIN) {
                                    html += '<td><buton class="btn btn-default btn-sm" id="btn-select-user"><span class="glyphicon glyphicon-plus"></span></button></td>';
                                } else {
                                    html += '<td></td>';
                                }
                            }
            html += '</tr>';
            index++;
        };

        return html;        
    };

    var generateFormInput = function (inputText) {
        var html = '';

        html +=
            '<div class="row">' +
                '<div class="col-md-8">' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control input-sm" value="' + inputText + '"/>' +
                        '<span class="input-group-btn">' +
                            '<button class="btn btn-default btn-sm" type="button" id="ok-unit-form">' +
                                '<span class="glyphicon glyphicon-ok"></span>' +
                            '</button>' +
                            '<button class="btn btn-default btn-sm" type="button" id="cancel-unit-form">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +                            
                            '</button>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';

        return html;
    };

    var generateSelectInput = function (users) {
        var usersHtml = '<option value="">Моля изберете потребител</option>';
        for (var i = 0; i < users.length; i++) {
            usersHtml += '<option id="' + users[i].id + '" value="' + users[i].id + '">' + users[i].username + '</option>';
        };

        var html = '';

        html +=
            '<div class="row">' +
                '<div class="col-md-8">' +
                    '<div class="input-group">' +
                        '<select class="form-control input-sm" id="usersDropDown">' +
                            usersHtml +
                        '</select>' +
                        '<span class="input-group-btn">' +
                            '<button class="btn btn-default btn-sm" type="button" id="ok-user-form">' +
                                '<span class="glyphicon glyphicon-ok"></span>' +
                            '</button>' +
                            '<button class="btn btn-default btn-sm" type="button" id="cancel-user-form">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';

        return html;
    };

    var generateNewUnitForm = function (containerId) {
        var html = '';
        html += '<div id="' + containerId + '">' +
                    '<form class="form-horizontal" role="form">' +
                         '<ul class="text-danger"></ul>' +
                         '<div class="form-group">' +
                            '<label for="name-unit" class="col-md-2 control-label">Име на машина</label> ' +
                            '<div class="col-md-10">' +
                                '<input type="text" id="name-unit" class="form-control" /><span class="validationMessage" style="display: none;"></span>' +
                            '</div>' +
                         '</div>' +
                        '<div class="form-group">' +
                            '<div class="col-md-offset-2 col-md-10">' +
                                '<button id="btn-add-unit" type="button" class="btn btn-default">Добави</button>' +
                                '<button id="btn-cancel-unit" type="button" class="btn btn-default">Отказ</button>' +
                            '</div>' +
                        '</div>' +
                    '</form>' +
                '</div>';
        return html;
    }

    return {
        getUnitList: generateUnitList,
        getFormInput: generateFormInput,
        getNewUnitForm: generateNewUnitForm,
        getOnlyListOfUnits: generateOnlyListOfUnits,
        getSelectInput: generateSelectInput
    };
})();